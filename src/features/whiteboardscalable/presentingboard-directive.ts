
namespace vw.features.scalablewhiteboard {

    class PresentingBoard implements IBoardDirective {
        public restrict: string = "A";
        public require: string = "^^whiteBoard";
        public transclude: boolean = true;
        public scope: any = {};
        
        private scaleFactor: number = 1.0;
        constructor() {            
        }

        public link(bScope: IBoardScope, element: ng.IAugmentedJQuery, attribs: ng.IAttributes, wbCtrl: IWhiteboardController): void
        {
            console.log('Presentingboard is starting up');
            element.css({
                border: '1px solid rgb(128,128,128)',
                position: 'absolute',
                'z-index': '19'
            });

            bScope.getBaseCanvasElement = (): HTMLCanvasElement => { return <HTMLCanvasElement>element.get(0); }
            bScope.setBoardPosition = (lp: number, tp: number): void => {
                element.css({ left: lp + 'px', top: tp + 'px' });
            }
            bScope.setScaleFactor = (sf: number): boolean => {
                if (sf >= 0) {
                    this.scaleFactor = sf/120;
                    element.width(sf * 16 -2 ).height(sf * 9 -2);
                    return true;
                }
                return false;
            }

            let ret = wbCtrl.registerPresentingBoard(bScope);
        }

        public static Factory(): any {
            let directive = (): IBoardDirective => {
                return new PresentingBoard();
            }
            directive.$inject = [];
            return directive;
        }
    }

    angular.module('vw').directive('presentBoard', PresentingBoard.Factory());
}