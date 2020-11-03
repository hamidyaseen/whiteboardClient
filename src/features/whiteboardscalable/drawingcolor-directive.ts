
namespace vw.features.scalablewhiteboard {

    export interface IColorBase {        
        inColor: string;        
        inTitle?: string;
    }
    export interface IVisualColorBase extends IColorBase {
        ActiveLook: string;
        PassiveLook: string;
    }
    export interface ISelectableColor extends IVisualColorBase {
        inSelectable: string;
        isSelectable(): boolean;        
    }

    export interface IDrawingColorScope extends ng.IScope, ISelectableColor {
        //activated: boolean;
        isActivated(): boolean;
        activateColor(): boolean;
        deActivateColor(): void;     
    }

    interface IDrawingColorDirective {
        restrict: string;
        transclude: boolean;
        templateUrl: string;
        require: string;
        scope: any;

        link(colorScope: IDrawingColorScope, element: ng.IAugmentedJQuery, attribs: ng.IAttributes, wbCtrl: ng.IController): void;
    }

    class DrawingColor implements IDrawingColorDirective {
        public restrict: string = 'E';
        public transclude: boolean = true;
        public templateUrl: string = 'features/whiteboardscalable/drawingcolor.html';
        public require: string = '^^whiteBoard';
        public scope: any = {
            inColor: '@colorname',
            inSelectable: '@selectable',
            inTitle: '@title',
            ActiveLook: '@activeLook',
            PassiveLook: '@passiveLook'
        };
        
        constructor() { }

        public link(colorScope: IDrawingColorScope, element: ng.IAugmentedJQuery, attribs: ng.IAttributes, wbCtrl: IWhiteboardController): void
        {
            //this._activated = false;
            var _activated: boolean = false;
            colorScope.isActivated = (): boolean => {
                return _activated;
            };
            colorScope.activateColor = (): boolean => {
                return _activated = true;                
            }
            colorScope.deActivateColor = (): void => {
                _activated = false;
            }    
            colorScope.isSelectable = (): boolean => {
                return (colorScope.inSelectable === "");
            }
            (<IWhiteboardController>wbCtrl).registerDrawingColor(colorScope);
        }

        public static Factory(): any {
            let directive = (): IWhiteboardRegisterableDirective => {
                return new DrawingColor();
            }
            directive.$inject = [];
            return directive;

        }
    }
    angular.module('vw').directive('drawingColor', DrawingColor.Factory());
}