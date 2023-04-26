"use strict";

// DragonBones init.
$.evalFile(new File($.fileName).parent.absoluteURI + "/DragonBones Scripts Only/init.js");
// Import.
var types = require("./DragonBones Scripts Only/types");
var global = require("./DragonBones Scripts Only/global");
var objects = require("./DragonBones Scripts Only/objects");
var file = require("./DragonBones Scripts Only/file");
var dbf = require("./DragonBones Scripts Only/dragonBonesFormat");
var PX = "px";
var EXPORT_URL = "/DragonBones";
var EXPORT_TEXTURE_URL = "/texture";
//
function showExportWindow() {
    var LOCAL = "dragonbones/photoshop";
    var CONFIG = "config";
    var shareObject = objects.ShareObject.getLocal(LOCAL);
    var config = shareObject.getData()[CONFIG];
    if (!config) {
        shareObject.getData()[CONFIG] = global.defaultConfig;
        shareObject.flush();
        config = shareObject.getData()[CONFIG] || global.defaultConfig;
    }
    var margins = 15;
    var exportWindow = global.createWindowByObject({
        orientation: "column",
        alignChildren: ["fill", "top"],
        size: [360, 360],
        text: global.language.exportWindow,
        margins: margins,
        spacing: margins,
        armatureTypePanel$Panel: {
            margins: margins,
            spacing: margins,
            orientation: "row",
            text: global.language.armatureType,
            i1$RadioButton: { text: global.language.armature, value: config.armatureType == dbf.ArmatureType.Armature },
            i2$RadioButton: { text: global.language.movieClip, value: config.armatureType == dbf.ArmatureType.MovieClip },
            i3$RadioButton: { text: global.language.comic, value: config.armatureType == dbf.ArmatureType.Stage }
        },
        groupA$Group: {
            margins: 0,
            spacing: margins,
            orientation: "row",
            alignChildren: ["fill", "bottom"],
            originTypePanel$Panel: {
                margins: margins,
                spacing: margins,
                orientation: "row",
                alignChildren: "center",
                text: global.language.originType,
                dropDownList$DropDownList: {
                    size: [80, 24],
                    properties: {
                        items: [
                            global.language[types.OriginType[types.OriginType.Center]],
                            global.language[types.OriginType[types.OriginType.TopLeft]],
                            global.language[types.OriginType[types.OriginType.Top]],
                            global.language[types.OriginType[types.OriginType.TopRight]],
                            global.language[types.OriginType[types.OriginType.Right]],
                            global.language[types.OriginType[types.OriginType.BottomRight]],
                            global.language[types.OriginType[types.OriginType.Bottom]],
                            global.language[types.OriginType[types.OriginType.BottomLeft]],
                            global.language[types.OriginType[types.OriginType.Left]],
                        ]
                    }
                },
            },
            scaleTypePanel$Panel: {
                margins: margins,
                spacing: margins,
                orientation: "row",
                alignChildren: "center",
                text: global.language.scaleType,
                slider$Slider: { size: [100, 24], minvalue: 1, maxvalue: 100, value: Math.round(config.scale * 100) },
                value$EditText: { size: [40, 24], justify: "right", text: Math.round(config.scale * 100) }
            },
        },
        ignoreHiddenLayers$Checkbox: { text: global.language.ignoreHiddenLayers, value: config.ignoreHiddenLayers },
        onlyUpdateTexture$Checkbox: { text: global.language.onlyUpdateTexture, value: config.onlyUpdateTexture },
        exportGroup$Group: {
            margins: 0,
            spacing: margins,
            orientation: "row",
            alignment: ["fill", "bottom"],
            toDataButton$Button: { text: global.language.toData, size: [150, 30] },
            toDragonBonesProButton$Button: { text: global.language.toDragonBonesPro, size: [160, 30] },
        },
        buttonsGroup$Group: {
            margins: 0,
            spacing: margins,
            orientation: "row",
            alignment: ["fill", "bottom"],
            helpButton$Button: { text: global.language.help, size: [150, 30] },
            cancelButton$Button: { text: global.language.cancle, size: [160, 30], properties: { name: "cancel" } },
        }
    });
    //
    exportWindow.armatureTypePanel.enabled = !config.onlyUpdateTexture;
    exportWindow.groupA.originTypePanel.enabled = !config.onlyUpdateTexture;
    exportWindow.groupA.originTypePanel.dropDownList.selection = exportWindow.groupA.originTypePanel.dropDownList.items[config.originType];
    exportWindow.groupA.scaleTypePanel.slider.onChanging = function () {
        exportWindow.groupA.scaleTypePanel.value.text = Math.round(exportWindow.groupA.scaleTypePanel.slider.value);
    };
    exportWindow.groupA.scaleTypePanel.value.onChanging = function () {
        var value = Math.round(+exportWindow.groupA.scaleTypePanel.value.text || 100);
        exportWindow.groupA.scaleTypePanel.value.text = value;
        exportWindow.groupA.scaleTypePanel.slider.value = value;
    };
    exportWindow.onlyUpdateTexture.onClick = function () {
        var value = exportWindow.onlyUpdateTexture.value;
        exportWindow.armatureTypePanel.enabled = !value;
        exportWindow.groupA.originTypePanel.enabled = !value;
    };
    exportWindow.exportGroup.toDataButton.onClick = function () {
        exportTo(false);
    };
    exportWindow.exportGroup.toDragonBonesProButton.onClick = function () {
        exportTo(true);
    };
    exportWindow.buttonsGroup.helpButton.onClick = function () {
        global.getURL(global.language.pluginURL);
    };
    function exportTo(toDragonBonesPro) {
        if (app.documents.length > 0) {
            // Update config.
            config.armatureType = global.getGroupSelected(exportWindow.armatureTypePanel);
            config.originType = exportWindow.groupA.originTypePanel.dropDownList.selection.index;
            config.scale = Number(exportWindow.groupA.scaleTypePanel.value.text) * 0.01;
            config.ignoreHiddenLayers = exportWindow.ignoreHiddenLayers.value;
            config.onlyUpdateTexture = exportWindow.onlyUpdateTexture.value;
            var exportURL = "";
            try {
                if (app.activeDocument.path) {
                    exportURL = app.activeDocument.path.absoluteURI + EXPORT_URL;
                }
            }
            catch (error) {
            }
            // Select output url.
            if (!exportURL) {
                var outURL = "outURL";
                var prevOutURL = shareObject.getData()[outURL];
                exportURL = Folder.selectDialog("", prevOutURL ? prevOutURL : undefined).absoluteURI;
                if (exportURL) {
                    shareObject.getData()[outURL] = exportURL;
                }
            }
            if (exportURL) {
                var rulerUnits = app.preferences.rulerUnits;
                app.preferences.rulerUnits = Units.PIXELS;
                if (app.preferences.rulerUnits == Units.PIXELS) {
                    var dataURL_1 = exportData(config, exportURL); // 
                    shareObject.flush();
                    exportWindow.close();
                    if (dataURL_1) {
                        if (toDragonBonesPro) {
                            var dataPath = new File(dataURL_1).fsName;
                            var texturesPath = new Folder(exportURL + EXPORT_TEXTURE_URL).fsName;
                            var url = "dragonbonespro:///import";
                            var params = {};
                            if (!config.onlyUpdateTexture) {
                                params.dbdata = dataPath;
                            }
                            params.texturefolder = texturesPath;
                            params.ismin = false;
                            params.type = "photoshop";
                            global.getURL(url, params);
                            var completedWindow = global.createWindowByObject({
                                orientation: "column",
                                alignChildren: ["fill", "top"],
                                size: [360, 80],
                                text: global.language.exportComplete,
                                margins: margins,
                                spacing: margins,
                                buttonsGroup$Group: {
                                    margins: 0,
                                    spacing: margins,
                                    orientation: "row",
                                    alignment: ["center", "bottom"],
                                    cancelButton$Button: { text: global.language.ok, size: [160, 30], properties: { name: "cancel" } },
                                }
                            });
                            completedWindow.show();
                        }
                        else {
                            var completedWindow_1 = global.createWindowByObject({
                                orientation: "column",
                                alignChildren: ["fill", "top"],
                                size: [360, 160],
                                text: global.language.exportComplete,
                                margins: margins,
                                spacing: margins,
                                armatureTypePanel$Panel: {
                                    margins: margins,
                                    spacing: margins,
                                    orientation: "row",
                                    alignChildren: ["fill", "top"],
                                    text: global.language.toData,
                                    message$EditText: { text: new Folder(dataURL_1).fsName },
                                },
                                buttonsGroup$Group: {
                                    margins: 0,
                                    spacing: margins,
                                    orientation: "row",
                                    alignment: ["center", "bottom"],
                                    revealButton$Button: { text: global.language.reveal, size: [150, 30] },
                                    cancelButton$Button: { text: global.language.ok, size: [160, 30], properties: { name: "cancel" } },
                                }
                            });
                            completedWindow_1.buttonsGroup.revealButton.onClick = function () {
                                completedWindow_1.close();
                                file.reveal(dataURL_1);
                            };
                            completedWindow_1.show();
                        }
                    }
                }
                else {
                    alert(global.language.errorRulerUnits);
                }
                app.preferences.rulerUnits = rulerUnits;
            }
        }
        else {
            alert(global.language.errorNoDocument);
        }
    }
    exportWindow.show();
}
function deleteDocumentAncestorsMetadata() {
    if (!ExternalObject.AdobeXMPScript) {
        ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    }
    var xmp = new XMPMeta(app.activeDocument.xmpMetadata.rawData);
    // Begone foul Document Ancestors!
    xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");
    app.activeDocument.xmpMetadata.rawData = xmp.serialize();
}
function exportData(config, url) {
    var stageWidth = app.activeDocument.width.as(PX);
    var stageHeight = app.activeDocument.height.as(PX);
    var name = app.activeDocument.name.substring(0, app.activeDocument.name.lastIndexOf("."));
    var hideLayers = [];
    var slotNames = [];
    var pngSaveOptions = new PNGSaveOptions();
    var dragonBonesData = new dbf.DragonBones();
    var armatureData = new dbf.Armature();
    var boneData = new dbf.Bone();
    var skinData = new dbf.Skin();
    dragonBonesData.name = name;
    dragonBonesData.version = "4.5";
    armatureData.name = "armatureName";
    armatureData.aabb.width = stageWidth * config.scale;
    armatureData.aabb.height = stageHeight * config.scale;
    boneData.name = "root";
    dragonBonesData.armature.push(armatureData);
    armatureData.bone.push(boneData);
    armatureData.skin.push(skinData);
    if (dragonBonesData.name.indexOf("+") >= 0) {
        dragonBonesData.name = dragonBonesData.name.replace(/\+/g, "_");
    }
    //
    deleteDocumentAncestorsMetadata();
    // 
    app.activeDocument.duplicate();
    //
    var outputFolder = new Folder(url);
    var textureFolder = new Folder(url + EXPORT_TEXTURE_URL);
    outputFolder.create();
    file.removeFolder(textureFolder);
    textureFolder.create();
    //
    var historyIndex = app.activeDocument.historyStates.length - 1;
    var layers = [];
    global.getLayers(app.activeDocument, layers);
    // Hide all layers.
    for (var i = 0, l = layers.length; i < l; ++i) {
        var value = layers[i];
        if (value instanceof Array) {
            for (var i_1 = 0, l_1 = value.length; i_1 < l_1; ++i_1) {
                value[i_1].visible = false;
            }
        }
        else {
            if (value.isBackgroundLayer) {
                // Close copy document.
                app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                alert(global.language.errorBackgroundLayerLocked);
                return null;
            }
            if (value.visible) {
                value.visible = false;
            }
            else {
                hideLayers.push(value);
            }
        }
    }
    var rectangle = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 };
    var frameRectangle = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 };
    // Export layers.
    for (var l = layers.length, i = l - 1; i >= 0; --i) {
        var value = layers[i];
        if (value instanceof Array) {
            for (var i_2 = 0, l_2 = value.length; i_2 < l_2; ++i_2) {
            }
        }
        else {
            if (config.ignoreHiddenLayers && hideLayers.indexOf(value) >= 0) {
                continue;
            }
            // Show layer.
            value.visible = true;
            // Get texture position and trim texture.
            var frameX = 0.0;
            var frameY = 0.0;
            modifyImageRectangle(value.bounds, rectangle, stageWidth, stageHeight);
            frameX = rectangle.x;
            frameY = rectangle.y;
            app.activeDocument.trim(TrimType.TRANSPARENT, true, true, false, false);
            frameX += stageWidth - app.activeDocument.width.as(PX) - frameX;
            frameY += stageHeight - app.activeDocument.height.as(PX) - frameY;
            app.activeDocument.trim(TrimType.TRANSPARENT, false, false, true, true);
            modifyImageRectangle(value.bounds, rectangle, stageWidth, stageHeight);
            rectangle.x = rectangle.width * 0.5 + frameX;
            rectangle.y = rectangle.height * 0.5 + frameY;
            if (rectangle.width * rectangle.height <= 0) {
                continue;
            }
            switch (config.originType) {
                case types.OriginType.Center:
                    rectangle.x -= stageWidth * 0.5;
                    rectangle.y -= stageHeight * 0.5;
                    break;
                case types.OriginType.TopLeft:
                    break;
                case types.OriginType.Top:
                    rectangle.x -= stageWidth * 0.5;
                    break;
                case types.OriginType.TopRight:
                    rectangle.x -= stageWidth;
                    break;
                case types.OriginType.Right:
                    rectangle.x -= stageWidth;
                    rectangle.y -= stageHeight * 0.5;
                    break;
                case types.OriginType.BottomRight:
                    rectangle.x -= stageWidth;
                    rectangle.y -= stageHeight;
                    break;
                case types.OriginType.Bottom:
                    rectangle.x -= stageWidth * 0.5;
                    rectangle.y -= stageHeight;
                    break;
                case types.OriginType.BottomLeft:
                    rectangle.y -= stageHeight;
                    break;
                case types.OriginType.Left:
                    rectangle.y -= stageHeight * 0.5;
                    break;
            }
            // Slot name.
            var index = 0;
            var nameChanged = value.name.replace(/(\s)|(\.)|(\/)|(\\)|(\*)|(\:)|(\?)|(\")|(\<)|(\>)|(\|)/g, "_");
            while (slotNames.indexOf(nameChanged) >= 0) {
                nameChanged = value.name + "_" + index++;
            }
            slotNames.push(nameChanged);
            //
            var slotData = new dbf.Slot();
            var displayData = new dbf.Display();
            var slotDataInSkin = { name: nameChanged, display: [displayData] };
            slotData.name = nameChanged;
            slotData.parent = boneData.name;
            displayData.name = slotData.name;
            displayData.transform.x = rectangle.x * config.scale;
            displayData.transform.y = rectangle.y * config.scale;
            armatureData.slot.push(slotData);
            skinData.slot.push(slotDataInSkin);
            // Scale texture.
            if (config.scale != 1) {
                app.activeDocument.resizeImage(new UnitValue(width * config.scale, PX), null, null, ResampleMethod.BICUBICSHARPER);
            }
            // Export texture.
            var file_1 = new File(url + EXPORT_TEXTURE_URL + "/" + displayData.name);
            if (file_1.exists) {
                file_1.remove();
            }
            app.activeDocument.saveAs(file_1, pngSaveOptions, true, Extension.LOWERCASE);
            if (historyIndex >= 0) {
                app.activeDocument.activeHistoryState = app.activeDocument.historyStates[historyIndex];
            }
            // Show layer.
            value.visible = false;
        }
    }
    // Compress and export data.
    dbf.compress(dragonBonesData, dbf.defaults);
    var dataURL = url + "/" + dragonBonesData.name + ".json";
    file.write(dataURL, JSON.stringify(dragonBonesData));
    // Close copy document.
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    return dataURL;
}
function modifyImageRectangle(bounds, rectangle, stageWidth, stageHeight) {
    rectangle.x = Math.max(bounds[0].as(PX), 0.0);
    rectangle.y = Math.max(bounds[1].as(PX), 0.0);
    rectangle.width = Math.min(bounds[2].as(PX), stageWidth) - rectangle.x;
    rectangle.height = Math.min(bounds[3].as(PX), stageHeight) - rectangle.y;
}
showExportWindow();
