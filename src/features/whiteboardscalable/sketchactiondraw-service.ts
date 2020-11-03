namespace vw.features.scalablewhiteboard {
    export interface ISketchActionReciever {
        (sa: SketchAction): void; //, isLocal: boolean
    }

    export interface IPointDrawingService extends IInitializeDrawService {
        inputStart(p: IPoint, toolName: string): void;
        completeInputDrawing(aPoint?: IPoint): boolean;
        inputMove(p: IPoint): void;
        inputStop(p: IPoint): void;
        inputRestore(p: IPoint): void;
        setSketchActionHandler(callback: ISketchActionReciever): void;
    }

    class SketchActionDrawByPoints implements IPointDrawingService {
        private _isInit: boolean = false;
        private _activeDrawingBoard: IStatusBoardScope = null;
        private pCTX: CanvasRenderingContext2D = null;
        private _bDrawing: boolean = false;
        private _preStoping: boolean = false;

        private _oldPoint: IPoint;
        private _currentPoint: IPoint;
        private _oldMidPoint: IPoint;

        private _aSketchAction: SketchAction = null;
        private _cbSketchActionReciever: ISketchActionReciever = null;


        constructor() {   }

        public initialize(aDrawBoard: IStatusBoardScope): boolean {
            if (aDrawBoard.getBaseCanvasElement) {
                this._activeDrawingBoard = aDrawBoard;
                let canvasBoard = aDrawBoard.getBaseCanvasElement();
                this.pCTX = ( canvasBoard && canvasBoard.getContext) ? canvasBoard.getContext('2d') : null;
                if (this.pCTX) {
                    this.pCTX.lineCap = "round";
                    this.pCTX.lineJoin = "round";
                    this._isInit = true;
                    //console.log('init finalDraw service');
                    this._bDrawing = false;
                    this._oldPoint = <IPoint>{ px: 0, py: 0 };
                    this._currentPoint = <IPoint>{ px: 0, py: 0 };
                    this._oldMidPoint = <IPoint>{ px: 0, py: 0 };

                    this._aSketchAction = null;
                    return this._isInit;
                }
            }
            return false;
        }
        public isInitialized(): boolean { return this._isInit; }
        public isDrawing(): boolean { return this._bDrawing; }
        public drawSketchAction(sa: SketchAction): void {
            if (!this._bDrawing) {
                this._currentPoint = this._oldPoint = sa.events[0];
                this._oldMidPoint = this._getMidInputCoords(sa.events[0]);
                this.pCTX.lineCap = "round";
                this.pCTX.lineJoin = "round";

                sa.events.forEach((saEventPoint: SketchActionEvent) => {
                    var currentMid = this._getMidInputCoords(saEventPoint);                    
                    this.pCTX.beginPath();
                    this.pCTX.moveTo(currentMid.px, currentMid.py);
                    this.pCTX.quadraticCurveTo(this._oldPoint.px, this._oldPoint.py, this._oldMidPoint.px, this._oldMidPoint.py);
                    this.pCTX.stroke();

                    this._oldPoint = saEventPoint;
                    this._oldMidPoint = currentMid;
                });
            }
            else
                console.log('drawSketchActions should not while drawing..');
        }
        public clearIntermediateDrawings(): void {
            this.pCTX.clearRect(0, 0, 1920, 1080);
                // Eraser Tool also has a sketchactionDraw service whose
                // initialize function has first parameter is 
                // IBoardScope but not IStatusBoardScope which means,
                // visualizeConnectionServiceStatus() should not be called from Erase tool.
            this._activeDrawingBoard.visualizeConnectionServiceStatus();
        }
        public clearFinalDrawings(): void {  }

        public set color(c: string) {
            if (this.pCTX && c)
                this.pCTX.strokeStyle = c;
        }
        public get color(): string {
            return (this.pCTX) ? this.pCTX.strokeStyle.toString() : '#000000';
        }
        public set thickness(size: number) {
            if (this.pCTX)
                this.pCTX.lineWidth = (size > 0) ? size : this.pCTX.lineWidth;
        }
        public get thickness(): number {
            return (this.pCTX) ? this.pCTX.lineWidth : 0;
        }
        public set compositeOperation(co: string) {
            if (this.pCTX && co)
                this.pCTX.globalCompositeOperation = co;
        }
        public get compositeOperation(): string {
            return (this.pCTX) ? this.pCTX.globalCompositeOperation : '';
        }

        public inputStart(p: IPoint, toolName: string): void {
            if (!this._bDrawing) {
                if ((isNaN(p.px) || isNaN(p.py)) && this._bDrawing === false)
                    console.log('Invalid touch Input, ignored');
                else {
                    this._currentPoint = this._oldPoint = p;
                    this._oldMidPoint = this._getMidInputCoords(p);
                    //console.log('user Input starts up now...' + p.px + ' ,' + p.py);
                    // sum up points in an active sketch
                    this._aSketchAction = <SketchAction>{
                        tool: (toolName && toolName != '') ? toolName : 'pencil',
                        color: this.color,
                        size: this.thickness,
                        transmit: false,
                        events: []
                    };
                    this._aSketchAction.events.push(this._currentPoint);


                    if (window.requestAnimationFrame) {
                        this._preStoping = false;
                        this._bDrawing = true;
                        requestAnimationFrame(this.draw.bind(this));
                    }
                }
            }
            else
                this.completeInputDrawing(p);
        }
        public completeInputDrawing(aPoint?: IPoint): boolean {
            if (this._bDrawing) {
                if (aPoint) {
                    this._currentPoint = aPoint;
                    this._oldPoint = aPoint;
                }

                this._bDrawing = false;
             //   console.log('Already drawing in progress... Stop sketch and save it');
                (this._cbSketchActionReciever) ? this._cbSketchActionReciever(this._aSketchAction) : '';
                return true;
            }
        }
        public inputMove(p: IPoint): void {
            this._currentPoint = p;
            //if (this._aSketchAction && this._aSketchAction.events)
            this._aSketchAction.events.push(this._currentPoint);
            //else
            //    console.log('drawing action has not started yet...');
        }

        public inputStop(p: IPoint): void {
            if (this._bDrawing) {
                if ((isNaN(p.px) || isNaN(p.py)))
                    console.log('Invalid touch Input, ignored');
                else {
                    this._currentPoint = this._oldPoint = p;
                    this._aSketchAction.events.push(this._currentPoint);
                }
                //this._isDrawing = false;
                this._preStoping = true;

                //this.saveWebStorage();                
                // after making a _preStoping feature ... _isDrawing is moved to draw ...
                // so this callback should also be there 
                //(this._cbSketchActionReciever) ? this._cbSketchActionReciever(this._aSketchAction, true) : '';                  
            }
        }
        public inputRestore(p: IPoint): void {
            this._oldPoint = p;
            this._oldMidPoint = this._getMidInputCoords(p);
        }
        public setSketchActionHandler(callback: ISketchActionReciever): void {
            this._cbSketchActionReciever = callback;
        }

        //private interface
        private _getMidInputCoords(p: IPoint): IPoint {
            return <IPoint>{
                px: this._oldPoint.px + p.px >> 1,
                py: this._oldPoint.py + p.py >> 1
            };
        }
        private draw(time: number): void {
            //if the pencil size is big (>10), the small crosshair makes a friend: a circle of the size of the pencil
            //todo: have the circle works on every browser - it currently should be added only when CSS pointer-events are supported
            //we assume that if requestAnimationFrame is supported, pointer-events is too, but this is terribad.
            ////if (window.requestAnimationFrame && this.ctx.lineWidth > 10 && this.isMouseHovering) {
            ////	this.dom.$cursor.css({ width: this.ctx.lineWidth + 'px', height: this.ctx.lineWidth + 'px' });
            ////	var transform = DrawingBoard.Utils.tpl("translateX({{x}}px) translateY({{y}}px)", { x: this.coords.current.x-(this.ctx.lineWidth/2), y: this.coords.current.y-(this.ctx.lineWidth/2) });
            ////	this.dom.$cursor.css({ 'transform': transform, '-webkit-transform': transform, '-ms-transform': transform });
            ////	this.dom.$cursor.removeClass('drawing-board-utils-hidden');
            ////} else {
            ////	this.dom.$cursor.addClass('drawing-board-utils-hidden');
            //}

            if (this._bDrawing) {
                var currentMid = this._getMidInputCoords(this._currentPoint);
                //console.log('current Point is ' + this._currentPoint.px + ' , ' + this._currentPoint.py);                
                this.pCTX.beginPath();
                this.pCTX.moveTo(currentMid.px, currentMid.py);
                this.pCTX.quadraticCurveTo(this._oldPoint.px, this._oldPoint.py, this._oldMidPoint.px, this._oldMidPoint.py);
                this.pCTX.stroke();

                this._oldPoint = this._currentPoint;
                this._oldMidPoint = currentMid;

                if (this._preStoping) {
                    this._preStoping = false;
                    this._bDrawing = false;
                    (this._cbSketchActionReciever) ?
                        this._cbSketchActionReciever(this._aSketchAction) : '';
                }
                else //{
                    //if (window.requestAnimationFrame)
                    requestAnimationFrame(this.draw.bind(this));
                //}
            }
            else { }
        }

        

        public static instance(): IPointDrawingService {
            return new SketchActionDrawByPoints();
        }
    }
    SketchActionDrawByPoints.instance.$inject = [];
    angular.module('vw').factory('vw.features.scalablewhiteboard.SketchActionDrawService', SketchActionDrawByPoints.instance);
}

