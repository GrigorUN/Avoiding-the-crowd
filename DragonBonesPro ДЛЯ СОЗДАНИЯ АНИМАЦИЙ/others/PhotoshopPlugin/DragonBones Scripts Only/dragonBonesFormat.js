"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PI_D = Math.PI * 2;
exports.PI_H = Math.PI / 2;
exports.PI_Q = Math.PI / 4;
exports.RAD_DEG = 180 / Math.PI;
exports.DEG_RAD = Math.PI / 180;
function normalizeDegree(value) {
    value = (value + Math.PI) % (Math.PI * 2.0);
    value += value > 0.0 ? -Math.PI : Math.PI;
    return value;
}
exports.normalizeDegree = normalizeDegree;
function normalizeRadian(value) {
    value = (value + 180.0) % (180.0 * 2.0);
    value += value > 0.0 ? -180.0 : 180.0;
    return value;
}
exports.normalizeRadian = normalizeRadian;
var Matrix = (function () {
    function Matrix(a, b, c, d, tx, ty) {
        if (a === void 0) { a = 1.0; }
        if (b === void 0) { b = 0.0; }
        if (c === void 0) { c = 0.0; }
        if (d === void 0) { d = 1.0; }
        if (tx === void 0) { tx = 0.0; }
        if (ty === void 0) { ty = 0.0; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    /**
     * @language zh_CN
     * 复制矩阵。
     * @param value 需要复制的矩阵。
     * @version DragonBones 3.0
     */
    Matrix.prototype.copyFrom = function (value) {
        this.a = value.a;
        this.b = value.b;
        this.c = value.c;
        this.d = value.d;
        this.tx = value.tx;
        this.ty = value.ty;
        return this;
    };
    Matrix.prototype.copyFromArray = function (value, offset) {
        if (offset === void 0) { offset = 0; }
        this.a = value[offset];
        this.b = value[offset + 1];
        this.c = value[offset + 2];
        this.d = value[offset + 3];
        this.tx = value[offset + 4];
        this.ty = value[offset + 5];
        return this;
    };
    /**
     * @language zh_CN
     * 转换为恒等矩阵。
     * @version DragonBones 3.0
     */
    Matrix.prototype.identity = function () {
        this.a = this.d = 1.0;
        this.b = this.c = 0.0;
        this.tx = this.ty = 0.0;
        return this;
    };
    /**
     * @language zh_CN
     * 将当前矩阵与另一个矩阵相乘。
     * @param value 需要相乘的矩阵。
     * @version DragonBones 3.0
     */
    Matrix.prototype.concat = function (value) {
        var a = this.a * value.a;
        var b = 0.0;
        var c = 0.0;
        var d = this.d * value.d;
        var tx = this.tx * value.a + value.tx;
        var ty = this.ty * value.d + value.ty;
        if (this.b !== 0.0 || this.c !== 0.0) {
            a += this.b * value.c;
            d += this.c * value.b;
            b += this.b * value.d;
            c += this.c * value.a;
        }
        if (value.b !== 0.0 || value.c !== 0.0) {
            b += this.a * value.b;
            c += this.d * value.c;
            tx += this.ty * value.c;
            ty += this.tx * value.b;
        }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    };
    /**
     * @language zh_CN
     * 转换为逆矩阵。
     * @version DragonBones 3.0
     */
    Matrix.prototype.invert = function () {
        var aA = this.a;
        var bA = this.b;
        var cA = this.c;
        var dA = this.d;
        var txA = this.tx;
        var tyA = this.ty;
        var n = aA * dA - bA * cA;
        this.a = dA / n;
        this.b = -bA / n;
        this.c = -cA / n;
        this.d = aA / n;
        this.tx = (cA * tyA - dA * txA) / n;
        this.ty = -(aA * tyA - bA * txA) / n;
        return this;
    };
    /**
     * @language zh_CN
     * 将矩阵转换应用于指定点。
     * @param x 横坐标。
     * @param y 纵坐标。
     * @param result 应用转换之后的坐标。
     * @params delta 是否忽略 tx，ty 对坐标的转换。
     * @version DragonBones 3.0
     */
    Matrix.prototype.transformPoint = function (x, y, result, delta) {
        if (delta === void 0) { delta = false; }
        result.x = this.a * x + this.c * y;
        result.y = this.b * x + this.d * y;
        if (!delta) {
            result.x += this.tx;
            result.y += this.ty;
        }
    };
    return Matrix;
}());
exports.Matrix = Matrix;
var ArmatureType;
(function (ArmatureType) {
    ArmatureType[ArmatureType["None"] = -1] = "None";
    ArmatureType[ArmatureType["Armature"] = 0] = "Armature";
    ArmatureType[ArmatureType["MovieClip"] = 1] = "MovieClip";
    ArmatureType[ArmatureType["Stage"] = 2] = "Stage";
})(ArmatureType = exports.ArmatureType || (exports.ArmatureType = {}));
var DisplayType;
(function (DisplayType) {
    DisplayType[DisplayType["None"] = -1] = "None";
    DisplayType[DisplayType["Image"] = 0] = "Image";
    DisplayType[DisplayType["Armature"] = 1] = "Armature";
    DisplayType[DisplayType["Mesh"] = 2] = "Mesh";
    DisplayType[DisplayType["BoundingBox"] = 3] = "BoundingBox";
})(DisplayType = exports.DisplayType || (exports.DisplayType = {}));
var BoundingBoxType;
(function (BoundingBoxType) {
    BoundingBoxType[BoundingBoxType["None"] = -1] = "None";
    BoundingBoxType[BoundingBoxType["Rectangle"] = 0] = "Rectangle";
    BoundingBoxType[BoundingBoxType["Ellipse"] = 1] = "Ellipse";
    BoundingBoxType[BoundingBoxType["Polygon"] = 2] = "Polygon";
})(BoundingBoxType = exports.BoundingBoxType || (exports.BoundingBoxType = {}));
var BlendModeType;
(function (BlendModeType) {
    BlendModeType[BlendModeType["None"] = -1] = "None";
    BlendModeType[BlendModeType["Normal"] = 0] = "Normal";
    BlendModeType[BlendModeType["Add"] = 1] = "Add";
    BlendModeType[BlendModeType["Alpha"] = 2] = "Alpha";
    BlendModeType[BlendModeType["Darker"] = 3] = "Darker";
    BlendModeType[BlendModeType["Difference"] = 4] = "Difference";
    BlendModeType[BlendModeType["Erase"] = 5] = "Erase";
    BlendModeType[BlendModeType["HardLight"] = 6] = "HardLight";
    BlendModeType[BlendModeType["Invert"] = 7] = "Invert";
    BlendModeType[BlendModeType["Layer"] = 8] = "Layer";
    BlendModeType[BlendModeType["Lighten"] = 9] = "Lighten";
    BlendModeType[BlendModeType["Mulpitly"] = 10] = "Mulpitly";
    BlendModeType[BlendModeType["Overlay"] = 11] = "Overlay";
    BlendModeType[BlendModeType["Screen"] = 12] = "Screen";
    BlendModeType[BlendModeType["Subtruct"] = 13] = "Subtruct";
})(BlendModeType = exports.BlendModeType || (exports.BlendModeType = {}));
var ExtensionType;
(function (ExtensionType) {
    ExtensionType[ExtensionType["None"] = -1] = "None";
    ExtensionType[ExtensionType["FFD"] = 0] = "FFD";
    ExtensionType[ExtensionType["AdjustColorFilter"] = 10] = "AdjustColorFilter";
    ExtensionType[ExtensionType["BevelFilter"] = 11] = "BevelFilter";
    ExtensionType[ExtensionType["BlurFilter"] = 12] = "BlurFilter";
    ExtensionType[ExtensionType["DropShadowFilter"] = 13] = "DropShadowFilter";
    ExtensionType[ExtensionType["GlowFilter"] = 14] = "GlowFilter";
    ExtensionType[ExtensionType["GradientBevelFilter"] = 15] = "GradientBevelFilter";
    ExtensionType[ExtensionType["GradientGlowFilter"] = 16] = "GradientGlowFilter";
})(ExtensionType = exports.ExtensionType || (exports.ExtensionType = {}));
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0.00; }
        if (y === void 0) { y = 0.00; }
        this.x = x;
        this.y = y;
    }
    return Point;
}());
exports.Point = Point;
var Rectangle = (function () {
    function Rectangle() {
        this.x = 0.00;
        this.y = 0.00;
        this.width = 0.00;
        this.height = 0.00;
    }
    return Rectangle;
}());
exports.Rectangle = Rectangle;
var Transform = (function () {
    function Transform() {
        this.x = 0.00;
        this.y = 0.00;
        this.skX = 0.00;
        this.skY = 0.00;
        this.scX = 1.0000;
        this.scY = 1.0000;
    }
    Transform.prototype.copyFrom = function (value) {
        this.x = value.x;
        this.y = value.y;
        this.skX = value.skX;
        this.skY = value.skY;
        this.scX = value.scX;
        this.scY = value.scY;
        return this;
    };
    Transform.prototype.add = function (value) {
        this.x += value.x;
        this.y += value.y;
        this.skX += value.skX;
        this.skY += value.skY;
        this.scX *= value.scX;
        this.scY *= value.scY;
        return this;
    };
    Transform.prototype.minus = function (value) {
        this.x -= value.x;
        this.y -= value.y;
        this.skX = normalizeDegree(this.skX - value.skX);
        this.skY = normalizeDegree(this.skY - value.skY);
        this.scX /= value.scX;
        this.scY /= value.scY;
        return this;
    };
    Transform.prototype.fromMatrix = function (matrix) {
        var backupScaleX = this.scX, backupScaleY = this.scY;
        this.x = matrix.tx;
        this.y = matrix.ty;
        this.skX = Math.atan(-matrix.c / matrix.d);
        this.skY = Math.atan(matrix.b / matrix.a);
        if (this.skX !== this.skX) {
            this.skX = 0.0;
        }
        if (this.skY !== this.skY) {
            this.skY = 0.0;
        }
        this.scY = (this.skX > -exports.PI_Q && this.skX < exports.PI_Q) ? matrix.d / Math.cos(this.skX) : -matrix.c / Math.sin(this.skX);
        this.scX = (this.skY > -exports.PI_Q && this.skY < exports.PI_Q) ? matrix.a / Math.cos(this.skY) : matrix.b / Math.sin(this.skY);
        if (backupScaleX >= 0.0 && this.scX < 0.0) {
            this.scX = -this.scX;
            this.skY = this.skY - Math.PI;
        }
        if (backupScaleY >= 0.0 && this.scY < 0.0) {
            this.scY = -this.scY;
            this.skX = this.skX - Math.PI;
        }
        return this;
    };
    Transform.prototype.toMatrix = function (matrix) {
        if (this.skX !== 0.0 || this.skY !== 0.0) {
            matrix.a = Math.cos(this.skY);
            matrix.b = Math.sin(this.skY);
            if (this.skX === this.skY) {
                matrix.c = -matrix.b;
                matrix.d = matrix.a;
            }
            else {
                matrix.c = -Math.sin(this.skX);
                matrix.d = Math.cos(this.skX);
            }
            if (this.scX !== 1.0 || this.scY !== 1.0) {
                matrix.a *= this.scX;
                matrix.b *= this.scX;
                matrix.c *= this.scY;
                matrix.d *= this.scY;
            }
        }
        else {
            matrix.a = this.scX;
            matrix.b = 0.0;
            matrix.c = 0.0;
            matrix.d = this.scY;
        }
        matrix.tx = this.x;
        matrix.ty = this.y;
        return this;
    };
    Transform.prototype.getRotation = function () {
        return this.skY;
    };
    Transform.prototype.setRotation = function (value) {
        var dValue = value - this.skY;
        this.skX += dValue;
        this.skY += dValue;
    };
    return Transform;
}());
exports.Transform = Transform;
var ColorTransform = (function () {
    function ColorTransform() {
        this.aM = 100;
        this.rM = 100;
        this.gM = 100;
        this.bM = 100;
        this.aO = 0;
        this.rO = 0;
        this.gO = 0;
        this.bO = 0;
    }
    return ColorTransform;
}());
exports.ColorTransform = ColorTransform;
var Bone = (function () {
    function Bone() {
        this.name = "";
        this.inheritTranslation = true;
        this.inheritRotation = true;
        this.inheritScale = true;
        this.length = 0;
        this.parent = "";
        this.transform = new Transform();
        this.userData = null;
    }
    return Bone;
}());
Bone.COPY_MAP = {
    transform: Transform
};
exports.Bone = Bone;
var Slot = (function () {
    function Slot() {
        this.name = "";
        this.blendMode = BlendModeType[BlendModeType.Normal].toLowerCase();
        this.displayIndex = 0;
        this.parent = "";
        this.color = new ColorTransform();
    }
    return Slot;
}());
Slot.COPY_MAP = {
    color: ColorTransform
};
exports.Slot = Slot;
var Display = (function () {
    function Display() {
        this.name = "";
        this.type = DisplayType[DisplayType.Image].toLowerCase();
        this.inheritAnimation = true;
        this.path = "";
        this.share = "";
        this.subType = null;
        this.color = 0x000000;
        this.transform = new Transform();
        this.pivot = new Point(0.5, 0.5);
        this.width = 0;
        this.height = 0;
        this.vertices = [];
        this.uvs = [];
        this.triangles = [];
        this.weights = [];
        this.slotPose = [];
        this.bonePose = [];
    }
    return Display;
}());
Display.COPY_MAP = {
    transform: Transform,
    pivot: Point
};
exports.Display = Display;
var SkinSlot = (function () {
    function SkinSlot() {
        this.name = "";
        this.display = [];
    }
    return SkinSlot;
}());
SkinSlot.COPY_MAP = {
    display: Display
};
exports.SkinSlot = SkinSlot;
var Skin = (function () {
    function Skin() {
        this.name = "";
        this.slot = [];
    }
    return Skin;
}());
Skin.COPY_MAP = {
    slot: SkinSlot
};
exports.Skin = Skin;
var IKConstraint = (function () {
    function IKConstraint() {
        this.name = "";
        this.bone = "";
        this.target = "";
        this.bendPositive = true;
        this.chain = 0;
        this.weight = 1.00;
    }
    return IKConstraint;
}());
exports.IKConstraint = IKConstraint;
var Frame = (function () {
    function Frame() {
        this.duration = 1;
    }
    return Frame;
}());
var TweenFrame = (function (_super) {
    __extends(TweenFrame, _super);
    function TweenFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tweenEasing = "";
        _this.curve = [];
        return _this;
    }
    return TweenFrame;
}(Frame));
var Timeline = (function () {
    function Timeline() {
        this.name = "";
        this.scale = 1;
        this.offset = 0;
        this.frame = [];
    }
    return Timeline;
}());
var AnimationFrame = (function (_super) {
    __extends(AnimationFrame, _super);
    function AnimationFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sound = "";
        _this.event = "";
        return _this;
    }
    return AnimationFrame;
}(Frame));
exports.AnimationFrame = AnimationFrame;
var ZOrderFrame = (function (_super) {
    __extends(ZOrderFrame, _super);
    function ZOrderFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.zOrder = [];
        return _this;
    }
    return ZOrderFrame;
}(Frame));
exports.ZOrderFrame = ZOrderFrame;
var BoneFrame = (function (_super) {
    __extends(BoneFrame, _super);
    function BoneFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tweenScale = true;
        _this.tweenRotate = 0;
        _this.transform = new Transform();
        _this.sound = "";
        _this.event = "";
        _this.data = "";
        _this._global = new Transform();
        return _this;
    }
    return BoneFrame;
}(TweenFrame));
BoneFrame.COPY_MAP = {
    transform: Transform
};
exports.BoneFrame = BoneFrame;
var SlotFrame = (function (_super) {
    __extends(SlotFrame, _super);
    function SlotFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayIndex = 0;
        _this.color = new ColorTransform();
        return _this;
    }
    return SlotFrame;
}(TweenFrame));
SlotFrame.COPY_MAP = {
    color: ColorTransform
};
exports.SlotFrame = SlotFrame;
var FFDFrame = (function (_super) {
    __extends(FFDFrame, _super);
    function FFDFrame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.offset = 0;
        _this.vertices = [];
        return _this;
    }
    return FFDFrame;
}(TweenFrame));
exports.FFDFrame = FFDFrame;
var ZOrderTimeline = (function (_super) {
    __extends(ZOrderTimeline, _super);
    function ZOrderTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ZOrderTimeline;
}(Timeline));
ZOrderTimeline.COPY_MAP = {
    frame: ZOrderFrame
};
exports.ZOrderTimeline = ZOrderTimeline;
var BoneTimeline = (function (_super) {
    __extends(BoneTimeline, _super);
    function BoneTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BoneTimeline;
}(Timeline));
BoneTimeline.COPY_MAP = {
    frame: BoneFrame
};
exports.BoneTimeline = BoneTimeline;
var SlotTimeline = (function (_super) {
    __extends(SlotTimeline, _super);
    function SlotTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SlotTimeline;
}(Timeline));
SlotTimeline.COPY_MAP = {
    frame: SlotFrame
};
exports.SlotTimeline = SlotTimeline;
var FFDTimeline = (function (_super) {
    __extends(FFDTimeline, _super);
    function FFDTimeline() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.skin = "";
        _this.slot = "";
        return _this;
    }
    return FFDTimeline;
}(Timeline));
FFDTimeline.COPY_MAP = {
    frame: FFDFrame
};
exports.FFDTimeline = FFDTimeline;
var Animation = (function (_super) {
    __extends(Animation, _super);
    function Animation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.duration = 0;
        _this.fadeInTime = 0.000;
        _this.playTimes = 1;
        _this.zOrder = new ZOrderTimeline();
        _this.bone = [];
        _this.slot = [];
        _this.ffd = [];
        return _this;
    }
    return Animation;
}(Timeline));
Animation.COPY_MAP = {
    zOrder: ZOrderTimeline,
    bone: BoneTimeline,
    slot: SlotTimeline,
    ffd: FFDTimeline,
    frame: AnimationFrame
};
exports.Animation = Animation;
var Armature = (function () {
    function Armature() {
        this.name = "";
        this.type = ArmatureType[ArmatureType.Armature]; // ArmatureType[ArmatureType.Armature].toLowerCase();
        this.frameRate = 24;
        this.aabb = new Rectangle();
        this.bone = [];
        this.slot = [];
        this.skin = [];
        this.ik = [];
        this.animation = [];
        this.userData = null;
    }
    return Armature;
}());
Armature.COPY_MAP = {
    bone: Bone,
    slot: Slot,
    skin: Skin,
    ik: IKConstraint,
    animation: Animation,
};
exports.Armature = Armature;
var DragonBones = (function () {
    function DragonBones() {
        this.name = "";
        this.frameRate = 24;
        this.version = "";
        this.compatibleVersion = "";
        this.armature = [];
        this.userData = null;
    }
    return DragonBones;
}());
DragonBones.COPY_MAP = {
    armature: Armature
};
exports.DragonBones = DragonBones;
var Texture = (function (_super) {
    __extends(Texture, _super);
    function Texture() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotated = false;
        return _this;
    }
    return Texture;
}(Rectangle));
exports.Texture = Texture;
var TextureAtlas = (function () {
    function TextureAtlas() {
        this.name = "";
        this.scale = 1.00;
        this.width = 0;
        this.height = 0;
        this.imagePath = "";
        this.SubTexture = [];
    }
    return TextureAtlas;
}());
TextureAtlas.COPY_MAP = {
    SubTexture: Texture,
};
exports.TextureAtlas = TextureAtlas;
exports.defaults = [
    new Point(),
    new Rectangle(),
    new Transform(),
    new ColorTransform(),
    new Bone(),
    new Slot(),
    new Display(),
    new SkinSlot(),
    new Skin(),
    new IKConstraint(),
    new AnimationFrame(),
    new ZOrderFrame(),
    new BoneFrame(),
    new SlotFrame(),
    new FFDFrame(),
    new ZOrderTimeline(),
    new BoneTimeline(),
    new SlotTimeline(),
    new FFDTimeline(),
    new Animation(),
    new Armature(),
    new DragonBones(),
    new Texture(),
    new TextureAtlas(),
];
function compress(data, defaults) {
    if (defaults === void 0) { defaults = null; }
    if ((typeof data) !== "object") {
        return false;
    }
    if (data instanceof Array) {
        var array = data;
        var i = array.length;
        while (i--) {
            if (compress(array[i], defaults)) {
                //array.splice(i, 1); TODO
            }
        }
        if (array.length === 0) {
            return true;
        }
    }
    else {
        var defaultData = null;
        if (defaults) {
            for (var i = 0, l = defaults.length; i < l; ++i) {
                defaultData = defaults[i];
                if (data.constructor === defaultData.constructor) {
                    break;
                }
            }
        }
        if (defaultData) {
            var count = 0;
            for (var key in data) {
                if (key.charAt(0) === "_") {
                    delete data[key];
                    continue;
                }
                var value = data[key];
                var valueType = typeof value;
                if (value === null || valueType === "undefined" || valueType === "boolean" || valueType === "number" || valueType === "string") {
                    var defaultValue = defaultData[key];
                    if (value === defaultValue) {
                        delete data[key];
                        continue;
                    }
                }
                else if (valueType === "object") {
                    if (compress(value, defaults)) {
                        delete data[key];
                        continue;
                    }
                }
                else {
                    continue;
                }
                count++;
            }
            return count === 0;
        }
        else if (defaults) {
            //console.warn(data);
        }
    }
    return false;
}
exports.compress = compress;
function copyFromObject(data, object) {
    var map = data.constructor["COPY_MAP"]; //
    for (var key in data) {
        if (key != "constructor" && key in object) {
            var objectValue = object[key];
            var type = typeof objectValue;
            if (type != "object") {
                data[key] = objectValue;
            }
            else if (objectValue instanceof Array) {
                var dataValue = data[key];
                for (var i = 0, l = objectValue.length; i < l; ++i) {
                    var subValue = objectValue[i];
                    var subType = typeof subValue;
                    if (subType != "object") {
                        dataValue[i] = subValue;
                    }
                    else {
                        dataValue[i] = _copyFromObject(key, subValue, map);
                    }
                }
            }
            else {
                var dataValue = this[key];
                if (dataValue) {
                    copyFromObject(dataValue, objectValue);
                }
                else {
                    this[key] = _copyFromObject(key, objectValue, map);
                }
            }
        }
    }
}
exports.copyFromObject = copyFromObject;
function _copyFromObject(key, object, map) {
    var objectClass = map[key];
    if (objectClass) {
        var value = new objectClass();
        copyFromObject(value, object);
        return value;
    }
    return null;
}
