(function () {
    var currentInstallFolderURL = fl.scriptURI.replace("installPanel.jsfl", "");
    var flashConfigFolderURL = fl.configURI;
    var fileList = [
        "DragonBonesDesignPanel.swf",
        "DragonBonesDesignPanel/createAnimation.jsfl",
        "DragonBonesDesignPanel/dragonBones.jsfl",
        "DragonBonesDesignPanel/events.jsfl",
        "DragonBonesDesignPanel/import3DTextures.jsfl",
        "DragonBonesDesignPanel/utils.jsfl"
    ];
    for (var i = 0, l = fileList.length; i < l; ++i) {
        var url = currentInstallFolderURL + fileList[i];
        var fileTargetURL = flashConfigFolderURL + "WindowSWF/" + url.replace(currentInstallFolderURL, "");
        if (FLfile.exists(fileTargetURL)) {
            if (FLfile.remove(fileTargetURL)) { }
            else {
                fl.trace("Remove file error." + FLfile.uriToPlatformPath(fileTargetURL));
            }
        }
        if (FLfile.copy(url, fileTargetURL)) {
            fl.trace("Copy file." + FLfile.uriToPlatformPath(fileTargetURL));
        }
        else {
            fl.trace("Copy file error." + FLfile.uriToPlatformPath(url) + " " + FLfile.uriToPlatformPath(fileTargetURL));
        }
    }
	
	fl.trace("Install DragonBones plugin success.");
	fl.trace('Please restart Flash Pro, find the plugin in "Window -> Extensions -> DragonBonesDesignPanel".');
})();
//# sourceMappingURL=installPanel.js.map