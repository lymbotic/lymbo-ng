"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var ToolbarComponent = (function () {
    function ToolbarComponent() {
        var _this = this;
        this.onSearchItemChanged = new core_1.EventEmitter();
        this.onMenuItemClicked = new core_1.EventEmitter();
        this.debouncer = new rxjs_1.Subject();
        this.searchItem = "";
        this.state = "active";
        this.devMode = core_1.isDevMode();
        this.debouncer
            .debounceTime(500)
            .subscribe(function (value) { return _this.onSearchItemChanged.emit(value.toString()); });
    }
    ToolbarComponent.prototype.changeState = function (active, screenWidth) {
        this.state = active ? "active" : (screenWidth > 1200) ? "inactive" : "inactive-small";
    };
    ToolbarComponent.prototype.changeSearchItem = function (searchItem) {
        this.debouncer.next(searchItem);
    };
    ToolbarComponent.prototype.clickMenuItem = function (menuItem) {
        this.onMenuItemClicked.emit(menuItem);
    };
    __decorate([
        core_1.Input()
    ], ToolbarComponent.prototype, "title", void 0);
    __decorate([
        core_1.Output()
    ], ToolbarComponent.prototype, "onSearchItemChanged", void 0);
    __decorate([
        core_1.Output()
    ], ToolbarComponent.prototype, "onMenuItemClicked", void 0);
    ToolbarComponent = __decorate([
        core_1.Component({
            selector: 'app-toolbar',
            templateUrl: './toolbar.component.html',
            styles: [require('./toolbar.component.scss')]
        })
    ], ToolbarComponent);
    return ToolbarComponent;
}());
exports.ToolbarComponent = ToolbarComponent;
