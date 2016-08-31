'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcPluginsProvider = require('./src/plugins/Provider');

var _srcPluginsProvider2 = _interopRequireDefault(_srcPluginsProvider);

var _srcPluginsWebcam = require('./src/plugins/Webcam');

var _srcPluginsWebcam2 = _interopRequireDefault(_srcPluginsWebcam);

var Provider = _srcPluginsProvider2['default'];
exports.Provider = Provider;
var Webcam = _srcPluginsWebcam2['default'];
exports.Webcam = Webcam;