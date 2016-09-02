'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _namespaceEmitter = require('namespace-emitter');

var _namespaceEmitter2 = _interopRequireDefault(_namespaceEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UppySocket = function () {
  function UppySocket(opts) {
    var _this = this;

    _classCallCheck(this, UppySocket);

    this.queued = [];
    this.isOpen = false;
    this.socket = new WebSocket(opts.target);
    this.emitter = new _namespaceEmitter2.default.EventEmitter();

    this.socket.onopen = function (e) {
      _this.isOpen = true;

      while (_this.queued.length > 0 && _this.isOpen) {
        var first = _this.queued[0];
        _this.send(first.action, first.payload);
        _this.queued = _this.queued.slice(1);
      }
    };

    this.socket.onclose = function (e) {
      _this.isOpen = false;
    };

    this._handleMessage = this._handleMessage.bind(this);

    this.socket.onmessage = this._handleMessage;

    this.close = this.close.bind(this);
    this.emit = this.emit.bind(this);
    this.on = this.on.bind(this);
    this.once = this.once.bind(this);
    this.send = this.send.bind(this);
  }

  _createClass(UppySocket, [{
    key: 'close',
    value: function close() {
      return this.socket.close();
    }
  }, {
    key: 'send',
    value: function send(action, payload) {
      // attach uuid

      if (!this.isOpen) {
        this.queued.push({ action: action, payload: payload });
        return;
      }

      this.socket.send(JSON.stringify({
        action: action,
        payload: payload
      }));
    }
  }, {
    key: 'on',
    value: function on(action, handler) {
      this.emitter.on(action, handler);
    }
  }, {
    key: 'emit',
    value: function emit(action, payload) {
      this.emitter.emit(action, payload);
    }
  }, {
    key: 'once',
    value: function once(action, handler) {
      this.emitter.once(action, handler);
    }
  }, {
    key: '_handleMessage',
    value: function _handleMessage(e) {
      try {
        var message = JSON.parse(e.data);
        this.emit(message.action, message.payload);
      } catch (err) {
        console.log(err);
      }
    }
  }]);

  return UppySocket;
}();

exports.default = UppySocket;