'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _templateObject = _taggedTemplateLiteral(['<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" type="application/x-shockwave-flash" codebase="', '://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="', '" height="', '" id="webcam_movie_obj" align="middle"><param name="wmode" value="opaque" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="', '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="', '"/><embed id="webcam_movie_embed" src="', '" wmode="opaque" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="', '" height="', '" name="webcam_movie_embed" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="', '"></embed></object>'], ['<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" type="application/x-shockwave-flash" codebase="', '://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="', '" height="', '" id="webcam_movie_obj" align="middle"><param name="wmode" value="opaque" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="', '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="', '"/><embed id="webcam_movie_embed" src="', '" wmode="opaque" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="', '" height="', '" name="webcam_movie_embed" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="', '"></embed></object>']);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _userMedia;

/**
 * Webcam
 */

var Webcam = (function () {
  function Webcam(opts) {
    _classCallCheck(this, Webcam);

    this.userMedia = true;
    this.protocol = location.protocol.match(/https/i) ? 'https' : 'http';

    // set default options
    var defaultOptions = {
      enableFlash: true
    };

    this.params = {
      swfURL: 'webcam.swf',
      width: 400,
      height: 300,
      dest_width: 800, // size of captured image
      dest_height: 600, // these default to width/height
      image_format: 'jpeg', // image format (may be jpeg or png)
      jpeg_quality: 90, // jpeg image quality from 0 (worst) to 100 (best)
      enable_flash: true, // enable flash fallback,
      force_flash: false, // force flash mode,
      flip_horiz: false, // flip image horiz (mirror mode)
      fps: 30, // camera frames per second
      upload_name: 'webcam', // name of file in upload post data
      constraints: null, // custom user media constraints,
      flashNotDetectedText: 'ERROR: No Adobe Flash Player detected.  Webcam.js relies on Flash for browsers that do not support getUserMedia (like yours).',
      noInterfaceFoundText: 'No supported webcam interface found.',
      unfreeze_snap: true // Whether to unfreeze the camera after snap (defaults to true)
    };

    // merge default options with the ones set by user
    this.opts = Object.assign({}, defaultOptions, opts);

    // Camera controls
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.stopWebcam = this.stopWebcam.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.takeSnapshot = this.takeSnapshot.bind(this);
    this.generateImage = this.generateImage.bind(this);
    this.getSWFHTML = this.getSWFHTML.bind(this);
    this.detectFlash = this.detectFlash.bind(this);
  }

  /**
   * Checks for getUserMedia support
   */

  _createClass(Webcam, [{
    key: 'init',
    value: function init() {
      var _this = this;

      // initialize, check for getUserMedia support

      // Setup getUserMedia, with polyfill for older browsers
      // Adapted from: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      this.mediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? navigator.mediaDevices : navigator.mozGetUserMedia || navigator.webkitGetUserMedia ? {
        getUserMedia: function getUserMedia(c) {
          return new Promise(function (resolve, reject) {
            (navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(navigator, c, resolve, reject);
          });
        }
      } : null;

      window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
      this.userMedia = this.userMedia && !!this.mediaDevices && !!window.URL;

      // Older versions of firefox (< 21) apparently claim support but user media does not actually work
      if (navigator.userAgent.match(/Firefox\D+(\d+)/)) {
        if (parseInt(RegExp.$1, 10) < 21) this.userMedia = null;
      }

      // Make sure media stream is closed when navigating away from page
      if (this.userMedia) {
        window.addEventListener('beforeunload', function (event) {
          _this.reset();
        });
      }
    }
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      this.userMedia = _userMedia === undefined ? this.userMedia : _userMedia;

      if (this.userMedia) {
        // ask user for access to their camera
        this.mediaDevices.getUserMedia({
          audio: false,
          video: true
        }).then(function (stream) {
          _this2.updateState({
            videoStream: stream,
            cameraReady: true
          });
        })['catch'](function (err) {
          if (_this2.opts.enableFlash && _this2.detectFlash()) {
            // setTimeout(() => {
            //   this.opts.forceFlash = 1
            //   this.attach(elem)
            // }, 1)
          } else {
              console.log('Error:', err);
            }
        });
      } else if (this.opts.enableFlash && this.detectFlash()) {
        // flash fallback
        // needed for flash-to-js interface
        window.Webcam = Webcam;
        this.updateState({
          useTheFlash: true
        });
        // elem.appendChild(div)
      } else {
          console.log('There was a problem!');
        }
    }

    /**
     * Detects if browser supports flash
     * Code snippet borrowed from: https://github.com/swfobject/swfobject
     *
     * @return {bool} flash supported
     */
  }, {
    key: 'detectFlash',
    value: function detectFlash() {
      var SHOCKWAVE_FLASH = 'Shockwave Flash';
      var SHOCKWAVE_FLASH_AX = 'ShockwaveFlash.ShockwaveFlash';
      var FLASH_MIME_TYPE = 'application/x-shockwave-flash';
      var win = window;
      var nav = navigator;
      var hasFlash = false;

      if (typeof nav.plugins !== 'undefined' && typeof nav.plugins[SHOCKWAVE_FLASH] === 'object') {
        var desc = nav.plugins[SHOCKWAVE_FLASH].description;
        if (desc && typeof nav.mimeTypes !== 'undefined' && nav.mimeTypes[FLASH_MIME_TYPE] && nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin) {
          hasFlash = true;
        }
      } else if (typeof win.ActiveXObject !== 'undefined') {
        try {
          var ax = new win.ActiveXObject(SHOCKWAVE_FLASH_AX);
          if (ax) {
            var ver = ax.GetVariable('$version');
            if (ver) hasFlash = true;
          }
        } catch (e) {}
      }

      return hasFlash;
    }
  }, {
    key: 'reset',
    value: function reset() {
      // shutdown camera, reset to potentially attach again
      if (this.preview_active) this.unfreeze();

      if (this.userMedia) {
        if (this.stream) {
          if (this.stream.getVideoTracks) {
            // get video track to call stop on it
            var tracks = this.stream.getVideoTracks();
            if (tracks && tracks[0] && tracks[0].stop) tracks[0].stop();
          } else if (this.stream.stop) {
            // deprecated, may be removed in future
            this.stream.stop();
          }
        }
        delete this.stream;
        delete this.video;
      }

      if (this.userMedia !== true) {
        // call for turn off camera in flash
        this.getMovie()._releaseCamera();
      }
    }
  }, {
    key: 'getSWFHTML',
    value: function getSWFHTML() {
      // Return HTML for embedding flash based webcam capture movie
      var swfURL = this.params.swfURL;

      // make sure we aren't running locally (flash doesn't work)
      if (location.protocol.match(/file/)) {
        return '<h3 style="color:red">ERROR: the Webcam.js Flash fallback does not work from local disk.  Please run it from a web server.</h3>';
      }

      // make sure we have flash
      if (!this.detectFlash()) {
        return '<h3 style="color:red">No flash</h3>';
      }

      // set default swfURL if not explicitly set
      if (!swfURL) {
        // find our script tag, and use that base URL
        var base_url = '';
        var scpts = document.getElementsByTagName('script');
        for (var idx = 0, len = scpts.length; idx < len; idx++) {
          var src = scpts[idx].getAttribute('src');
          if (src && src.match(/\/webcam(\.min)?\.js/)) {
            base_url = src.replace(/\/webcam(\.min)?\.js.*$/, '');
            idx = len;
          }
        }
        if (base_url) swfURL = base_url + '/webcam.swf';else swfURL = 'webcam.swf';
      }

      // // if this is the user's first visit, set flashvar so flash privacy settings panel is shown first
      // if (window.localStorage && !localStorage.getItem('visited')) {
      //   // this.params.new_user = 1
      //   localStorage.setItem('visited', 1)
      // }
      // this.params.new_user = 1
      // construct flashvars string
      var flashvars = '';
      for (var key in this.params) {
        if (flashvars) flashvars += '&';
        flashvars += key + '=' + escape(this.params[key]);
      }

      // construct object/embed tag

      return html(_templateObject, this.protocol, this.params.width, this.params.height, swfURL, flashvars, swfURL, this.params.width, this.params.height, flashvars);
    }
  }, {
    key: 'getMovie',
    value: function getMovie() {
      // get reference to movie object/embed in DOM
      var movie = document.getElementById('webcam_movie_obj');
      if (!movie || !movie._snap) movie = document.getElementById('webcam_movie_embed');
      if (!movie) console.log('getMovie error');
      return movie;
    }

    /**
     * Stops the webcam capture and video playback.
     */
  }, {
    key: 'stopWebcam',
    value: function stopWebcam() {
      var video = this.video;
      var videoStream = this.videoStream;

      this.updateState({
        cameraReady: false
      });

      if (videoStream) {
        if (videoStream.stop) {
          videoStream.stop();
        } else if (videoStream.msStop) {
          videoStream.msStop();
        }

        videoStream.onended = null;
        videoStream = null;
      }

      if (video) {
        video.onerror = null;
        video.pause();

        if (video.mozSrcObject) {
          video.mozSrcObject = null;
        }

        video.src = '';
      }

      this.video = document.querySelector('.UppyWebcam-video');
      this.canvas = document.querySelector('.UppyWebcam-canvas');
    }
  }, {
    key: 'flashNotify',
    value: function flashNotify(type, msg) {
      // receive notification from flash about event
      switch (type) {
        case 'flashLoadComplete':
          // movie loaded successfully
          break;

        case 'cameraLive':
          // camera is live and ready to snap
          this.live = true;
          break;

        case 'error':
          // Flash error
          console.log('There was a flash error', msg);
          break;

        default:
          // catch-all event, just in case
          console.log('webcam flash_notify: ' + type + ': ' + msg);
          break;
      }
    }
  }, {
    key: 'configure',
    value: function configure(panel) {
      // open flash configuration panel -- specify tab name:
      // 'camera', 'privacy', 'default', 'localStorage', 'microphone', 'settingsManager'
      if (!panel) panel = 'camera';
      this.getMovie()._configure(panel);
    }

    /**
     * Takes a snapshot and displays it in a canvas.
     */
  }, {
    key: 'generateImage',
    value: function generateImage(video, canvas, opts) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);

      var dataUrl = canvas.toDataURL(opts.mimeType);

      var file = dataURItoFile(dataUrl, {
        name: opts.name
      });

      return {
        dataUrl: dataUrl,
        data: file,
        type: opts.mimeType
      };
    }
  }, {
    key: 'takeSnapshot',
    value: function takeSnapshot(video, canvas) {
      var opts = {
        name: 'webcam-' + Date.now() + '.jpg',
        mimeType: 'image/jpeg'
      };

      var image = this.generateImage(video, canvas, opts);

      var tagFile = {
        source: this.id,
        name: opts.name,
        data: image.data,
        type: opts.type
      };

      return tagFile;
    }
  }]);

  return Webcam;
})();

exports['default'] = Webcam;
module.exports = exports['default'];