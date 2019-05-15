"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AppComponent = /** @class */ (function () {
    function AppComponent(authService) {
        this.authService = authService;
    }
    AppComponent.prototype.signup = function () {
        this.authService.signup(this.email, this.password);
        this.email = this.password = '';
    };
    AppComponent.prototype.login = function () {
        this.authService.login(this.email, this.password);
        this.email = this.password = '';
    };
    AppComponent.prototype.logout = function () {
        this.authService.logout();
    };
    AppComponent = __decorate([
        core_1.Component(__assign({}, ))
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
