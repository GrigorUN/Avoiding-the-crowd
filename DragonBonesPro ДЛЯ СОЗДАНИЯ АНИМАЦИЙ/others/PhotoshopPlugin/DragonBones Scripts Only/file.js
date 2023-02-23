"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var global = require("./global");
function exists(url) {
    return new File(url).exists;
}
exports.exists = exists;
function write(url, data) {
    var file = new File(url);
    if (file.exists) {
        file.remove();
    }
    file.encoding = "UTF8";
    file.open("w");
    var success = file.write(data);
    file.close();
    return success;
}
exports.write = write;
function read(url) {
    var file = new File(url);
    if (!file.exists) {
        return "";
    }
    file.encoding = "UTF8";
    file.open("r");
    var data = file.read() || "";
    file.close();
    return data;
}
exports.read = read;
function reveal(url) {
    var file = new File(url);
    if (!file.exists) {
        return false;
    }
    var comandLine = "";
    if (global.isWindows) {
        var isNotEnglish = /.*[\u4e00-\u9fa5]+.*$/.test(file.fsName);
        comandLine = 'start %SystemRoot%\\explorer.exe /select, "' + file.fsName.replace(/\//g, '\\') + '"';
        if (isNotEnglish) {
            var batFile = new File(global.temp + "/reveal.bat");
            batFile.open("w");
            batFile.write(comandLine);
            batFile.close();
            batFile.execute();
        }
        else {
            app.system(comandLine);
        }
    }
    else {
        comandLine = 'open --reveal "' + file.fsName + '"';
        app.system(comandLine);
    }
    return true;
}
exports.reveal = reveal;
function open(url) {
    return false;
}
exports.open = open;
function run(url) {
    return false;
}
exports.run = run;
function removeFolder(folder) {
    if (folder && folder.exists) {
        var files = folder.getFiles();
        for (var i = 0, l = files.length; i < l; ++i) {
            var file = files[i];
            if (file instanceof Folder) {
                removeFolder(file);
            }
            else {
                file.remove();
            }
        }
        folder.remove();
    }
}
exports.removeFolder = removeFolder;
