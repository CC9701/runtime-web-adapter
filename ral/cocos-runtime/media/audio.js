import _CREATE_INNER_AUDIO_CONTEXT from "../../inner-context"
import _UTIL from "../../util"

let _rt = loadRuntime();

_UTIL.exportTo("AudioEngine", _rt, ral);
_UTIL.exportTo("createInnerAudioContext", _rt, ral, function () {
    if (_rt.AudioEngine) {
        ral.createInnerAudioContext = function () {
            return _CREATE_INNER_AUDIO_CONTEXT(_rt.AudioEngine);
        };
    }
}, function () {
    let ctx = ral.createInnerAudioContext();
    let prototype = ctx.__proto__.constructor.prototype;
    /**
     * 适配刚 setSrc 完, 先 seek(0) 再 play 会导致的卡顿问题
    */
    const _weakMap = new WeakMap();
    let oldSeek = prototype.seek;
    prototype.seek = function (position) {
        if (this.paused) {
            // playing 状态下不用再使用 play 方法 seek 就会生效, 所以仅 stopped 和 paused 状态时保存
            if (this.currentTime && this.currentTime > 0 && position === 0) {
                return;
            }
        }
        oldSeek.call(this, position);
    }
});