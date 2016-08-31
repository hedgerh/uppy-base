// This was the only way I could figure out how to get modules to import correctly.
// There's definitely a cleaner way to do this!
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _pluginsDragDrop = require('./plugins/DragDrop');

var _pluginsDragDrop2 = _interopRequireDefault(_pluginsDragDrop);

var _pluginsMultipart = require('./plugins/Multipart');

var _pluginsMultipart2 = _interopRequireDefault(_pluginsMultipart);

var _pluginsProvider = require('./plugins/Provider');

var _pluginsProvider2 = _interopRequireDefault(_pluginsProvider);

var _pluginsTus10 = require('./plugins/Tus10');

var _pluginsTus102 = _interopRequireDefault(_pluginsTus10);

var _pluginsWebcam = require('./plugins/Webcam');

var _pluginsWebcam2 = _interopRequireDefault(_pluginsWebcam);

var DragDrop = _pluginsDragDrop2['default'];
exports.DragDrop = DragDrop;
var Multipart = _pluginsMultipart2['default'];
exports.Multipart = Multipart;
var Provider = _pluginsProvider2['default'];
exports.Provider = Provider;
var Tus10 = _pluginsTus102['default'];
exports.Tus10 = Tus10;
var Webcam = _pluginsWebcam2['default'];
exports.Webcam = Webcam;