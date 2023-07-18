"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../src");
const Photo_1 = require("./Photo");
let User = class User {
};
tslib_1.__decorate([
    (0, src_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "id", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "name", void 0);
tslib_1.__decorate([
    (0, src_1.Column)("decimal", { precision: 9, scale: 6 }),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "height", void 0);
tslib_1.__decorate([
    (0, src_1.OneToMany)((_type) => Photo_1.Photo, (type) => type.user, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "photos", void 0);
User = tslib_1.__decorate([
    (0, src_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map