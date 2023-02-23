// Photoshop plugin install.
var parentURI = new File($.fileName).parent.absoluteURI;
try {
    $.evalFile(parentURI + "./others/PhotoshopPlugin/install.jsx");
    //
    file.reveal(parentURI + "./others/PhotoshopPlugin/install.jsx");
}
catch (error) {
    var str = null;
    if (app.locale == "zh_CN") {
        str = "请按照 DragonBones Pro “菜单栏 > 帮助 > PSD 导出插件安装指引” 中步骤来安装导出插件。";
    }
    else { 
        str = "Please follow the steps in Pro DragonBones \"Menu Bar > Help > PSD export plugin installation guidelines\" to install the plugin.";
    }

    alert(str);
}

// //export hidden layer
// var ignoreHiddenLayers = true;
// var savePNGs = true;
// var saveJSON = true;
// var scaleImage = 1;
// var alignmentUpleft = true;
// var ru = app.preferences.rulerUnits;
// app.preferences.rulerUnits = Units.PIXELS;
// alertDialog();
// app.preferences.rulerUnits = ru;

// /**alert control panel**/
// function alertDialog () {
// 	if (!hasFilePath()) {
// 		alert("File did not save\nPlease save the file and try again");
// 		return;
// 	}

// 	var dialog = new Window("dialog", "导出 (Export)");

// 	dialog.savePNGs = dialog.add("checkbox", undefined, "导出 PNGs (Export PNGs)"); 
// 	dialog.savePNGs.value = savePNGs;
// 	dialog.savePNGs.alignment = "left";

// 	dialog.saveJSON = dialog.add("checkbox", undefined, "导出 JSON (Export JSON)");
// 	dialog.saveJSON.alignment = "left";
// 	dialog.saveJSON.value = saveJSON;

// 	dialog.ignoreHiddenLayers = dialog.add("checkbox", undefined, "忽略隐藏图层 (Ignore Hidden Layers)");
// 	dialog.ignoreHiddenLayers.alignment = "left";
// 	dialog.ignoreHiddenLayers.value = ignoreHiddenLayers;

//    /* dialog.orgin = dialog.add("checkbox", undefined, "原点在舞台中心 (The origin in the center of the stage)");
// 	dialog.orgin.alignment = "left";
// 	dialog.orgin.value = alignmentUpleft;*/

//     var radioCenter = dialog.add("radiobutton",undefined,"原点在舞台中心 (The origin in the center of the stage)");
//      var radioUpleft = dialog.add("radiobutton",undefined,"原点在舞台左上 (The origin in the Upleft of the stage)");
//     radioCenter.alignment = "left";
//     radioUpleft.alignment = "left";
//     radioCenter.value = true;
//     radioUpleft.value = false;
// 	var scaleGroup = dialog.add("panel", [0, 0, 340, 50], "图片缩放 (Image Scale)");
// 	var scaleText = scaleGroup.add("edittext", [10,12,40,30], scaleImage * 100); 
// 	scaleGroup.add("statictext", [45, 14, 80, 30], "%");
// 	var scaleSlider = scaleGroup.add("slider", [80, 15,260,28], scaleImage * 100, 1, 100);
// 	scaleText.onChanging = function() {
// 		scaleSlider.value = scaleText.text;
// 		if (scaleText.text < 1 || scaleText.text > 100) {
// 			alert("Valid numbers are 1-100.");
// 			scaleText.text = scaleImage * 100;
// 			scaleSlider.value = scaleImage * 100;
// 		}
// 	};
// 	scaleSlider.onChanging = function() { scaleText.text = Math.round(scaleSlider.value); };
//     var tipsGroup = dialog.add("panel", [0, 0, 340, 70], "小贴士 (Tips)");
//     var tipsText = tipsGroup.add("statictext", [10, 12, 340, 30], "请确认首选项中的标尺单位是像素"); 
//     var tips2Text = tipsGroup.add("statictext", [10, 27, 340, 60], "Please make sure the rule unit is pixel in preference. "); 

// 	var confirmGroup = dialog.add("group", [0, 0, 280, 30]);
// 	var okButton = confirmGroup.add("button", [60, 0, 130, 30], "Ok");
// 	var cancelButton = confirmGroup.add("button", [140, 0, 220, 30], "Cancel");

//     okButton.onClick = function() {
// 		savePNGs = dialog.savePNGs.value;
// 		saveJSON = dialog.saveJSON.value;
// 		ignoreHiddenLayers = dialog.ignoreHiddenLayers.value;
// 		scaleImage = scaleSlider.value / 100;
// 		init();
//         dialog.close(0)
// 	};
//     radioCenter.onClick = function(){
//         alignmentUpleft = true
//     }
//     radioUpleft.onClick = function(){
//         alignmentUpleft = false
//     }
// 	cancelButton.onClick = function() {
//          dialog.close(0)
//        // this.parent.close(0); 
//         return; 
//     };
// 	dialog.orientation = "column";
// 	dialog.center();
// 	dialog.show();
// }
// function checkLayerName(names,layerName)
// {
//     var i  = 1;
// 	for(var key in layerName){
//         if(layerName[key] == names){
//             names = names+"_"+i;
//             names = checkLayerName(names,layerName);
//         };
//     }
//     return names
// }
// function init () {
//     var stageWidth = app.activeDocument.width.as("px") * scaleImage;
//     var stageHeight = app.activeDocument.height.as("px") * scaleImage;
//     var name = decodeURI(app.activeDocument.name);
// 	name = name.substring(0, name.indexOf("."));

// 	var dir = app.activeDocument.path + "/DragonBones/"+name+"/";

//     new Folder(dir).create();
//     if(savePNGs){
//         new Folder(dir + "/texture/" ).create();
//     }

// 	app.activeDocument.duplicate();
// 	var layers = [];
// 	getLayers(app.activeDocument, layers);

// 	var layerCount = layers.length;
// 	var layerVisibility = {};
//     var layerName = [];
//     var newName;
// 	for (var i = layerCount - 1; i >= 0; i--) {
// 		var layer = layers[i];
// 		layerVisibility[layer] = getLayerVisible(layer);
// 		layer.visible = false;
//          newName = checkLayerName(trim(layer.name),layerName)
//          layerName[i]  = newName;
// 	}

// 	if (saveJSON || savePNGs) {
// 		var json = "{\"name\":\""+name+"\",\n\"version\":\"4.5\",\n\"armature\":[{\"name\":\"armatureName\",";
//         json+="\"aabb\":{\"x\":0,\"y\":0,\"width\":"+stageWidth+",\"height\":"+stageHeight+"},";
//         json+="\"bone\":[{\"name\":\"root\"}],\"slot\":[\n";
// 		for (var i = layerCount - 1; i >= 0; i--) {
// 			var layer = layers[i];

// 			if (ignoreHiddenLayers && !layerVisibility[layer]) continue;

// 			json += "{\"name\":\"" + layerName[i]  + "\",\"parent\":\"root\"}";
//             json += ",";
// 		}
//         if(json.substr(json.length-1) == ","){
//             json = json.substr(0, json.length-1);
//         }
// 		json += "],\"skin\":[{\n"+"\"name\":\"\",\n\"slot\":[";

// 		for (var i = layerCount - 1; i >= 0; i--) {
// 			var layer = layers[i];

// 			if (ignoreHiddenLayers && !layerVisibility[layer]) continue;

// 			var x = app.activeDocument.width.as("px") * scaleImage;

// 			layer.visible = true;
// 			if (!layer.isBackgroundLayer)
// 				app.activeDocument.trim(TrimType.TRANSPARENT, false, true, true, false);

//              x -= app.activeDocument.width.as("px") * scaleImage;
//             var y = app.activeDocument.height.as("px") * scaleImage;
// 			if (!layer.isBackgroundLayer)
// 				app.activeDocument.trim(TrimType.TRANSPARENT, true, false, false, true);
// 			var width = app.activeDocument.width.as("px") * scaleImage;
// 			var height = app.activeDocument.height.as("px") * scaleImage; 
// 			// Save image.
// 			if (savePNGs) {              
//                   if (scaleImage != 1) scaleImages();                  
//                   var file = File(dir + "/texture/" + layerName[i] );
//                   if (file.exists) file.remove();
//                   activeDocument.saveAs(file, new PNGSaveOptions(), true, Extension.LOWERCASE);
//                   if (scaleImage != 1) stepHistoryBack();                
// 			}
// 			if (!layer.isBackgroundLayer) {
//                 //if(width != stageWidth || height != stageHeight){
// 				var arr = layer.bounds;
// 				if(arr[2] != 0 && arr[3] != 0){
// 					stepHistoryBack();
// 					stepHistoryBack();
// 				}
//                 //}
// 			}
// 			layer.visible = false;
//             if(alignmentUpleft){
//                  //Set image to center
//                 x += Math.round(width / 2);
//                 y -= Math.round(height / 2);
//                 //Set view to center
//                 x -= Math.round(stageWidth / 2);
//                y -= Math.round(stageHeight / 2);
//              }else{
//                 //Set image to center
//                 x += Math.round(width / 2);
//                 y -= Math.round(height / 2);
//              }
//             json +="{\"name\":\""+layerName[i] +"\",\"display\":["
// 			json += "{\"name\":\"" + layerName[i]  + "\",\"type\":\"" + "image"+ "\",\"transform\":{\"x\":" + x + ",\"y\":" + y +"}}]}";
//             json += ","; 
// 		}
//         if(json.substr(json.length-1) == ","){
//             json = json.substr(0, json.length-1);
//         }
// 		json += "]}], \"animations\": []}]}";

// 		if (saveJSON) {
// 			var file = new File(dir + name + ".json");
// 			file.remove();
// 			file.open("a");
// 			file.lineFeed = "\n";
//              file.encoding="utf-8";
// 			file.write(json);
// 			file.close();
// 		}
// 	}
//      activeDocument.close(SaveOptions.DONOTSAVECHANGES);

//      var dia = new Window("dialog", "导出位置 (Export address)");
//      var tipsGroups = dia.add("panel", [0, 0, 280, 70], "");
//     var tipsTexts= tipsGroups.add("statictext", [10, 12, 280, 30], "导出地址 (Export address):"); 
//     var tips2Texts = tipsGroups.add("edittext", [10, 27, 280, 60], app.activeDocument.path.fsName+ "/DragonBones/"+name+"/"); 
//     var confirmGroups = dia.add("group", [0, 0, 280, 30]);
//     var okk = confirmGroups.add("button", [60, 0, 220, 30], "OK"); 
//     okk.onClick = function() {
//         dia.close(0)
// 	};
//      dia.orientation = "column";
// 	dia.center();
// 	dia.show();
// }

// function getLayerVisible(layer){
//         var bool = layer.visible;
//         var obj = layer;
//         while(obj.parent && obj.parent.hasOwnProperty ("visible")){
//             if(obj.parent.visible == false){
//                 bool = false;
//             }
//             obj = obj.parent;
//          }
//     return bool;
// }

// function hasLayerSets (layerset) {
// 	layerset = layerset.layerSets;
// 	for (var i = 0; i < layerset.length; i++)
// 		if (layerset[i].layerSets.length > 0) hasLayerSets(layerset[i]);
// }

// function scaleImages() {
// 	var imageSize = app.activeDocument.width.as("px");
// 	app.activeDocument.resizeImage(UnitValue(imageSize * scaleImage, "px"), undefined, 72, ResampleMethod.BICUBICSHARPER);
// }

// function stepHistoryBack () {
// 	var descriptor = new ActionDescriptor();
// 	var reference = new ActionReference();
// 	reference.putEnumerated( charIDToTypeID( "HstS" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Prvs" ));
// 	descriptor.putReference(charIDToTypeID( "null" ), reference);
// 	executeAction( charIDToTypeID( "slct" ), descriptor, DialogModes.NO );
// }

// function getLayers (layer, collect) {
// 	if (!layer.layers || layer.layers.length == 0) return layer;
// 	for (var i = 0, n = layer.layers.length; i < n; i++) {
// 		var child = getLayers(layer.layers[i], collect)
// 		if (child) collect.push(child);
// 	}
// }

// function trim (value) {
// 	return value.replace(/(\s)|(\.)|(\/)|(\\)|(\*)|(\:)|(\?)|(\")|(\<)|(\>)|(\|)/g, "_");
// }

// function hasFilePath() {
// 	var reference = new ActionReference();
// 	reference.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") ); 
// 	return executeActionGet(reference).hasKey(stringIDToTypeID('fileReference'));
// }