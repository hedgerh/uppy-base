'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Multipart = function (_EventEmitter) {
  _inherits(Multipart, _EventEmitter);

  function Multipart(core, opts) {
    _classCallCheck(this, Multipart);

    // Default options
    var _this = _possibleConstructorReturn(this, (Multipart.__proto__ || Object.getPrototypeOf(Multipart)).call(this));

    var defaultOptions = {
      fieldName: 'files[]',
      responseUrlFieldName: 'url',
      bundle: true
    };

    // Merge default options with the ones set by user
    _this.opts = Object.assign({}, defaultOptions, opts);
    return _this;
  }

  _createClass(Multipart, [{
    key: 'upload',
    value: function upload(file, current, total) {
      var _this2 = this;

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
        formPost.append(_this2.opts.fieldName, file.data);

        Object.keys(file.meta).forEach(function (item) {
          console.log(file.meta, file.meta[item]);
          formPost.append(file.meta, file.meta[item]);
        });

        var xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', function (ev) {
          if (ev.lengthComputable) {
            // Dispatch progress event
            _this2.emit('upload-progress', {
              uploader: _this2,
              id: file.id,
              bytesUploaded: ev.loaded,
              bytesTotal: ev.total
            });
          }
        });

        xhr.addEventListener('load', function (ev) {
          if (ev.target.status === 200) {
            var resp = JSON.parse(xhr.response);
            var uploadURL = resp[_this2.opts.responseUrlFieldName];

            _this2.emit('upload-success', file.id, uploadURL);

            _this2.core.log('Download ' + file.name + ' from ' + file.uploadURL);
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

        xhr.open('POST', _this2.opts.endpoint, true);
        xhr.send(formPost);
        _this2.emit('core:file-upload-started', file.id);
      });
    }
  }, {
    key: 'selectForUpload',
    value: function selectForUpload(files) {
      var _this3 = this;

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
        uploaders.push(_this3.upload(file, current, total));
      });

      return Promise.all(uploaders).then(function (result) {
        _this3.core.log('Multipart has finished uploading!');
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
}(_events2.default);

exports.default = Multipart;