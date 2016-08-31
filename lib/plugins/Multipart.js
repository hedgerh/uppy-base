'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var Multipart = (function (_EventEmitter) {
  _inherits(Multipart, _EventEmitter);

  function Multipart(core, opts) {
    _classCallCheck(this, Multipart);

    _get(Object.getPrototypeOf(Multipart.prototype), 'constructor', this).call(this);

    // Default options
    var defaultOptions = {
      fieldName: 'files[]',
      responseUrlFieldName: 'url',
      bundle: true
    };

    // Merge default options with the ones set by user
    this.opts = Object.assign({}, defaultOptions, opts);
  }

  _createClass(Multipart, [{
    key: 'upload',
    value: function upload(file, current, total) {
      var _this = this;

      this.core.log('uploading ' + current + ' of ' + total);
      return new Promise(function (resolve, reject) {
        // turn file into an array so we can use bundle
        // if (!this.opts.bundle) {
        //   files = [files[current]]
        // }

        // for (let i in files) {
        //   formPost.append(this.opts.fieldName, files[i])
        // }

        var formPost = new FormData();
        formPost.append(_this.opts.fieldName, file.data);

        Object.keys(file.meta).forEach(function (item) {
          console.log(file.meta, file.meta[item]);
          formPost.append(file.meta, file.meta[item]);
        });

        var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', function (ev) {
          if (ev.lengthComputable) {
            // Dispatch progress event
            _this.emit('upload-progress', {
              uploader: _this,
              id: file.id,
              bytesUploaded: ev.loaded,
              bytesTotal: ev.total
            });
          }
        });

        xhr.addEventListener('load', function (ev) {
          if (ev.target.status === 200) {
            var resp = JSON.parse(xhr.response);
            var uploadURL = resp[_this.opts.responseUrlFieldName];

            _this.emit('upload-success', file.id, uploadURL);

            _this.core.log('Download ' + file.name + ' from ' + file.uploadURL);
            return resolve(file);
          }

          // var upload = {}
          //
          // if (this.opts.bundle) {
          //   upload = {files: files}
          // } else {
          //   upload = {file: files[current]}
          // }
        });

        xhr.addEventListener('error', function (ev) {
          return reject('Upload error');
        });

        xhr.open('POST', _this.opts.endpoint, true);
        xhr.send(formPost);
        _this.emit('core:file-upload-started', file.id);
      });
    }
  }, {
    key: 'selectForUpload',
    value: function selectForUpload(files) {
      var _this2 = this;

      var filesForUpload = [];
      Object.keys(files).forEach(function (file) {
        if (files[file].progress.percentage === 0) {
          filesForUpload.push(files[file]);
        }
      });

      var uploaders = [];
      filesForUpload.forEach(function (file, i) {
        var current = parseInt(i, 10) + 1;
        var total = filesForUpload.length;
        uploaders.push(_this2.upload(file, current, total));
      });

      return Promise.all(uploaders).then(function (result) {
        _this2.core.log('Multipart has finished uploading!');
      });

      //   if (this.opts.bundle) {
      //     uploaders.push(this.upload(files, 0, files.length))
      //   } else {
      //     for (let i in files) {
      //       uploaders.push(this.upload(files, i, files.length))
      //     }
      //   }
    }
  }]);

  return Multipart;
})(_events2['default']);

exports['default'] = Multipart;
module.exports = exports['default'];