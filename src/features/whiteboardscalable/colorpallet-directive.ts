namespace vw.features.scalablewhiteboard {

    export interface IColorPalletDirective {
        restrict: string;
        transclude: boolean;
        templateUrl: string;
        require: string;        
        //scope: any;
        link(cpScope: ng.IScope, element: ng.IAugmentedJQuery, attribs: ng.IAttributes, wbCtrl: any): void;
    }

    class CollarPallet implements IColorPalletDirective {
        public restrict: string = "E";
        public transclude: boolean = true;
        public templateUrl: string = 'features/whiteboardscalable/colorpallet.html'; 
        public require: string = '^^whiteBoard';
        //public scope: any = {};
        constructor() {
        }

        public link(cpScope: ng.IScope, element: ng.IAugmentedJQuery, attribs: ng.IAttributes, wbCtrl: any): void {
            console.log('Starting up colorpallet');
        }

        public static Factory(): any {
            let directive = (): IColorPalletDirective => {
                return new CollarPallet();
            }
            directive.$inject = [];
            return directive;
        }
    }

    angular.module('vw').directive('colorPallet', CollarPallet.Factory());
}