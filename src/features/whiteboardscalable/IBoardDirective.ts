
namespace vw.features.scalablewhiteboard {

    export interface IBoardScope extends ng.IScope {        
        getBaseCanvasElement(): HTMLCanvasElement;
        setScaleFactor(sf: number): boolean;
        setBoardPosition(lp: number, tp: number): void;
    }

    export interface IStatusBoardScope extends IBoardScope {
        setConnectionServiceStatus(sNo: number): void;
        visualizeConnectionServiceStatus(): void;
    }

    export interface IBoardDirective {
        restrict: string;
        require: string;
        transclude: boolean;
        scope: any;
        //template: string;
        link(bScope: IBoardScope, element: ng.IAugmentedJQuery, attribs: any, wbCtrl: IWhiteboardController): void;
    }
}