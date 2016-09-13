'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tusJsClient = require('tus-js-client');

var _tusJsClient2 = _interopRequireDefault(_tusJsClient);

var _UppySocket = require('../utils/UppySocket');

var _UppySocket2 = _interopRequireDefault(_UppySocket);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Tus resumable file uploader
 */
var Tus10 = function (_EventEmitter) {
  _inherits(Tus10, _EventEmitter);

  function Tus10(opts) {
    _classCallCheck(this, Tus10);

    // set default options
    var _this = _possibleConstructorReturn(this, (Tus10.__proto__ || Object.getPrototypeOf(Tus10)).call(this));

    var defaultOptions = {
      resume: true,
      allowPause: true
    };

    // merge default options with the ones set by user
    _this.opts = Object.assign({}, defaultOptions, opts);
    return _this;
  }

  /**
   * Start uploading for batch of files.
   * @param  {Array} files Files to upload
   * @return {Promise}       Resolves when all uploads succeed/fail
   */


  _createClass(Tus10, [{
    key: 'start',
    value: function start(files) {
      var _this2 = this;

      var total = files.length;

      var uploaders = files.map(function (file, index) {
        var current = parseInt(index, 10) + 1;

        if (file.isRemote) {
          return _this2.uploadRemote(file, current, total);
        }

        return _this2.upload(file, current, total);
      });

      return Promise.all(uploaders).then(function () {
        return {
          uploadedCount: files.length
        };
      });
    }

    /**
     * Create a new Tus upload
     *
     * @param {object} file for use with upload
     * @param {integer} current file in a queue
     * @param {integer} total number of files in a queue
     * @returns {Promise}
     */

  }, {
    key: 'upload',
    value: function upload(file, current, total) {
      var _this3 = this;

      // Create a new tus upload
      return new Promise(function (resolve, reject) {
        var upload = new _tusJsClient2.default.Upload(file.data, {

          // TODO merge this.opts or this.opts.tus here
          metadata: file.meta,
          resume: _this3.opts.resume,
          endpoint: _this3.opts.endpoint,

          onError: function onError(err) {
            reject('Failed because: ' + err);
          },
          onProgress: function onProgress(bytesUploaded, bytesTotal) {
            console.log('progress:');
            console.log(bytesUploaded / bytesTotal);
            // Dispatch progress event
            _this3.emit('progress', {
              uploader: _this3,
              id: file.id,
              bytesUploaded: bytesUploaded,
              bytesTotal: bytesTotal
            });
          },
          onSuccess: function onSuccess() {
            console.log('success!');
            _this3.emit('success', file.id, upload.url);
            resolve(upload);
          }
        });

        _this3.on('abort', function (fileID) {
          // If no fileID provided, abort all uploads
          if (fileID === file.id || !fileID) {
            console.log('aborting file upload: ', fileID);
            upload.abort();
            resolve('upload ' + fileID + ' was aborted');
          }
        });

        _this3.on('pause', function (fileID) {
          // If no fileID provided, pause all uploads
          if (fileID === file.id || !fileID) {
            upload.abort();
          }
        });

        _this3.on('resume', function (fileID) {
          // If no fileID provided, resume all uploads
          if (fileID === file.id || !fileID) {
            upload.start();
          }
        });

        upload.start();
        _this3.emit('file-upload-started', file.id, upload);
      });
    }
  }, {
    key: 'uploadRemote',
    value: function uploadRemote(file, current, total) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var remoteHost = _this4.opts.remoteHost ? _this4.opts.remoteHost : file.remote.host;
        fetch(remoteHost + '/' + file.remote.provider + '/get', {
          method: 'post',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.assign({}, file.remote.body, {
            target: _this4.opts.endpoint,
            protocol: 'tus'
          }))
        }).then(function (res) {
          if (res.status < 200 && res.status > 300) {
            return reject(res.statusText);
          }

          res.json().then(function (data) {
            // get the host domain
            var regex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;
            var host = regex.exec(remoteHost)[1];

            var token = data.token;
            var socket = new _UppySocket2.default({
              target: 'ws://' + host + ':3020/api/' + token
            });

            socket.on('progress', function (progressData) {
              var progress = progressData.progress;
              var bytesUploaded = progressData.bytesUploaded;
              var bytesTotal = progressData.bytesTotal;


              if (progress) {
                console.log(progress);
                // Dispatch progress event
                _this4.emit('progress', {
                  uploader: _this4,
                  id: file.id,
                  bytesUploaded: bytesUploaded,
                  bytesTotal: bytesTotal
                });

                if (progress === '100.00') {
                  socket.close();
                  return resolve();
                }
              }
            });
          });
        });
      });
    }
  }, {
    key: 'abort',
    value: function abort(fileID) {
      this.emit('abort', fileID);
    }
  }, {
    key: 'pause',
    value: function pause(fileID) {
      this.emit('pause', fileID);
    }
  }, {
    key: 'resume',
    value: function resume(fileID) {
      this.emit('resume', fileID);
    }
  }, {
    key: 'abortAll',
    value: function abortAll() {
      this.abort();
    }
  }, {
    key: 'pauseAll',
    value: function pauseAll() {
      this.pause();
    }
  }, {
    key: 'resumeAll',
    value: function resumeAll() {
      this.resume();
    }
  }]);

  return Tus10;
}(_events2.default);

exports.default = Tus10;