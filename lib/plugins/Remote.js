'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _getName = function _getName(id) {
  return id.split('-').map(function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }).join(' ');
};

var Remote = function (_EventEmitter) {
  _inherits(Remote, _EventEmitter);

  function Remote(opts) {
    _classCallCheck(this, Remote);

    var _this = _possibleConstructorReturn(this, (Remote.__proto__ || Object.getPrototypeOf(Remote)).call(this, opts));

    _this.opts = opts;
    _this.id = opts.provider;
    _this.name = _this.opts.name || _getName(_this.id);
    return _this;
  }

  _createClass(Remote, [{
    key: 'getInitialState',
    value: function getInitialState() {
      return _defineProperty({}, this.id, {
        id: this.id,
        name: this.name,
        files: {},
        authed: false,
        authURL: this.opts.host + '/connect/' + this.id,
        auth: this.auth,
        list: this.list,
        logout: this.logout
      });
    }
  }, {
    key: 'auth',
    value: function auth() {
      return fetch(this.opts.host + '/' + this.id + '/authorize', {
        method: 'get',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application.json'
        }
      }).then(function (res) {
        return res.json().then(function (payload) {
          return payload.isAuthenticated;
        });
      });
    }
  }, {
    key: 'list',
    value: function list() {
      var directory = arguments.length <= 0 || arguments[0] === undefined ? 'root' : arguments[0];

      return fetch(this.opts.host + '/' + this.id + '/list?dir=' + directory, {
        method: 'get',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        return res.json();
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      var redirect = arguments.length <= 0 || arguments[0] === undefined ? location.href : arguments[0];

      return fetch(this.opts.host + '/' + this.id + '/logout?redirect=' + redirect, {
        method: 'get',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    }
  }]);

  return Remote;
}(EventEmitter);

exports.default = Remote;