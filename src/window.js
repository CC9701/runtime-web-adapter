import Document from "./Document"
import TouchEvent from "./TouchEvent"
import EventTarget from "./EventTarget"
import HTMLCanvasElement from "./HTMLCanvasElement"
import HTMLImageElement from "./HTMLImageElement"
import Image from "./Image"
import Location from "./Location"
import Navigator from "./Navigator"
import Screen from "./Screen"
import XMLHttpRequest from "./XMLHttpRequest"

window.jsb = window.jsb || {};

// properties
window.clientTop = 0;
window.clientLeft = 0;
window.devicePixelRatio = 1;
window.document = new Document();
window.frameElement = null;
window.fullScreen = true;
window.innerHeight = jsb.height;
window.innerWidth = jsb.width;
window.length = 0;
window.location = new Location();
window.name = "runtime";
window.navigator = new Navigator(jsb.platform, jsb.language);
window.optConfig = {
    disableBatchGLCommandsToNative() {
        console.warn("window.optConfig.disableBatchGLCommandsToNative is not support!");
    },
    enableGLParameterCheck() {
        console.warn("window.optConfig.enableGLParameterCheck is not support!");
    }
};
window.outerHeight = jsb.height;
window.outerWidth = jsb.width;
window.pageXOffset = 0;
window.pageYOffset = 0;
window.parent = window;
window.screen = new Screen();
window.screenLeft = 0;
window.screenTop = 0;
window.screenX = 0;
window.screenY = 0;
window.scrollX = 0;
window.scrollY = 0;
window.self = window;
window.top = window;
window.window = window;

// methods
window.alert = window.console.error;
const {btoa, atob} = require('../lib/base64.min.js');
window.atob = atob;
window.btoa = btoa;
window.close = function () {
    console.warn("window.close() is deprecated!");
};
window.print = window.console.log;
window.addEventListener = EventTarget.prototype.addEventListener;
window.removeEventListener = EventTarget.prototype.removeEventListener;
let _dispatchEvent = EventTarget.prototype.dispatchEvent;
window.dispatchEvent = function (event) {
    /*
        当该事件是可取消的(cancelable为true)并且至少一个该事件的 事件处理方法 调用了Event.preventDefault()，
        则返回值为false；否则返回true。
     */
    if (window.document.dispatchEvent(event)) {
        return _dispatchEvent.apply(this || window, arguments);
    }
    return false;
};
jsb.onTouchStart(function (e) {
    let event = new TouchEvent("touchstart");
    window.dispatchEvent(Object.assign(event, e));
});
jsb.onTouchMove(function (e) {
    let event = new TouchEvent("touchmove");
    window.dispatchEvent(Object.assign(event, e));
});
jsb.onTouchCancel(function (e) {
    let event = new TouchEvent("touchcancel");
    window.dispatchEvent(Object.assign(event, e));
});
jsb.onTouchEnd(function (e) {
    let event = new TouchEvent("touchend");
    window.dispatchEvent(Object.assign(event, e));
});
window.getComputedStyle = function () {
    return {
        position: 'absolute',
        left: '0px',
        top: '0px',
        height: '0px',
        paddingLeft: 0
    };
};
window.resize = function (width, height) {
    window.__canvas._width = window.innerWidth;
    window.__canvas._height = window.innerHeight;

    window.innerWidth = width;
    window.innerHeight = height;
    window.outerWidth = window.innerWidth;
    window.outerHeight = window.innerHeight;
    window.screen.availWidth = window.innerWidth;
    window.screen.availHeight = window.innerHeight;
    window.screen.width = window.innerWidth;
    window.screen.height = window.innerHeight;
};
jsb.onWindowResize(function (size) {
    window.resize(size.width, size.height);
});

// class
window.HTMLCanvasElement = HTMLCanvasElement;
window.HTMLImageElement = HTMLImageElement;
window.Image = Image;
window.XMLHttpRequest = XMLHttpRequest;
const {Blob, URL} = require('./Blob.js');
window.Blob = Blob;
window.URL = URL;
window.DOMParser = require('./xmldom/dom-parser.js').DOMParser;

// extensions
window.__canvas = new HTMLCanvasElement();
window.document.body.appendChild(window.__canvas);

window.saveImageData = function () {
    console.warn("window.saveImageData() is deprecated!");
};

window.__cleanScript = function () {
    console.warn("window.__cleanScript() deprecated!");
};

window.__getCurrentLanguage = function () {
    return jsb.language;
};

window.__getOS = function () {
    return jsb.platform;
};

window.__getOSVersion = function () {
    return jsb.system;
};

window.__getPlatform = function () {
    return 3;
};

window.__getVersion = function () {
    console.warn("window.__getVersion() deprecated!");
};

window.__isObjectValid = function () {
    console.warn("window.__isObjectValid() deprecated!");
};

window.__restartVM = function () {
    console.warn("window.__restartVM() is deprecated!");
};