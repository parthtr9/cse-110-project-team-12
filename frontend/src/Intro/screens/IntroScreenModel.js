"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntroScreenModel = void 0;
var IntroScreenModel = /** @class */ (function () {
    function IntroScreenModel() {
        this.state = 0;
    }
    IntroScreenModel.prototype.getState = function () {
        return this.state;
    };
    IntroScreenModel.prototype.setState = function (num) {
        this.state = num;
    };
    return IntroScreenModel;
}());
exports.IntroScreenModel = IntroScreenModel;
