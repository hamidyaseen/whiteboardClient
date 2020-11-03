
namespace vw.features.scalablewhiteboard {

    export interface IWhiteboardRegisterableDirective {
        restrict: string;
        transclude: boolean;
        templateUrl: string;
        require: string;
        scope: any;

        link(toolScope: any, element: ng.IAugmentedJQuery, attribs: ng.IAttributes, wbCtrl: ng.IController): void;
    }
}