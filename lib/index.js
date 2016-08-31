'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _pluginsProvider = require('./plugins/Provider');

var _pluginsProvider2 = _interopRequireDefault(_pluginsProvider);

var _pluginsWebcam = require('./plugins/Webcam');

var _pluginsWebcam2 = _interopRequireDefault(_pluginsWebcam);

var Provider = _pluginsProvider2['default'];
exports.Provider = Provider;
var Webcam = _pluginsWebcam2['default'];
exports.Webcam = Webcam;