var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by Yuxin on 2015/9/6.
 */
var main = (function (_super) {
    __extends(main, _super);
    function main() {
        _super.apply(this, arguments);
        this.bones = {};
        this.resultArr = [];
        this.layersInfo = {};
        this.dbTexture = {};
        this.timelines = {};
        this.defaultProperty = {
            "x": 0,
            "y": 0,
            "scX": 1,
            "scY": 1,
            "skX": 0,
            "skY": 0,
            "pX": 0,
            "pY": 0,
            "z": 0,
            "scale": 0,
            "offset": 0,
            "loop": 1,
            "fadeInTime": 0,
            "aO": 0,
            "rO": 0,
            "gO": 0,
            "bO": 0,
            "aM": 100,
            "rM": 100,
            "gM": 100,
            "bM": 100,
            "textureScale": 1
        };
    }
    main.prototype.dataFileExtension = function () {
        return ["ExportJson"];
    };
    main.prototype.dataFileDescription = function () {
        return "Cocos data";
    };
    main.prototype.textureAtlasDataFileExtension = function () {
        return ["plist"];
    };
    main.prototype.isSupportTextureAtlas = function () {
        return true;
    };
    main.prototype.convertToDBTextureAtlasData = function (data) {
        var dbTexture = {};
        try {
            var str = XML.parse(data);
            var arr = str.split(":");
            var metadataKey = 0;
            var bb = "";
            for (var i = 0; i < arr.length; i++) {
                bb += arr[i];
                if (arr[i] == "metadata") {
                    metadataKey = i;
                }
            }
            dbTexture["SubTexture"] = [];
            var imageArr = arr.slice(4, metadataKey);
            for (var j = 0; j < imageArr.length;) {
                var image = {};
                var endIndex = imageArr[j].lastIndexOf(".");
                image["name"] = imageArr[j].substring(0, endIndex);
                image["x"] = imageArr[j + 11];
                image["y"] = imageArr[j + 13];
                image["width"] = imageArr[j + 3];
                image["height"] = imageArr[j + 5];
                j += 18;
                dbTexture["SubTexture"].push(image);
            }
            var metadataArr = arr.slice(metadataKey);
            dbTexture["imagePath"] = metadataArr[5];
        }
        catch (e) {
        }
        return JSON.stringify(dbTexture);
    };
    main.prototype.checkDataValid = function (stuData) {
        var data = JSON.parse(stuData);
        if (data["content_scale"] && data["texture_data"] && data["animation_data"] && data["armature_data"]) {
            return true;
        }
        else {
            return false;
        }
    };
    main.prototype.convertToDBData = function (stuData) {
        var dbData = {};
        try {
            dbData["isGlobal"] = 0;
            dbData["isRelativePivot"] = 1;
            dbData["armature"] = [];
            dbData["version"] = 2.3;
            dbData["name"] = "dataName";
            dbData["frameRate"] = 60;
            this.bones = {};
            this.resultArr = [];
            this.layersInfo = {};
            this.dbTexture = {};
            this.timelines = {};
            var data = JSON.parse(stuData);
            dbData["textureScale"] = data["content_scale"] != null ? data["content_scale"] : 2;
            this.parseTexture(data["texture_data"]);
            //for (var key in stuData["texture_data"]) {
            //    this.dbTexture[stuData["texture_data"][key]["name"]] = stuData["texture_data"][key];
            //}
            //for(var l = 0;l<stuData["texture_data"].length;l++){
            //    if(stuData["texture_data"][l]["name"]) {
            //        this.dbTexture[stuData["texture_data"][l]["name"]] = stuData["texture_data"][l];
            //    }
            //}
            //for (var i = 0; i < data["animation_data"].length; i++) {
            var stuAnimation = data["animation_data"][0];
            var stuArmature = data["armature_data"][0];
            var dbArmature = { "bone": [], "skin": [], "animation": [], "name": "armatureName" };
            dbData["armature"].push(dbArmature);
            //设置bone
            this.setBone(dbArmature["bone"], stuArmature["bone_data"], dbData);
            //设置skin
            var skin = { "name": 0, "slot": [] };
            dbArmature["skin"].push(skin);
            this.setSlot(skin["slot"], stuArmature["bone_data"], dbData);
            //设置动画
            this.setAnimation(dbArmature["animation"], stuAnimation["mov_data"], dbData);
            // }
            this.removeDefault(dbArmature);
        }
        catch (e) {
        }
        return JSON.stringify(dbData);
    };
    main.prototype.parseTexture = function (ccTexture) {
        for (var key in ccTexture) {
            this.dbTexture[ccTexture[key]["name"]] = ccTexture[key];
        }
    };
    main.prototype.removeDefault = function (obj, parent, parentKey) {
        for (var key in obj) {
            if (obj[key] instanceof Array) {
                if (obj[key].length > 0) {
                    this.removeDefault(obj[key]);
                }
            }
            else if (obj[key] instanceof Object) {
                this.removeDefault(obj[key], obj, key);
            }
            else {
                if (typeof (obj[key]) == "number") {
                    obj[key] = Number(obj[key].toFixed(4));
                }
                if (this.defaultProperty[key] != null && obj[key] == this.defaultProperty[key]) {
                    delete obj[key];
                }
            }
        }
        if (obj instanceof Object) {
            var hasKey = false;
            for (var key in obj) {
                hasKey = true;
                break;
            }
            if (!hasKey && parent && parent[parentKey]) {
                delete parent[parentKey];
            }
        }
    };
    main.prototype.setFrame = function (dbFrames, stuFrames, bone, z, dbData) {
        for (var i = 0; i < stuFrames.length; i++) {
            var stuFrame = stuFrames[i];
            var dbFrame = {};
            if (i == 0) {
                var startIdx = stuFrame["fi"];
                if (startIdx != 0) {
                    var temp = { "duration": startIdx }; //, "displayIndex": -1};
                    if (stuFrame["dI"] < 0) {
                        temp["hide"] = 1;
                    }
                    else if (stuFrame["dI"] > 0) {
                        temp["displayIndex"] = stuFrame["dI"];
                    }
                    if (stuFrame["tweenFrame"] == false) {
                        temp["tweenEasing"] = "NaN";
                    }
                    if (stuFrame["evt"]) {
                        temp["event"] = stuFrame["evt"];
                    }
                    temp["z"] = z;
                    if (stuFrame["bd_src"] == 700 && stuFrame["bd_dst"] == 1) {
                        temp["blendMode"] = "add";
                    }
                    if (stuFrame["color"]) {
                        temp["colorTransform"] = {};
                        temp["colorTransform"]["aO"] = 0;
                        temp["colorTransform"]["rO"] = 0;
                        temp["colorTransform"]["gO"] = 0;
                        temp["colorTransform"]["bO"] = 0;
                        temp["colorTransform"]["aM"] = 100;
                        temp["colorTransform"]["rM"] = 100;
                        temp["colorTransform"]["gM"] = 100;
                        temp["colorTransform"]["bM"] = 100;
                        if (stuFrame["color"].hasOwnProperty("a")) {
                            temp["colorTransform"]["aM"] = (stuFrame["color"]["a"] / 255) * 100;
                        }
                        if (stuFrame["color"].hasOwnProperty("r")) {
                            temp["colorTransform"]["rM"] = (stuFrame["color"]["r"] / 255) * 100;
                        }
                        if (stuFrame["color"].hasOwnProperty("g")) {
                            temp["colorTransform"]["gM"] = (stuFrame["color"]["g"] / 255) * 100;
                        }
                        if (stuFrame["color"].hasOwnProperty("b")) {
                            temp["colorTransform"]["bM"] = (stuFrame["color"]["b"] / 255) * 100;
                        }
                    }
                    temp["transform"] = {};
                    temp["transform"]["x"] = stuFrame["x"] * dbData["textureScale"];
                    temp["transform"]["y"] = -stuFrame["y"] * dbData["textureScale"];
                    temp["transform"]["scX"] = (stuFrame["cX"] + bone["transform"]["scX"] - 1) / bone["transform"]["scX"];
                    temp["transform"]["scY"] = (stuFrame["cY"] + bone["transform"]["scY"] - 1) / bone["transform"]["scY"];
                    temp["transform"]["skX"] = this.radianToAngle(stuFrame["kX"]);
                    temp["transform"]["skY"] = -this.radianToAngle(stuFrame["kY"]);
                    dbFrames.push(temp); //如果第一帧没有数据，cocos是直接取第二帧数据作为第一帧数据。
                }
            }
            if (stuFrame["dI"] < 0) {
                dbFrame["hide"] = 1;
            }
            else if (stuFrame["dI"] > 0) {
                dbFrame["displayIndex"] = stuFrame["dI"];
            }
            //        else if (stuFrame["dI"] < -900) {
            //            dbFrame["hide"] = 1;
            //        }
            if (stuFrame["tweenFrame"] == false) {
                dbFrame["tweenEasing"] = "NaN";
            }
            dbFrames.push(dbFrame);
            if (i < stuFrames.length - 1) {
                var nextFrame = stuFrames[i + 1];
                dbFrame["duration"] = nextFrame["fi"] - stuFrame["fi"];
            }
            else {
                dbFrame["duration"] = 0;
            }
            if (stuFrame["evt"]) {
                dbFrame["event"] = stuFrame["evt"];
            }
            dbFrame["z"] = z;
            if (stuFrame["bd_src"] == 700 && stuFrame["bd_dst"] == 1) {
                dbFrame["blendMode"] = "add";
            }
            if (stuFrame["color"]) {
                dbFrame["colorTransform"] = {};
                dbFrame["colorTransform"]["aO"] = 0;
                dbFrame["colorTransform"]["rO"] = 0;
                dbFrame["colorTransform"]["gO"] = 0;
                dbFrame["colorTransform"]["bO"] = 0;
                dbFrame["colorTransform"]["aM"] = 100;
                dbFrame["colorTransform"]["rM"] = 100;
                dbFrame["colorTransform"]["gM"] = 100;
                dbFrame["colorTransform"]["bM"] = 100;
                if (stuFrame["color"].hasOwnProperty("a")) {
                    dbFrame["colorTransform"]["aM"] = (stuFrame["color"]["a"] / 255) * 100;
                }
                if (stuFrame["color"].hasOwnProperty("r")) {
                    dbFrame["colorTransform"]["rM"] = (stuFrame["color"]["r"] / 255) * 100;
                }
                if (stuFrame["color"].hasOwnProperty("g")) {
                    dbFrame["colorTransform"]["gM"] = (stuFrame["color"]["g"] / 255) * 100;
                }
                if (stuFrame["color"].hasOwnProperty("b")) {
                    dbFrame["colorTransform"]["bM"] = (stuFrame["color"]["b"] / 255) * 100;
                }
            }
            dbFrame["transform"] = {};
            dbFrame["transform"]["x"] = stuFrame["x"] * dbData["textureScale"];
            dbFrame["transform"]["y"] = -stuFrame["y"] * dbData["textureScale"];
            dbFrame["transform"]["scX"] = (stuFrame["cX"] + bone["transform"]["scX"] - 1) / bone["transform"]["scX"];
            dbFrame["transform"]["scY"] = (stuFrame["cY"] + bone["transform"]["scY"] - 1) / bone["transform"]["scY"];
            dbFrame["transform"]["skX"] = this.radianToAngle(stuFrame["kX"]);
            dbFrame["transform"]["skY"] = -this.radianToAngle(stuFrame["kY"]);
        }
    };
    main.prototype.clone = function (frame, result) {
        for (var key in frame) {
            if (frame[key] instanceof Array) {
                result[key] = this.clone(frame[key], []);
            }
            else if (frame[key] instanceof Object) {
                result[key] = this.clone(frame[key], {});
            }
            else {
                result[key] = frame[key];
            }
        }
        return result;
    };
    main.prototype.setTimeline = function (dbTimelines, stuTimelines, dbData) {
        var tempDbTimelines = {};
        this.timelines = {};
        var maxIdx = 0;
        for (var i = 0; i < stuTimelines.length; i++) {
            var stuTimeline = stuTimelines[i];
            var dbTimeline = {};
            dbTimeline["name"] = stuTimeline["name"];
            this.addToArrayObj(tempDbTimelines, this.bones[stuTimeline["name"]]["z"], dbTimeline);
            dbTimeline["offset"] = 0;
            dbTimeline["frame"] = [];
            this.timelines[dbTimeline["name"]] = dbTimeline;
            dbTimeline["pX"] = 0;
            dbTimeline["pY"] = 0;
            this.setFrame(dbTimeline["frame"], stuTimeline["frame_data"], this.bones[dbTimeline["name"]], i, dbData);
        }
        this.sortArrayObj(tempDbTimelines, dbTimelines);
        //设置层级
        for (var i = 0; i < dbTimelines.length; i++) {
            var frames = dbTimelines[i]["frame"];
            for (var k = 0; k < frames.length; k++) {
                frames[k]["z"] = i;
            }
        }
    };
    main.prototype.setAnimation = function (dbAnimations, stuAnimations, dbData) {
        for (var i = 0; i < stuAnimations.length; i++) {
            var stuAnimation = stuAnimations[i];
            var dbAnimation = {};
            dbAnimations.push(dbAnimation);
            dbAnimation["duration"] = stuAnimation["dr"];
            dbAnimation["name"] = stuAnimation["name"];
            dbAnimation["fadeInTime"] = 0;
            dbAnimation["tweenEasing"] = stuAnimation["twE"];
            dbAnimation["loop"] = stuAnimation["lp"] == true ? 0 : 1;
            dbAnimation["scale"] = 1.0 / stuAnimation["sc"];
            dbAnimation["timeline"] = [];
            this.setTimeline(dbAnimation["timeline"], stuAnimation["mov_bone_data"], dbData);
            dbAnimation["timeline"].reverse();
        }
    };
    main.prototype.setDisplay = function (dbDisplays, stuDisplays, dbData) {
        for (var i = 0; stuDisplays && i < stuDisplays.length; i++) {
            var stuDisplay = stuDisplays[i];
            var dbDisplay = { "transform": {} };
            dbDisplays.push(dbDisplay);
            if (stuDisplay["displayType"] == 2) {
                dbDisplay["name"] = "noImage";
                dbDisplay["type"] = "image";
            }
            else {
                dbDisplay["name"] = stuDisplay["name"].replace(/(\.png)|(\.jpg)/, "");
                dbDisplay["type"] = "image"; // stuDisplay["displayType"] == 0 ? "image" :
                dbDisplay["transform"]["x"] = stuDisplay["skin_data"][0]["x"] * dbData["textureScale"];
                dbDisplay["transform"]["y"] = -stuDisplay["skin_data"][0]["y"] * dbData["textureScale"];
                dbDisplay["transform"]["pX"] = this.dbTexture[dbDisplay["name"]] ? this.dbTexture[dbDisplay["name"]]["pX"] : 0.5;
                dbDisplay["transform"]["pY"] = this.dbTexture[dbDisplay["name"]] ? (1 - this.dbTexture[dbDisplay["name"]]["pY"]) : 0.5;
                dbDisplay["transform"]["skX"] = this.radianToAngle(stuDisplay["skin_data"][0]["kX"]);
                dbDisplay["transform"]["skY"] = -this.radianToAngle(stuDisplay["skin_data"][0]["kY"]);
                dbDisplay["transform"]["scX"] = stuDisplay["skin_data"][0]["cX"];
                dbDisplay["transform"]["scY"] = stuDisplay["skin_data"][0]["cY"];
            }
        }
    };
    main.prototype.setSlot = function (dbSlots, stuSlots, dbData) {
        var tempDbSlots = {};
        for (var i = 0; i < stuSlots.length; i++) {
            var stuSlot = stuSlots[i];
            var dbSlot = {};
            this.addToArrayObj(tempDbSlots, this.bones[stuSlot["name"]]["z"], dbSlot);
            dbSlot["blendMode"] = "normal";
            dbSlot["z"] = this.bones[stuSlot["name"]]["z"];
            dbSlot["name"] = stuSlot["name"];
            dbSlot["parent"] = stuSlot["name"];
            dbSlot["display"] = [];
            this.setDisplay(dbSlot["display"], stuSlot["display_data"], dbData);
        }
        this.sortArrayObj(tempDbSlots, dbSlots);
        for (var i = 0; i < dbSlots.length; i++) {
            dbSlots[i]["z"] = i;
        }
    };
    main.prototype.setBone = function (dbBones, stuBones, dbData) {
        var tempDbBones = {};
        for (var i = 0; i < stuBones.length; i++) {
            var stuBone = stuBones[i];
            var dbBone = { "transform": {} };
            this.addToArrayObj(tempDbBones, stuBone["z"], dbBone);
            dbBone["name"] = stuBone["name"];
            dbBone["length"] = stuBone["bl"];
            if (stuBone["parent"] != null && stuBone["parent"] != "") {
                dbBone["parent"] = stuBone["parent"];
            }
            this.setLayer(stuBone["name"], stuBone["parent"]);
            dbBone["transform"]["x"] = stuBone["x"] * dbData["textureScale"];
            dbBone["transform"]["y"] = -stuBone["y"] * dbData["textureScale"];
            dbBone["transform"]["skX"] = this.radianToAngle(stuBone["kX"]);
            dbBone["transform"]["skY"] = -this.radianToAngle(stuBone["kY"]);
            dbBone["transform"]["scX"] = stuBone["cX"];
            dbBone["transform"]["scY"] = stuBone["cY"];
            this.bones[stuBone["name"]] = dbBone;
        }
        this.sortArrayObj(tempDbBones, dbBones);
        for (var i = 0; i < dbBones.length; i++) {
            //todo
            dbBones[i]["z"] = i;
        }
        this.resortLayers();
    };
    main.prototype.sortArrayObj = function (arrayObj, resultArray) {
        var maxIdx = 0;
        for (var key in arrayObj) {
            maxIdx = Math.max(key, maxIdx);
        }
        for (var i = 0; i <= maxIdx; i++) {
            if (arrayObj[i] == null) {
                continue;
            }
            for (var j = 0; j < arrayObj[i].length; j++) {
                resultArray.push(arrayObj[i][j]);
            }
        }
    };
    main.prototype.addToArrayObj = function (arrayObj, index, obj) {
        if (arrayObj[index] == null) {
            arrayObj[index] = [];
        }
        arrayObj[index].push(obj);
    };
    main.prototype.radianToAngle = function (radian) {
        return radian * 180 / Math.PI;
    };
    main.prototype.resortLayers = function () {
        var tempArr = [];
        for (var name in this.layersInfo) {
            tempArr.push({ "name": name, "children": this.layersInfo[name].concat([]) });
        }
        while (tempArr.length > 0) {
            for (var i = tempArr.length - 1; i >= 0; i--) {
                var info = tempArr[i];
                if (info["children"].length == 0) {
                    this.resultArr.push(info["name"]);
                    tempArr.splice(i, 1);
                    for (var j = 0; j < tempArr.length; j++) {
                        var temp = tempArr[j];
                        if (temp["children"].indexOf(info["name"]) >= 0) {
                            var idx = temp["children"].indexOf(info["name"]);
                            temp["children"].splice(idx, 1);
                        }
                    }
                }
            }
        }
        this.resultArr.reverse();
    };
    main.prototype.setLayer = function (name, parent) {
        if (this.layersInfo[name] == null) {
            this.layersInfo[name] = [];
        }
        if (parent != null && parent != "") {
            if (this.layersInfo[parent] == null) {
                this.layersInfo[parent] = [];
            }
            this.layersInfo[parent].push(name);
        }
    };
    return main;
})(DBImportTemplate);
