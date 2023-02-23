"use strict";

// DragonBones init.
$.evalFile(new File($.fileName).parent.absoluteURI + "/DragonBones Scripts Only/init.js");
// Import.
var global = require("./DragonBones Scripts Only/global");
var file = require("./DragonBones Scripts Only/file");
var renames = [
    "exportToDragonBones.jsx", global.language.exportToDragonBones + ".jsx"
];
function showInstallWindow() {
    var installWindow = global.createWindowByObject({
        orientation: "column",
        alignChildren: ["fill", "top"],
        size: [360, 100],
        text: global.language.installWindow,
        margins: 15,
        info$StaticText: { text: global.language.installWindow },
        buttonsGroup$Group: {
            margins: 0,
            spacing: 15,
            orientation: "row",
            alignment: ["right", "bottom"],
            helpButton$Button: { text: global.language.help, size: [100, 30] },
            okButton$Button: { text: global.language.ok, size: [100, 30] },
            cancelButton$Button: { text: global.language.cancle, size: [100, 30], properties: { name: "cancel" } },
        }
    });
    installWindow.buttonsGroup.helpButton.onClick = function () {
        global.getURL(global.language.pluginURL);
    };
    installWindow.buttonsGroup.okButton.onClick = function () {
        var targetFolderURL = app.path.absoluteURI + "/Presets/Scripts";
        var failedFiles = install(targetFolderURL);
        if (failedFiles.length > 0) {
            alert(global.language.installFailed);
            file.reveal(targetFolderURL);
        }
        else {
            alert(global.language.installCompleted);
            installWindow.close();
        }
    };
    installWindow.show();
}
function install(targetFolderURL) {
    var currentFolder = new File($.fileName).parent;
    var targetFolder = new Folder(targetFolderURL);
    var failedFiles = [];
    var copyFiles = function (folder, target) {
        var files = folder.getFiles();
        for (var i = 0, l = files.length; i < l; ++i) {
            var file_1 = files[i];
            if (file_1 instanceof Folder) {
                var targetFolder_1 = new Folder(target.absoluteURI + "/" + file_1.displayName);
                if (targetFolder_1.exists) {
                    targetFolder_1.remove();
                }
                if (targetFolder_1.create()) {
                    copyFiles(file_1, targetFolder_1);
                }
                else {
                    failedFiles.push(targetFolder_1);
                }
            }
            else if (file_1.fullName != $.fileName) {
                var name = file_1.displayName;
                var renameIndex = renames.indexOf(name);
                if (renameIndex >= 0) {
                    name = renames[renameIndex + 1];
                }
                var targetFile = new File(target.absoluteURI + "/" + name);
                if (targetFile.exists) {
                    targetFile.remove();
                }
                if (!file_1.copy(targetFile)) {
                    failedFiles.push(file_1);
                }
            }
        }
    };
    if (targetFolder.exists) {
        copyFiles(currentFolder, targetFolder);
    }
    return failedFiles;
}
showInstallWindow();
