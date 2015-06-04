/*global window, console, navigator*/

var Erizo = Erizo || {};

Erizo.sessionId = 103;

Erizo.Connection = function (spec) {
    "use strict";
    var that = {};

    spec.session_id = (Erizo.sessionId += 1);

    // Check which WebRTC Stack is installed.
    that.browser = Erizo.getBrowser();

    if (typeof module !== 'undefined' && module.exports) {
        that = Erizo.FcStack(spec);
    } else if (that.browser === 'mozilla') {
        that = Erizo.FirefoxStack(spec);
    } else if (that.browser === 'bowser'){
        that = Erizo.BowserStack(spec);
    } else if (that.browser === 'chrome-stable') {
        that = Erizo.ChromeStableStack(spec);
    } else {
        throw "WebRTC stack not available";
    }

    return that;
};

Erizo.getBrowser = function () {
  "use strict";

    var browser = "none";

    if (window.navigator.userAgent.match("Firefox") !== null) {
        // Firefox
        browser = "mozilla";
    } else if (window.navigator.userAgent.match("Bowser") !==null){
        browser = "bowser";
    } else if (window.navigator.userAgent.match("Chrome") !==null) {
        if (window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] >= 26) {
            browser = "chrome-stable";
        }
    } else if (window.navigator.userAgent.match("Safari") !== null) {
        browser = "bowser";
    } else if (window.navigator.userAgent.match("AppleWebKit") !== null) {
        browser = "bowser";
    }
    return browser;
};


Erizo.GetUserMedia = function (config, callback, error) {
    "use strict";

    navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

    if (config.screen){
      if (Erizo.getBrowser() === "mozilla"){
        config = { video: { mediaSource: 'window' || 'screen' }};
        navigator.getMedia(config,callback,error);
      } else {
        if (!window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1] >= 34){
          error({code:"This browser does not support screen sharing"});
          return;
        }
        // Default extensionId - this extension is only usable in our server, please make your own extension
        // based on the code in erizo_controller/erizoClient/extras/chrome-extension
        var extensionId = "okeephmleflklcdebijnponpabbmmgeo";
        if (config.extensionId){
          extensionId = config.extensionId;
        }
        try{
          chrome.runtime.sendMessage(extensionId,{getStream:true}, function (response){
            if (response==undefined){
              var theError = {code:"Access to screen denied"};
              error(theError);
              return;
            }
            var theId = response.streamId;
            config = {video: {mandatory: {chromeMediaSource: 'desktop',  chromeMediaSourceId: theId }}};
            navigator.getMedia(config,callback,error);
          });
        } catch (e){
          var theError = {code:"no_plugin_present"};
          error(theError);
          return;
        }
      }
    } else {
      if (typeof module !== 'undefined' && module.exports) {
        // Pass silently
      } else {
        navigator.getMedia(config, callback, error);
      }
    }
};
