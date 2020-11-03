namespace vw.features.scalablewhiteboard {

    class SketchActionPresentFullService implements IInitializableDrawService {
        private _isInit: boolean = false;
        private pCTX: CanvasRenderingContext2D = null;
        private _bDrawing: boolean = false;

        private _oldPoint: IPoint;
        private _currentPoint: IPoint;
        private _oldMidPoint: IPoint;
        private _aSketchAction: SketchAction = null;

        constructor() { }

        public initialize(canvasBoard: HTMLCanvasElement): boolean {
            this.pCTX = (canvasBoard && canvasBoard.getContext) ? canvasBoard.getContext('2d') : null;
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
                  // complete self initialize.
                //this.color = '#000000';
                //this.thickness = 2;
                //this.compositeOperation = 'source-over';

                return this._isInit;
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
        }
        public clearFinalDrawings(): void {
            this.pCTX.clearRect(0, 0, 1920, 1080);
        }

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

        //private interface
        private _getMidInputCoords(p: IPoint): IPoint {
            return <IPoint>{
                px: this._oldPoint.px + p.px >> 1,
                py: this._oldPoint.py + p.py >> 1
            };
        }
        public static instance(): IInitializableDrawService {
            return new SketchActionPresentFullService();
        }        
    }
    SketchActionPresentFullService.instance.$inject = [];
    angular
        .module('vw')
        .factory('vw.features.scalablewhiteboard.SketchActionPresentService', SketchActionPresentFullService.instance);
}