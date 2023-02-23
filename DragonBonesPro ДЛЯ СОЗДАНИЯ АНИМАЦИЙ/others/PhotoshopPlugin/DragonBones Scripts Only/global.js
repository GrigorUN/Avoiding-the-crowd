"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = require("./types");
var dbf = require("./dragonBonesFormat");
var zh_CN_1 = require("./locales/zh_CN");
var en_US_1 = require("./locales/en_US");
//
exports.isWindows = $.os.match(/windows/i);
exports.isMacOS = !exports.isWindows;
exports.root = new File($.fileName).parent.absoluteURI;
exports.dragonBones = Folder.userData.absoluteURI + "/DragonBonesPro";
exports.temp = exports.dragonBones + "/temp";
exports.defaultConfig = {
    originType: types.OriginType.Center,
    armatureType: dbf.ArmatureType.Armature,
    scale: 1,
    ignoreHiddenLayers: true,
    onlyUpdateTexture: false
};
// Current languange config.
exports.language = (function () {
    switch (app.locale) {
        case "zh_CN":
            return zh_CN_1.zh;
    }
    return en_US_1.en;
})();
// Script ui.
function createWindowByObject(object, title) {
    var jsonString = "dialog" + JSON.stringify(object);
    var replaceStrings = [];
    var isList = false;
    var dollarIndex = -1;
    var modifyString = "";
    for (var i = 0, l = jsonString.length; i < l; ++i) {
        var c = jsonString[i];
        if (dollarIndex > 0) {
            if (isList) {
                if (c == "]") {
                    isList = false;
                    dollarIndex = -1;
                    replaceStrings.length = 0;
                }
                else if (c == "{") {
                    modifyString += replaceStrings.join("");
                }
                modifyString += c;
            }
            else if (c == "[") {
                isList = true;
                modifyString = modifyString.substr(0, modifyString.length - replaceStrings.length);
                modifyString += c;
            }
            else if (c == "{") {
                dollarIndex = -1;
                replaceStrings.length = 0;
                modifyString += c;
            }
            else if (c == ":") {
            }
            else {
                if (c != '"') {
                    replaceStrings.push(c);
                }
                if (replaceStrings.length == 1) {
                    modifyString += ":";
                }
                else {
                    modifyString += replaceStrings[i - dollarIndex - 2];
                }
            }
        }
        else if (c == "$") {
            dollarIndex = i;
            modifyString += '"';
        }
        else {
            modifyString += c;
        }
    }
    return new Window(modifyString);
}
exports.createWindowByObject = createWindowByObject;
function getGroupSelected(group) {
    var i = 0;
    while (true) {
        var item = group["i" + (++i)];
        if (item) {
            if (item.value) {
                return --i;
            }
        }
        else {
            break;
        }
    }
    return -1;
}
exports.getGroupSelected = getGroupSelected;
function getLayers(layerSet, layers) {
    var displayLayers = [];
    for (var i = 0, l = layerSet.layers.length; i < l; ++i) {
        var layer = layerSet.layers[i];
        if (layer.typename == "LayerSet") {
            getLayers(layer, layers);
        }
        else if (layerSet.typename == "LayerSetVideo?" || layerSet.name.toLowerCase().indexOf("$slot") >= 0) {
            displayLayers.push(layer);
        }
        else {
            layers.push(layer);
        }
    }
    if (displayLayers.length > 0) {
        layers.push(displayLayers);
    }
}
exports.getLayers = getLayers;
function getURL(url, params) {
    if (params === void 0) { params = null; }
    if (params) {
        var str = exports.isWindows ? "^" : "\\";
        var paramsString = "";
        for (var i in params) {
            if (paramsString) {
                paramsString += str + "&";
            }
            paramsString += i + "=" + encodeURIComponent(params[i]);
        }
        url = url + "?" + paramsString;
    }
    if (exports.isWindows) {
        app.system("start " + url);
    }
    else {
        app.system("open " + url);
    }
}
exports.getURL = getURL;
//
var tempFolder = new Folder(exports.temp);
if (!tempFolder.exists) {
    tempFolder.create();
}
