'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsToArray = require('../utils/toArray');

var _utilsToArray2 = _interopRequireDefault(_utilsToArray);

/**
 * Drag & Drop Plugin
 */

var DragDrop = (function () {
  function DragDrop(core, opts) {
    _classCallCheck(this, DragDrop);

    // Merge default options with the ones set by user
    this.opts = opts;

    // Check for browser dragDrop support
    this.isDragDropSupported = this.checkDragDropSupport();

    // Bind `this` to class methods
    this.handleDrop = this.handleDrop.bind(this);
    this.checkDragDropSupport = this.checkDragDropSupport.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  /**
   * Checks if the browser supports Drag & Drop (not supported on mobile devices, for example).
   * @return {Boolean} true if supported, false otherwise
   */

  _createClass(DragDrop, [{
    key: 'checkDragDropSupport',
    value: function checkDragDropSupport() {
      var div = document.createElement('div');

      if (!('draggable' in div) || !('ondragstart' in div && 'ondrop' in div)) {
        return false;
      }

      if (!('FormData' in window)) {
        return false;
      }

      if (!('FileReader' in window)) {
        return false;
      }

      return true;
    }
  }, {
    key: 'handleDrop',
    value: function handleDrop(handler, source, files) {
      // this.core.log('All right, someone dropped something...')

      if (!handler) {
        return files.map(function (file) {
          return {
            source: source || null,
            name: file.name,
            type: file.type,
            data: file
          };
        });
      }

      files.forEach(function (file) {
        handler({
          source: source || null,
          name: file.name,
          type: file.type,
          data: file
        });
      });
    }
  }, {
    key: 'handleInputChange',
    value: function handleInputChange(handler, ev) {
      var _this = this;

      this.core.log('All right, something selected through input...');

      var files = (0, _utilsToArray2['default'])(ev.target.files);

      if (!handler) {
        return files.map(function (file) {
          return {
            source: source || null,
            name: file.name,
            type: file.type,
            data: file
          };
        });
      }

      files.forEach(function (file) {
        handler({
          source: _this.id,
          name: file.name,
          type: file.type,
          data: file
        });
      });
    }
  }]);

  return DragDrop;
})();

exports['default'] = DragDrop;
module.exports = exports['default'];