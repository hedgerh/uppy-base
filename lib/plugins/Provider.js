'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Provider = (function () {
  function Provider(opts) {
    _classCallCheck(this, Provider);

    this.opts = opts;
  }

  _createClass(Provider, [{
    key: 'list',
    value: function list(directory) {
      return fetch(this.opts.host + '/' + this.opts.provider + '/list?dir=' + directory, {
        method: 'get',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    }
  }, {
    key: 'logout',
    value: function logout(redirect) {
      return fetch(this.opts.host + '/' + this.opts.provider + '/logout?redirect=' + redirect, {
        method: 'get',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    }
  }]);

  return Provider;
})();

exports['default'] = Provider;
module.exports = exports['default'];