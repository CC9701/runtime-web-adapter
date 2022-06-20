const sys = cc.sys;

// 实现 cc.sys.getNetworkType
let currentNetworkType = cc.sys.NetworkType.LAN;
function _updateCurrentNetworkType(networkType) {
    if (networkType === "none") {
        // 网络不通
        currentNetworkType = cc.sys.NetworkType.NONE;
    } else if (networkType === "2g" || networkType === "3g" || networkType === "4g" || networkType === "5g") {
        // 通过蜂窝移动网络连接因特网
        currentNetworkType = cc.sys.NetworkType.WWAN;
    } else {
        // 通过无线或有线本地网络或未识别类型网络连接因特网
        currentNetworkType = cc.sys.NetworkType.LAN;
    }
}
// 获取初始的 NetworkType 并监听 NetWork 的状态变化
ral.getNetworkType({
    success: function (networkType) {
        _updateCurrentNetworkType(networkType)
    },
    fail: function () {
        // 与引擎保持一致，请求失败默认返回 cc.sys.NetworkType.LAN
        currentNetworkType = cc.sys.NetworkType.LAN;
    }
});

ral.onNetworkStatusChange(function (res) {
    if (res.isConnected) {
        _updateCurrentNetworkType(res.networkType);
    } else {
        currentNetworkType = cc.sys.NetworkType.NONE;
    }
});

sys.getNetworkType = function () {
    return currentNetworkType;
}

// 实现 cc.sys.getBatteryLevel. 返回值范围[0, 1], ral接口返回值[1, 100]
sys.getBatteryLevel = function () {
    return ral.getBatteryInfoSync().level / 100.0;
}

sys.garbageCollect = ral.triggerGC;

sys.restartVM = function () {
    console.error("The restartVM is not define!");
}

// 实现 safeArea 功能
let originSafeAreaRect = sys.getSafeAreaRect;
let safeArea = rt.getSystemInfoSync().safeArea;
if (safeArea == null) {
    sys.getSafeAreaRect = function () {
        console.warn("The cc.sys.getSafeAreaRect is not support on this platform!");
        return originSafeAreaRect(arguments);
    }
} else {
    sys.getSafeAreaRect = function () {
        let leftBottom = new cc.Vec2(safeArea.left, safeArea.bottom);
        let rightTop = new cc.Vec2(safeArea.right, safeArea.top); // Returns the real location in view.

        // 2.x 的插件中还做了其他的处理
        let view = cc.view;
        let screenSize = view.getFrameSize(); // Get leftBottom and rightTop point in UI coordinates
        let relatedPos = {
            left: 0,
            top: 0,
            width: screenSize.width,
            height: screenSize.height
        };
        view.convertToLocationInView(leftBottom.x, leftBottom.y, relatedPos, leftBottom);
        view.convertToLocationInView(rightTop.x, rightTop.y, relatedPos, rightTop); // convert view point to design resolution size
        view._convertPointWithScale(leftBottom);
        view._convertPointWithScale(rightTop);
        return cc.rect(leftBottom.x, leftBottom.y, rightTop.x - leftBottom.x, rightTop.y - leftBottom.y);
    }
}
