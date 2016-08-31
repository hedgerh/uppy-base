'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _tusJsClient = require('tus-js-client');

var _tusJsClient2 = _interopRequireDefault(_tusJsClient);

var _utilsUppySocket = require('../utils/UppySocket');

var _utilsUppySocket2 = _interopRequireDefault(_utilsUppySocket);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

/**
 * Tus resumable file uploader
 *
 */

var Tus10 = (function (_EventEmitter) {
  _inherits(Tus10, _EventEmitter);

  function Tus10(core, opts) {
    _classCallCheck(this, Tus10);

    _get(Object.getPrototypeOf(Tus10.prototype), 'constructor', this).call(this);

    // set default options
    var defaultOptions = {
      resume: true,
      allowPause: true
    };

    // merge default options with the ones set by user
    this.opts = Object.assign({}, defaultOptions, opts);
  }

  // pauseResume (action, fileID) {
  //   const updatedFiles = Object.assign({}, this.core.getState().files)
  //   const inProgressUpdatedFiles = Object.keys(updatedFiles).filter((file) => {
  //     return !updatedFiles[file].progress.uploadComplete &&
  //            updatedFiles[file].progress.uploadStarted
  //   })

  //   switch (action) {
  //     case 'toggle':
  //       const wasPaused = updatedFiles[fileID].isPaused || false
  //       const isPaused = !wasPaused
  //       let updatedFile
  //       if (wasPaused) {
  //         updatedFile = Object.assign({}, updatedFiles[fileID], {
  //           isPaused: false
  //         })
  //       } else {
  //         updatedFile = Object.assign({}, updatedFiles[fileID], {
  //           isPaused: true
  //         })
  //       }
  //       updatedFiles[fileID] = updatedFile
  //       this.core.setState({files: updatedFiles})
  //       return isPaused
  //     case 'pauseAll':
  //       inProgressUpdatedFiles.forEach((file) => {
  //         const updatedFile = Object.assign({}, updatedFiles[file], {
  //           isPaused: true
  //         })
  //         updatedFiles[file] = updatedFile
  //       })
  //       this.core.setState({files: updatedFiles})
  //       return
  //     case 'resumeAll':
  //       inProgressUpdatedFiles.forEach((file) => {
  //         const updatedFile = Object.assign({}, updatedFiles[file], {
  //           isPaused: false
  //         })
  //         updatedFiles[file] = updatedFile
  //       })
  //       this.core.setState({files: updatedFiles})
  //       return
  //   }
  // }

  /**
   * Create a new Tus upload
   *
   * @param {object} file for use with upload
   * @param {integer} current file in a queue
   * @param {integer} total number of files in a queue
   * @returns {Promise}
   */

  _createClass(Tus10, [{
    key: 'upload',
    value: function upload(file, current, total) {
      var _this = this;

      // this.core.log(`uploading ${current} of ${total}`)

      // Create a new tus upload
      return new Promise(function (resolve, reject) {
        var upload = new _tusJsClient2['default'].Upload(file.data, {

          // TODO merge this.opts or this.opts.tus here
          metadata: file.meta,
          resume: _this.opts.resume,
          endpoint: _this.opts.endpoint,

          onError: function onError(err) {
            _this.core.log(err);
            reject('Failed because: ' + err);
          },
          onProgress: function onProgress(bytesUploaded, bytesTotal) {
            // Dispatch progress event
            _this.emit('upload-progress', {
              uploader: _this,
              id: file.id,
              bytesUploaded: bytesUploaded,
              bytesTotal: bytesTotal
            });
          },
          onSuccess: function onSuccess() {
            _this.emit('upload-success', file.id, upload.url);

            _this.core.log('Download ' + upload.file.name + ' from ' + upload.url);
            resolve(upload);
          }
        });

        _this.on('file-remove', function (fileID) {
          if (fileID === file.id) {
            console.log('removing file: ', fileID);
            upload.abort();
            resolve('upload ' + fileID + ' was removed');
          }
        });

        _this.on('core:upload-pause', function (fileID) {
          if (fileID === file.id) {
            var isPaused = _this.pauseResume('toggle', fileID);
            isPaused ? upload.abort() : upload.start();
          }
        });

        _this.on('pause-all', function () {
          var files = _this.core.getState().files;
          if (!files[file.id]) return;
          upload.abort();
        });

        _this.on('resume-all', function () {
          var files = _this.core.getState().files;
          if (!files[file.id]) return;
          upload.start();
        });

        upload.start();
        _this.emit('file-upload-started', file.id, upload);
      });
    }
  }, {
    key: 'uploadRemote',
    value: function uploadRemote(file, current, total) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.core.log(file.remote.url);
        fetch(file.remote.url, {
          method: 'post',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.assign({}, file.remote.body, {
            target: _this2.opts.endpoint,
            protocol: 'tus'
          }))
        }).then(function (res) {
          if (res.status < 200 && res.status > 300) {
            return reject(res.statusText);
          }

          res.json().then(function (data) {
            // get the host domain
            var regex = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/;
            var host = regex.exec(file.remote.host)[1];

            var token = data.token;
            var socket = new _utilsUppySocket2['default']({
              target: 'ws://' + host + ':3020/api/' + token
            });

            socket.on('progress', function (progressData) {
              var progress = progressData.progress;
              var bytesUploaded = progressData.bytesUploaded;
              var bytesTotal = progressData.bytesTotal;

              if (progress) {
                _this2.core.log('Upload progress: ' + progress);

                // Dispatch progress event
                _this2.emit('upload-progress', {
                  uploader: _this2,
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
    key: 'start',
    value: function start(files) {
      var _this3 = this;

      var uploaders = [];
      files.forEach(function (file, index) {
        var current = parseInt(index, 10) + 1;
        var total = files.length;

        if (!file.isRemote) {
          uploaders.push(_this3.upload(file, current, total));
        } else {
          uploaders.push(_this3.uploadRemote(file, current, total));
        }
      });

      return Promise.all(uploaders).then(function () {
        return {
          uploadedCount: files.length
        };
      });
    }
  }, {
    key: 'selectForUpload',
    value: function selectForUpload(files) {
      // TODO: replace files[file].isRemote with some logic
      //
      // filter files that are now yet being uploaded / haven’t been uploaded
      // and remote too
      var filesForUpload = Object.keys(files).filter(function (file) {
        if (files[file].progress.percentage === 0 || files[file].isRemote) {
          return true;
        }
        return false;
      }).map(function (file) {
        return files[file];
      });

      this.uploadFiles(filesForUpload);
    }
  }]);

  return Tus10;
})(_events2['default']);

exports['default'] = Tus10;
module.exports = exports['default'];