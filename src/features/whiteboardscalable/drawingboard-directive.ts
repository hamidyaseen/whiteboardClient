
namespace vw.features.scalablewhiteboard {
    
    interface IBoleanCallback {
        (): boolean;
    }

    class DrawingBoard implements IBoardDirective {
        public restrict: string = "A";
        public require: string = "^^whiteBoard";
        public transclude: boolean = true;
        public scope: any = {};
                
            // private implementations        
        private scaleFactor: number = 1.0
        private _connectionState: number = 4;
        private _drawingState: boolean = false;
                    
        private activeTool: IDrawingToolScope = null;
        private _onInputStart = null;
        private _onInputMove = null;
        private _onInputStop = null;
        private _onMouseOver = null;
        private _getInputCoords = null;
        private enableDrawing: IBoleanCallback = null;
        private disableDrawing: IBoleanCallback = null;

        constructor() { }
        private x: number = 12;
        private y: number = 1080-12;
        private clientStateColor(no: number): string {
            switch (no) {
            case 0:
            case 2:
                return 'orange';
            case 1:
                return 'green';
            case 4:
            default:
                return 'red';
            }
        }
        public link(bScope: IStatusBoardScope, element: ng.IAugmentedJQuery, attribs: ng.IAttributes, wbCtrl: IWhiteboardController): void
        {
            console.log('Drawingboard starting up.');
            element.css({
                border: '1px solid rgb(128,128,128)',
                position: 'absolute',
                'z-index': '20'
            });

            bScope.getBaseCanvasElement = (): HTMLCanvasElement => { return <HTMLCanvasElement>element.get(0); }
            bScope.setBoardPosition = (lp: number, tp: number): void => {
                element.css({ left: lp + 'px', top: tp + 'px' });
            }
            bScope.setScaleFactor = (sf: number): boolean => {
                if (sf >= 0) {                   
                    this.scaleFactor = sf / 120;
                    element.width(sf * 16 -2).height(sf * 9 -2);
                    return true;
                }
                return false;
            }
            bScope.setConnectionServiceStatus = (sNo: number): void => {
                this._connectionState = sNo;
                bScope.visualizeConnectionServiceStatus();
            }
            bScope.visualizeConnectionServiceStatus = (): void => {
                var minBoard: HTMLCanvasElement = <HTMLCanvasElement>element.get(0);
                if (minBoard && minBoard.getContext) {
                    var minCTX: CanvasRenderingContext2D = <CanvasRenderingContext2D>minBoard.getContext('2d');
                    if (minCTX) {
                        let c = minCTX.strokeStyle;
                        let lw = minCTX.lineWidth;
                        let co = minCTX.globalCompositeOperation;

                        minCTX.strokeStyle = this.clientStateColor(this._connectionState);
                        minCTX.lineWidth = 15;
                        minCTX.globalCompositeOperation = 'source-over';

                        minCTX.beginPath();
                        minCTX.arc(this.x, this.y, 10, 0, 2 * Math.PI, false);
                        minCTX.fillStyle = this.clientStateColor(this._connectionState);
                        minCTX.fill();

                        minCTX.strokeStyle = c;
                        minCTX.lineWidth = lw;
                        minCTX.globalCompositeOperation = co;
                    }
                }
            }
            

                // As input to canvas starts , get active tool and pass to active tool,
                // to  process according to tool definition
            
            this._onInputStart = (e): void => {
                let coords: IPoint = this._getInputCoords(e);
                if (wbCtrl && wbCtrl.getActiveTool) { //getActiveToolMedInit) {
                    this.activeTool = wbCtrl.getActiveTool(); //MedInit();
                    if (this.activeTool)
                        this.activeTool.inputStart(coords);
                }

                //this.currentPoint = this.oldPoint = coords;
                //this.oldMidPoint = this._getMidInputCoords(coords);
                //this.isDrawing = true;

                //if (!window.requestAnimationFrame) this.draw();
                //this.ev.trigger('board:startDrawing', { e: e, coords: coords });
                e.stopPropagation();
                e.preventDefault();
            }
            this._onInputMove = (e): void => {
                //HYA01 , need to bring this tjek in.. 
                //   if (drawingService.isDrawing()) {
                let inputMovePoint: IPoint = this._getInputCoords(e);

                if (this.activeTool)
                    this.activeTool.inputMove(inputMovePoint);

                //this.currentPoint = inputMovePoint; // coords;
                //this.ev.trigger('board:drawing', {e: e, coords: coords});

                //if (!window.requestAnimationFrame) this.draw();
                //    }
                e.stopPropagation();
                e.preventDefault();
            }
            this._onInputStop = (e): void => {

                var coords: IPoint = this._getInputCoords(e);
                //if (this.isDrawing && (!e.touches || e.touches.length === 0)) {
                //    this.isDrawing = false;

                //  if (drawingService.isDrawing()/* && (!e.touches || e.touches.length === 0)*/) {
                // still want to stop drawing if the any one of multiple touches up...
                // console.log('stop Input....');

                if (this.activeTool)
                    this.activeTool.inputStop(coords);

                //this.ev.trigger('board:stopDrawing', {e: e, coords: coords});
                //this.ev.trigger('board:userAction');
                e.stopPropagation();
                e.preventDefault();
                // I need to think , when to OFF this mouse/touch events...
                //////element.off('touchmove mousemove', _onInputMove.bind(this));
                ////////element.off('touchend', _onInputStop.bind(this));
                //////this.$doc.off('touchend mouseup', _onInputStop.bind(this));
                //  }
            }
            this._onMouseOver = (e): void => {
                let overPoint: IPoint = this._getInputCoords(e);
                if (wbCtrl && wbCtrl.getActiveTool) {
                    // if it is in drawing process then hover
                    this.activeTool = wbCtrl.getActiveTool();
                    if (this.activeTool)
                        this.activeTool.inputRestore(overPoint);
                }
                //this.oldPoint = overPoint; //this._getInputCoords(e);
                //this.oldMidPoint = this._getMidInputCoords(this.oldPoint);
            }
            this._getInputCoords = (e): vw.features.scalablewhiteboard.IPoint => {
                e = e.originalEvent ? e.originalEvent : e;
                //var rect = this.canvas.getBoundingClientRect(),   width = this.dom.$canvas.width(),   height = this.dom.$canvas.height();

                var x, y;
                if (e.touches && e.touches.length == 1) {
                    x = e.touches[0].pageX;
                    y = e.touches[0].pageY;
                } else {
                    x = e.pageX;
                    y = e.pageY;
                }
                x = x - element.offset().left;
                y = y - element.offset().top;
                //x = x - this.dom.$canvas.offset().left;
                //y = y - this.dom.$canvas.offset().top;
                //x *= (width / rect.width);
                //y *= (height / rect.height);
                x /= this.scaleFactor;
                y /= this.scaleFactor;
                return <IPoint>{ px: x, py: y };
            }
            this.enableDrawing = (): boolean => {
                if (this._drawingState == false) {
                    this._drawingState = true;
                    element.on('touchstart mousedown', (e) => { this._onInputStart(e); });
                    element.on('touchmove mousemove', (e) => { this._onInputMove(e); });
                    //this.$doc.on('touchend mouseup', (e) => { _onInputStop(e); });
                    element.on('touchend mouseup', (e) => { this._onInputStop(e); });
                    element.on('mouseover', (e) => { this._onMouseOver(e); });
                    element.on('mouseleave', (e) => {
                        (<vw.features.scalablewhiteboard.IWhiteboardScope>bScope.$parent).stopDrawingAction();
                    });
                    return true;
                }
                return false;
            }
            this.disableDrawing = (): boolean => {
                if (this._drawingState) {
                    element.off('touchstart mousedown');
                    element.off('touchmove mousemove');
                    //this.$doc.off('touchend mouseup', () => {});
                    element.off('touchend mouseup');
                    element.off('mouseover');
                    element.off('mouseleave');
                    this._drawingState = false;
                    return true;
                }
                return false;
            }

            wbCtrl.registerDrawingBoard(bScope) ? this.enableDrawing() : this.disableDrawing();
        }

        // private interface
        public static Factory(): any {
            let directive = (): IBoardDirective => {
                return new DrawingBoard();
            }
            directive.$inject = [];
            return directive;
        }
    }

    angular.module('vw').directive('drawingBoard', DrawingBoard.Factory());
}