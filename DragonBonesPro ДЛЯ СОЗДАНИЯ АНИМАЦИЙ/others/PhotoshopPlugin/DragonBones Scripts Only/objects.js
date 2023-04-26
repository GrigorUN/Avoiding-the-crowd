"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var global = require("./global");
var file = require("./file");
var ShareObject = (function () {
    function ShareObject(name) {
        this._name = null;
        this._data = null;
        if (!ShareObject._data) {
            var url = global.dragonBones + "/shareObject.json";
            var jsonString = file.read(url);
            if (jsonString) {
                ShareObject._data = JSON.parse(jsonString);
            }
            else {
                ShareObject._data = {};
            }
        }
        this._name = name;
        this._data = ShareObject._data[this._name] = ShareObject._data[this._name] || {};
    }
    ShareObject.flush = function () {
        var url = global.dragonBones + "/shareObject.json";
        var jsonString = JSON.stringify(ShareObject._data);
        if (file.write(url, jsonString)) {
        }
        else {
            alert("Flush share object error.");
        }
    };
    ShareObject.getLocal = function (name) {
        var shareObject = new ShareObject(name);
        return shareObject;
    };
    ShareObject.prototype.getData = function () {
        return this._data;
    };
    ShareObject.prototype.setData = function (value) {
        this._data = value;
        ShareObject._data[this._name] = this._data;
    };
    ShareObject.prototype.flush = function () {
        ShareObject.flush();
    };
    ShareObject.prototype.clear = function () {
        for (var i in this._data) {
            delete this._data[i];
        }
        this.flush();
    };
    return ShareObject;
}());
ShareObject._data = null;
exports.ShareObject = ShareObject;
