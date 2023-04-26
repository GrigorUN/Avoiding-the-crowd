/**
 * Created by Yuxin on 2015/8/11.
 */
var DBImportTemplate = (function () {
    function DBImportTemplate() {
        this._type = "DBImportTemplate";
    }
    /**支持导入的数据文件的扩展名**/
    DBImportTemplate.prototype.dataFileExtension = function () {
        return ["*"];
    };
    /**支持导入的数据文件的描述**/
    DBImportTemplate.prototype.dataFileDescription = function () {
        return "";
    };
    /**纹理集数据文件扩展名**/
    DBImportTemplate.prototype.textureAtlasDataFileExtension = function () {
        return ["*"];
    };
    /**查验导入数据是否支持纹理集**/
    DBImportTemplate.prototype.isSupportTextureAtlas = function () {
        return false;
    };
    /**查验导入数据是否支持本解析器**/
    DBImportTemplate.prototype.checkDataValid = function (data) {
        return true;
    };
    /**导入数据的解析**/
    DBImportTemplate.prototype.convertToDBData = function (data) {
        return data;
    };
    /**纹理集的解析**/
    DBImportTemplate.prototype.convertToDBTextureAtlasData = function (data) {
        return data;
    };
    DBImportTemplate.prototype.type = function () {
        return this._type;
    };
    return DBImportTemplate;
})();

/**
 * Created by Yuxin on 2015/8/11.
 */
var DBExportTemplate = (function () {
    function DBExportTemplate() {
        this._type = "DBExportTemplate";
    }
    DBExportTemplate.prototype.type = function () {
        return this._type;
    };
    return DBExportTemplate;
})();
var XML = (function () {
    function XML() {
    }
    /**
     * 解析一个XML字符串为JSON对象。
     * @method egret.XML.parse
     * @param value {string} 要解析的XML字符串。
     * @returns {any} 解析完后的JSON对象
     * @platform Web
     */
    XML.parse = function (value) {
        var xmlDoc = new DOMParser().parseFromString(value, "text/xml");
        if (!xmlDoc || !xmlDoc.childNodes) {
            return null;
        }
        var length = xmlDoc.childNodes.length;
        var found = false;
        for (var i = 0; i < length; i++) {
            var node = xmlDoc.childNodes[i];
            if (node.nodeType == 1) {
                found = true;
                break;
            }
        }
        if (!found) {
            return null;
        }
        var xml = this.loop(XML.parseNode(node));
        return xml;
    };
    XML.loop = function (_obj) {
        var xml = "";
        for (var temp in _obj) {
            //生成属性
            if (temp.charAt(0) == "$") {
                xml = xml.concat(temp.substring(1, temp.length) + " = \"" + _obj[temp] + "\" ");
            }
        }
        if (_obj["text"] != undefined) {
            xml = xml.concat(_obj["text"]);
        }
        if (_obj["children"] != undefined) {
            for (var prop in _obj["children"]) {
                xml = xml.concat(":" + this.loop(_obj["children"][prop]));
            }
        }
        return xml;
    };
    XML.parseNode = function (node) {
        if (!node || node.nodeType != 1) {
            return null;
        }
        var xml = {};
        xml.localName = node.localName;
        xml.name = node.nodeName;
        if (node.namespaceURI)
            xml.namespace = node.namespaceURI;
        if (node.prefix)
            xml.prefix = node.prefix;
        var attributes = node.attributes;
        var length = attributes.length;
        for (var i = 0; i < length; i++) {
            var attrib = attributes[i];
            var key = attrib.name;
            if (key.indexOf("xmlns:") == 0) {
                continue;
            }
            xml["$" + key] = attrib.value;
        }
        var children = node.childNodes;
        length = children.length;
        for (i = 0; i < length; i++) {
            var childNode = children[i];
            var childXML = XML.parseNode(childNode);
            if (childXML) {
                if (!xml.children) {
                    xml.children = [];
                }
                childXML.parent = xml;
                xml.children.push(childXML);
            }
        }
        if (!xml.children) {
            var text = node.textContent.trim();
            if (text) {
                xml.text = text;
            }
        }
        return xml;
    };
    /**
     *
     * 查找xml上符合节点路径的所有子节点。
     * @method egret.XML.findChildren
     * @param xml {any} 要查找的XML节点。
     * @param path {string} 子节点路径，例如"item.node"
     * @param result {egret.Array<any>} 可选参数，传入一个数组用于存储查找的结果。这样做能避免重复创建对象。
     * @returns {any} 节点路径的所有子节点
     * @platform Web
     */
    XML.findChildren = function (xml, path, result) {
        if (!result) {
            result = [];
        }
        else {
            result.length = 0;
        }
        XML.findByPath(xml, path, result);
        return result;
    };
    /**
     * @private
     * @method egret.XML.findByPath
     * @param xml {any}
     * @param path {string}
     * @param result {egret.Array<any>}
     * @platform Web
     */
    XML.findByPath = function (xml, path, result) {
        var index = path.indexOf(".");
        var key;
        var end;
        if (index == -1) {
            key = path;
            end = true;
        }
        else {
            key = path.substring(0, index);
            path = path.substring(index + 1);
            end = false;
        }
        var children = xml.children;
        if (!children) {
            return;
        }
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var child = children[i];
            if (child.localName == key) {
                if (end) {
                    result.push(child);
                }
                else {
                    XML.findByPath(child, path, result);
                }
            }
        }
    };
    /**
     * 获取一个XML节点上的所有属性名列表
     * @method egret.XML.getAttributes
     * @param xml {any} 要查找的XML节点。
     * @param result {egret.Array<any>} 可选参数，传入一个数组用于存储查找的结果。这样做能避免重复创建对象。
     * @returns {string} 节点上的所有属性名列表
     * @platform Web
     */
    XML.getAttributes = function (xml, result) {
        if (!result) {
            result = [];
        }
        else {
            result.length = 0;
        }
        for (var key in xml) {
            if (key.charAt(0) == "$") {
                result.push(key.substring(1));
            }
        }
        return result;
    };
    return XML;
})();
/**
 * Created by Yuxin on 2016/3/11.
 */
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Point;
})();
var DBTransform = (function () {
    function DBTransform() {
    }
    return DBTransform;
})();
var Matrix = (function () {
    function Matrix() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
    }
    Matrix.prototype.invert = function () {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1 * d1 - b1 * c1;
        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = (c1 * this.ty - d1 * tx1) / n;
        this.ty = -(a1 * this.ty - b1 * tx1) / n;
    };
    Matrix.prototype.concat = function (m) {
        var ma = m["a"];
        var mb = m["b"];
        var mc = m["c"];
        var md = m["d"];
        var tx1 = this.tx;
        var ty1 = this.ty;
        if (ma != 1 || mb != 0 || mc != 0 || md != 1) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            this.a = a1 * ma + b1 * mc;
            this.b = a1 * mb + b1 * md;
            this.c = c1 * ma + d1 * mc;
            this.d = c1 * mb + d1 * md;
        }
        this.tx = tx1 * ma + ty1 * mc + m["tx"];
        this.ty = tx1 * mb + ty1 * md + m["ty"];
    };
    Matrix.prototype.concatss = function (other) {
        var a = this.a * other.a;
        var b = 0.0;
        var c = 0.0;
        var d = this.d * other.d;
        var tx = this.tx * other.a + other.tx;
        var ty = this.ty * other.d + other.ty;
        if (this.b !== 0.0 || this.c !== 0.0 || other.b !== 0.0 || other.c !== 0.0) {
            a += this.b * other.c;
            d += this.c * other.b;
            b += this.a * other.b + this.b * other.d;
            c += this.c * other.a + this.d * other.c;
            tx += this.ty * other.c;
            ty += this.tx * other.b;
        }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    };
    Matrix.prototype.copyFrom = function (m) {
        this.tx = m.tx;
        this.ty = m.ty;
        this.a = m.a;
        this.b = m.b;
        this.c = m.c;
        this.d = m.d;
    };
    Matrix.prototype.transformPoint = function (pointX, pointY) {
        var x = this.a * pointX + this.c * pointY + this.tx;
        var y = this.b * pointX + this.d * pointY + this.ty;
        return new Point(x, y);
    };
    return Matrix;
})();


