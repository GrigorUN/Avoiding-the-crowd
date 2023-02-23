"use strict";
if (!$.global["dragonBones"]) {
    $.global["dragonBones"] = true;
    // Root url.
    var root = new File($.fileName).parent.absoluteURI;
    // Modify Object defineProperty.
    Object.defineProperty = function (o, p, d) {
        if (d.get) {
            o.__defineGetter__(p, d.get);
        }
        if (d.set) {
            o.__defineSetter__(p, d.set);
        }
    };
    // Array indexOf.
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (element, startIndex) {
            if (startIndex === void 0) { startIndex = 0; }
            var length = this.length >>> 0;
            startIndex = +startIndex || 0;
            startIndex = (startIndex < 0) ? Math.ceil(startIndex) : Math.floor(startIndex);
            if (startIndex < 0) {
                startIndex += length;
            }
            for (; startIndex < length; startIndex++) {
                if ((startIndex in this) && this[startIndex] == element) {
                    return startIndex;
                }
            }
            return -1;
        };
    }
    // JSON init.
    $.evalFile(root + "/json.js");
    // Photoshop require.
    var modules = {};
    $.global["require"] = function (uri) {
        if (uri.indexOf(".ts") >= 0) {
            uri = uri.replace(".ts", ".js");
        }
        else {
            uri += ".js";
        }

        uri = uri.replace("DragonBones Scripts Only/", "");
        uri = root + "/" + uri;
        var exports = modules[uri];
        if (!exports) {
            exports = modules[uri] = $.global["exports"] = {};
            $.evalFile(uri);
            $.global["exports"] = null;
        }
        return exports;
    };

    var modules = {};
    var require = $.global["require"] = function (uri) {
        if (uri.indexOf(".ts") >= 0) {
            uri = uri.replace(".ts", ".js");
        }
        else {
            uri += ".js";
        }

        uri = uri.replace("DragonBones Scripts Only/", "");
        uri = root + "/" + uri;

        var moudleLoaded = modules[uri];
        if (moudleLoaded === undefined) {
            moudleLoaded = modules[uri] = {};

            var file = new File(uri);
            file.encoding = "UTF8";
            file.open("r");
            var script = file.read();
            file.close();

            if (script) {
                new Function("require", "exports", script)(
                    require, moudleLoaded
                );
            }
            else {
                alert("Load module error. " + uri);
            }
        }

        return moudleLoaded;
    };
}
