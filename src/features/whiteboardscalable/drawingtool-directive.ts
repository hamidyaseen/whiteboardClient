namespace vw.features.scalablewhiteboard {

    export interface IToolBase {
        inName: string;
        //inColor: string;
        inThickness: number;
        inTitle?: string;
    }
    export interface IVisualToolBase extends IToolBase {
        ActiveLook: string;
        PassiveLook: string;
    }
    export interface ISelectableTool extends IVisualToolBase {
        inComposite: string;
        inSelectable: string;
        isSelectable(): boolean;

        getSketchAction(sa: SketchAction): void;
    }
    export interface ITriggerableTool extends IVisualToolBase {
        inTriggerable: string;
        isTriggerable(): boolean;
        triggerClickEvent(name: string): boolean;
    }

    export interface IDrawingToolScope extends ng.IScope, ISelectableTool, ITriggerableTool {
        activated: boolean;
        
        initializeTool(interactiveDrawBoard: IStatusBoardScope, presentBoard: HTMLCanvasElement): boolean;
        deinitializeTool(): void;

        isToolDrawing(): boolean;
        stopToolDrawing(): boolean;

        drawWaitingSketchAction(sa: SketchAction): void; //, bSave: boolean): void;
        drawFinalSketchAction(sa: SketchAction): void;
        clearWaitingSketchAction(): void;
        clearFinalSketchAction(): void;

        updateColor(c: string): void;
        updateThickness(s: number): void;

        inputStart(p: IPoint): void;
        inputMove(p: IPoint): void;
        inputStop(p: IPoint): void;
        inputRestore(p: IPoint): void;
    }

    class DrawingTool implements IWhiteboardRegisterableDirective {
        public restrict: string = 'E';
        public transclude: boolean = true;
        public templateUrl: string = 'features/whiteboardscalable/drawingtool.html';
        public require: string = '^^whiteBoard';
        public scope: any = {
            inName: '@toolname',
            inThickness: '@size',
            inComposite: '@compose',
            inSelectable: '@selectable',
            inTriggerable: '@triggerEvent',
            inTitle: '@title',
            ActiveLook: '@activeLook',
            PassiveLook: '@passiveLook'
        };

        constructor(private dDrawingService: IPointDrawingService, private pDrawingService: IInitializableDrawService) {
        }

        public link(toolScope: IDrawingToolScope, element: ng.IAugmentedJQuery, attribs: ng.IAttributes, wbCtrl: IWhiteboardController): void
        {
            toolScope.activated = false;

            toolScope.initializeTool = (interactiveDrawBoard: IStatusBoardScope, presentBoard: HTMLCanvasElement): boolean => {
                if (interactiveDrawBoard) {
                    
                    if (toolScope.isSelectable()) {
                        console.log((toolScope.inTitle ? toolScope.inTitle : '') + ',' + toolScope.inName + ' is to initialize.');
                        let bRet = this.dDrawingService.initialize(interactiveDrawBoard);
                        bRet ? '' : console.log('Failed to initialize sketching action drawing service');
                        this.dDrawingService.color = (toolScope.inName == 'Eraser') ? 'transparent' : wbCtrl.getActiveColor();
                        this.dDrawingService.thickness = (toolScope.inThickness && toolScope.inThickness >= 1) ? toolScope.inThickness : wbCtrl.getActivePointSize();
                        this.dDrawingService.compositeOperation = toolScope.inComposite;

                        this.dDrawingService.setSketchActionHandler(toolScope.getSketchAction);

                        bRet = bRet && this.pDrawingService.initialize(presentBoard);
                        bRet ? '' : console.log('Failed to initialize sketching action presenting service');
                        this.pDrawingService.color = wbCtrl.getActiveColor();
                        this.pDrawingService.thickness = (toolScope.inThickness && toolScope.inThickness >= 1) ? toolScope.inThickness : wbCtrl.getActivePointSize();
                        this.pDrawingService.compositeOperation = toolScope.inComposite;
                        return bRet;
                    }
                    else
                        return true;
                }
                return false;
            }
            toolScope.deinitializeTool = (): void => {
                this.dDrawingService.setSketchActionHandler(null);
            }

            toolScope.getSketchAction = (sa: SketchAction): void => {
                wbCtrl.addLocalNewSketchAction(<ISketchActionMedTool>{ sketchAction: sa, tool: toolScope});
            }
            toolScope.isToolDrawing = (): boolean => {
                return (this.dDrawingService && this.dDrawingService.isInitialized() && this.dDrawingService.isDrawing) ? this.dDrawingService.isDrawing() : false;
            }
            toolScope.stopToolDrawing = (): boolean => {
                return (toolScope.isToolDrawing()) ? this.dDrawingService.completeInputDrawing() : false;
            }
                                                //, bSave: boolean
            toolScope.drawWaitingSketchAction = (sa: SketchAction): void => {
                let c = this.dDrawingService.color;
                let t = this.dDrawingService.thickness;
                let co = this.dDrawingService.compositeOperation;

                this.dDrawingService.color = sa.color;
                this.dDrawingService.thickness = (sa.tool === 'Eraser') ? sa.size : sa.size + 4;
                this.dDrawingService.compositeOperation = (sa.tool === 'Eraser') ? 'destination-out' : 'source-over';

                this.dDrawingService.drawSketchAction(sa);

                this.dDrawingService.color = c;
                this.dDrawingService.thickness = t;
                this.dDrawingService.compositeOperation = co;
                //if (bSave)
                //    this.saData.addSketchActionWaiting(<ISketchActionMedTool>{sketchAction: sa, tool: toolScope });
            }
            toolScope.drawFinalSketchAction = (sa: SketchAction): void => {
                let c = this.pDrawingService.color;
                let t = this.pDrawingService.thickness;
                let co = this.pDrawingService.compositeOperation;

                this.pDrawingService.color = sa.color;
                this.pDrawingService.thickness = sa.size;
                this.pDrawingService.compositeOperation = (sa.tool === 'Eraser') ? 'destination-out' : 'source-over';

                this.pDrawingService.drawSketchAction(sa);

                this.pDrawingService.color = c;
                this.pDrawingService.thickness = t;
                this.pDrawingService.compositeOperation = co;
                //if (bSave)
                //    this.saData.addSketchActionFinal(<ISketchActionMedTool>{ sketchAction: sa, toolScope: dToolScope });
            }
            toolScope.clearWaitingSketchAction = (): void => {
                    //As eraser tool has special requirement to directly draw on
                    //final drawing canvas, not on dDrawingService canvas, so in 
                    //eraser tool pDrawingService and dDrawingService point to same canvas.
                if (toolScope.inName != 'Eraser')
                    this.dDrawingService.clearIntermediateDrawings();
            }
            toolScope.clearFinalSketchAction = (): void => {
                this.pDrawingService.clearFinalDrawings();
            }

            toolScope.updateColor = (c: string): void => {
                if (c && c.length > 0)
                    this.pDrawingService.color = this.dDrawingService.color = c;
            }
            toolScope.updateThickness = (s: number): void => {
                if (s && s >= 1)
                    this.pDrawingService.thickness = this.dDrawingService.thickness = s;
            }
            toolScope.isSelectable = (): boolean => {
                return (toolScope.inSelectable === "");
            }
            toolScope.isTriggerable = (): boolean => {
                return (toolScope.inTriggerable === "");
            }
            toolScope.triggerClickEvent = (name: string): boolean => {
                if (name == 'Clear')
                    wbCtrl.askConfirmationBeforeClear();                    
                    //wbCtrl.clearAllSketchActions(true);
                else if (name == 'Undo')
                    wbCtrl.undoLastSketchAction();
                return true;
            }
            toolScope.inputStart = (p: IPoint): void => {                
                this.dDrawingService.inputStart(p, toolScope.inName);
            }
            toolScope.inputMove = (p: IPoint): void => {
                if (this.dDrawingService.isDrawing())
                    this.dDrawingService.inputMove(p);
            }
            toolScope.inputStop = (p: IPoint): void => {
                this.dDrawingService.inputStop(p);
            }
            toolScope.inputRestore = (p: IPoint): void => {
                this.dDrawingService.inputRestore(p);
            }

            (<IWhiteboardController>wbCtrl).registerDrawingTool(toolScope);
        }

        public static Factory(): any {
            let directive = (dDrawingService: IPointDrawingService, pDrawingService: IInitializableDrawService): IWhiteboardRegisterableDirective => {
                return new DrawingTool(dDrawingService, pDrawingService);
            }
            directive.$inject = ['vw.features.scalablewhiteboard.SketchActionDrawService','vw.features.scalablewhiteboard.SketchActionPresentService'];
            return directive;

        }
    }
    angular.module('vw').directive('drawingTool', DrawingTool.Factory());


}