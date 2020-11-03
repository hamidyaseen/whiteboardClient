
namespace vw.features.scalablewhiteboard {
    interface IBaseComponentController {
        registerDrawingTool(aTool: IDrawingToolScope): number;
        registerDrawingColor(aColor: IDrawingColorScope): number;
        registerDrawingBoard(aDrawingBoard: IStatusBoardScope): boolean;
        registerPresentingBoard(sPresentBoard: IBoardScope): boolean;
    }

    export interface IWhiteboardController extends IBaseComponentController, ng.IController {
        
        getActiveTool(): IDrawingToolScope;
        getActiveColor(): string;
        getActivePointSize(): number;
        findTool(name: string): IDrawingToolScope;

        undoLastSketchAction(): void;
        askConfirmationBeforeClear(): void;
        clearAllSketchActions(isLocal: boolean): void;
                            //, exist_Index?: number
        addLocalNewSketchAction(psa: ISketchActionMedTool): void;
    }
        // as sharedSpaceScope is parent to Whiteboard and whiteboard is not creating its
    // new scope rather extending the parent  sharedSpaceScope.
    export interface IWhiteboardScope extends vw.components.IAppSpaceScope
    // extends vw.features.sharedspace.ISharedSpaceScope
    {
        tools: IDrawingToolScope[];
        activeTool: IDrawingToolScope;
        activeToolReady: boolean;
        //colors: string[];
        colors: IDrawingColorScope[]; 
        activeColor: IDrawingColorScope; // string;
        pointSize: number;
        //wbScalingFactor: number;
        universalWidth: number;
        universalHeight: number;

        // latest connection state at any moment
        connectionState: number;
        roomToConnect: string;
        roomConnected: string;
               
        selectTool(aTool: IDrawingToolScope): void;
        selectColor(aColor: IDrawingColorScope): void;
        
        // extra function for VW compatibility
        needtoShow(aTool: IDrawingToolScope): boolean;
        stopDrawingAction(): void;
    }
     
    interface ITransclusionDirective {
        restrict: string;
        transclude: boolean;
        templateUrl: string;
        controller: any;
        // scope: any; // donot want scope here but use parent scope came in.
    }

    class WhiteboardDirective implements ITransclusionDirective {
        public restrict: string = 'E';
        public transclude: boolean = true;
        public templateUrl: string = 'features/whiteboardscalable/whiteboard.html';
        public controller: any;

        constructor(saData: vw.features.scalablewhiteboard.ISketchActionsData) {
            this.controller = ['$scope', '$window', function (wbScope: IWhiteboardScope, $window: ng.IWindowService): void {
                wbScope.tools = [];
                wbScope.activeTool = null;
                wbScope.activeToolReady = false;                
                wbScope.colors = [];
                wbScope.activeColor = null;
                wbScope.pointSize = 6;
                wbScope.universalWidth = 1920;
                wbScope.universalHeight = 1080;
                    
                wbScope.connectionState = -1;
                wbScope.roomToConnect = null;
                wbScope.roomConnected = null;
                
                // internal / locals
                var sDrawingBoard: IStatusBoardScope = null;
                var sPresentBoard: IBoardScope = null;
                //var localWbScalFactor = 0;
                //wbScope.wbScalingFactor = 0;
                wbScope.needtoShow = (tool: IDrawingToolScope): boolean => {
                    return (tool && tool.inName && tool.inName == 'Pencil') ? false : true;
                }
                wbScope.stopDrawingAction = (): void => {
                    (wbScope.activeTool && wbScope.activeTool.isToolDrawing()) ? wbScope.activeTool.stopToolDrawing() : '';                    
                }
                    // extra solution, just to present a color as a tool also...
                var deActiveWbActiveColor = (): void => {
                    if (wbScope.activeColor && wbScope.activeColor.deActivateColor)
                        wbScope.activeColor.deActivateColor();
                }

                // create a local function for setting the canvas scale factoring...
                this.wbSizeChanged = () => {
                    if (this.sDrawingBoard && this.sDrawingBoard.setScaleFactor) {
                        this.sDrawingBoard.setScaleFactor(wbScope.scaleFactor);
                        this.sDrawingBoard.setBoardPosition(wbScope.maxLeft, wbScope.maxTop);
                    }
                    if (this.sPresentBoard && this.sPresentBoard.setScaleFactor) {
                        this.sPresentBoard.setScaleFactor(wbScope.scaleFactor);
                        this.sPresentBoard.setBoardPosition(wbScope.maxLeft, wbScope.maxTop);
                    }
                }
                this.wbSizeChanged();
                $(window).on('resize.whiteboardPage', () => { this.wbSizeChanged(); });
                wbScope.$on('$destroy', () => $(window).off('resize.whiteboardPage'));
                wbScope.$on('SITE-ORGANIZATION', () => {
                    saData.preStartWhiteboardServiceClient(this.stateChangeAndReconnect);
                    saData.setRemoteActionsHandler(this.remoteSketchActionsReciever);
                    saData.setClearWhiteboardDataHandler(() => this.clearAllSketchActions(false));
                    this.connectToWBService(1000);
                });

                wbScope.$on('CONF-ROOM-STANDALONE', (event: ng.IAngularEvent, saRoom: vw.azureinterface.IConferenceRoomInfo): void => {
                    //let roomID = saRoom.ID.replace(/[\s\.-]/igm, "_");
                    //roomID = roomID.replace(/[@]/igm, "_AT_");
                    console.log('= WB = join standalone WB to confernece room =========== ' + saRoom.ID);
                    if (wbScope.connectionState == 1) {
                        saData.changeConferneceRoom(wbScope.roomConnected = saRoom.ID);
                    }
                    else
                        wbScope.roomToConnect = saRoom.ID;
                });
                wbScope.$on('CONF-ROOM-LEFT', (event: ng.IAngularEvent, aRoom: vw.azureinterface.IConferenceRoomInfo): void => {
                    wbScope.roomToConnect = null;
                    wbScope.roomConnected = null;
                    this.clearAllSketchActions(false);
                    DebugBuild ? console.log('= WB = Left WB to confernece room === ' + aRoom.ID) : '';
                });
                wbScope.$on('CONF-ROOM-JOINED', (event: ng.IAngularEvent, aRoom: vw.azureinterface.IConferenceRoomInfo): void => {
                    if (aRoom) {
                        DebugBuild ? console.log('= WB = Join WB to confernece room === ' + aRoom.ID) : '';
                        if (wbScope.connectionState == 1) {
                            saData.changeConferneceRoom(wbScope.roomConnected = aRoom.ID);
                        }
                        else
                            wbScope.roomToConnect = aRoom.ID;
                    }
                    else
                        console.error('============ request to join WB to confernece room =========== ' + aRoom);
                });
                wbScope.$on('YES_CLEAR_WHOLE_WHITEBOARD', () => { this.clearAllSketchActions(true); });

                this.remoteSketchActionsReciever = (action: SketchAction): void => {
                    let aTool: IDrawingToolScope = this.findTool(action.tool);

                    if (aTool && aTool.drawFinalSketchAction) {
                        // this is extra to test the tool is 
                        if (aTool.initialized) { }
                        else {
                            // this is extra setting color of selected tool
                            (wbScope.colors.length >= 1) ? wbScope.selectColor(wbScope.colors[0]) : console.log('= WB = Colors are not registered');
                            wbScope.activeTool.updateThickness(wbScope.pointSize);
                        }

                        aTool.drawFinalSketchAction(action);
                        saData.addSketchActionFinal({ sketchAction: action, tool: aTool } as ISketchActionMedTool);
                    }
                    else
                        console.log('= WB = Failed to find tool ' + action.tool + ' to draw remote actions.');

                };

                wbScope.selectColor = (aColor: IDrawingColorScope): void => {
                    if (aColor && aColor.isSelectable && aColor.isSelectable()) {
                        if (wbScope.activeColor && wbScope.activeColor.deActivateColor)
                            wbScope.activeColor.deActivateColor();
                        wbScope.activeColor = aColor;
                        wbScope.activeColor.activateColor();
                    
                        // As VW requirement is that a color is behaves as pencil tool so
                        // in Eraser tool case , we should switch to pencil tool
                        if (wbScope.activeTool.inName == 'Eraser')
                            wbScope.selectTool(this.findTool('Pencil'));
                        //else
                        //    console.log('= WB = selected tool is not eraser');
                        wbScope.activeTool.updateColor(wbScope.activeColor.inColor);
                        //DebugBuild?console.log('= WB = ' + wbScope.activeColor.inColor+' color is selected for active tool drawing service'):'';
                    }
                }
 
                wbScope.selectTool = (aTool: IDrawingToolScope): void => {
                    if (aTool) {
                        if (aTool.isSelectable && aTool.isSelectable()) {
                            if (wbScope.activeTool && wbScope.activeTool.deinitializeTool) {
                                wbScope.activeTool.deinitializeTool();
                                wbScope.activeTool.activated = false;
                                DebugBuild?console.log('= WB = selected tool is deinitialized'):'';
                            }
                            wbScope.activeTool = aTool;
                            wbScope.activeTool.activated = true;
                            wbScope.activeToolReady = false;
                            DebugBuild?console.log('= WB = new tool selected is ' + wbScope.activeTool.inName):'';
                                                        
                            if (wbScope.activeTool.inName == 'Eraser') {
                                deActiveWbActiveColor();
                                wbScope.activeToolReady = wbScope.activeTool.initializeTool(this.sPresentBoard, this.sPresentBoard.getBaseCanvasElement());
                            }
                            else
                                wbScope.activeToolReady = wbScope.activeTool.initializeTool(this.sDrawingBoard, this.sPresentBoard.getBaseCanvasElement());
                            
                        }
                        else {
                            let bInitTool = (aTool.initializeTool) ? aTool.initializeTool(this.sDrawingBoard, this.sPresentBoard.getBaseCanvasElement()) : false;
                            bInitTool = bInitTool ? aTool.triggerClickEvent(aTool.inName) : false;
                            // return bInitTool;
                        }
                    }
                }

                // registery serivce
                this.registerDrawingColor = (aColor: IDrawingColorScope): number => {
                    if (aColor) {
                        let index = wbScope.colors.push(aColor);
                        (wbScope.colors.length == 1) ? wbScope.selectColor(aColor) : '';
                        return index;
                    }
                    return -1;
                }
                this.registerDrawingTool = (aTool: IDrawingToolScope): number => {
                    if (aTool) {
                        let index = wbScope.tools.push(aTool);
                        (wbScope.tools.length == 1) ? wbScope.selectTool(aTool) : '';
                        return index;
                    }
                    return -1;
                }
                this.registerDrawingBoard = (sDrawingBoard: IStatusBoardScope): boolean => {
                    if (sDrawingBoard && sDrawingBoard.setScaleFactor) {
                        this.sDrawingBoard = sDrawingBoard;
                        let bRet = this.sDrawingBoard.setScaleFactor(wbScope.scaleFactor);
                        if (!bRet) console.log("Failed to set scale Factor"); 
                        this.sDrawingBoard.setBoardPosition(wbScope.maxLeft, wbScope.maxTop);
                        return bRet;
                    }
                    return false;
                }
                
                this.registerPresentingBoard = (sPresentBoard: IBoardScope): boolean => {
                    if (sPresentBoard && sPresentBoard.setScaleFactor) {
                        this.sPresentBoard = sPresentBoard;
                        let bRet = this.sPresentBoard.setScaleFactor(wbScope.scaleFactor);
                        this.sPresentBoard.setBoardPosition(wbScope.maxLeft, wbScope.maxTop);
                        return bRet;
                    }
                    return true;
                }


                this.undoLastSketchAction = (): void => {
                    // undo last action from saData.
                    saData.undoLastSketchAction();
                }
                this.askConfirmationBeforeClear = (): void => {
                    wbScope.$emit('CLEAR_WHOLE_WHITEBOARD');
                }
                // call from 5 scenarios
                // 1:- local user call clear wb
                // 2:- remote user call clear the wb
                // 3:- Local user changed the conf-room.
                // 4:- Local user undo last Sketch Action
                // 5:- Remote use undo last Sketch Action
                this.clearAllSketchActions = (isLocal: boolean): void => {                    
                    {
                        // clear all the sa in saData.
                        this.getActiveTool().clearFinalSketchAction();
                        this.getActiveTool().clearWaitingSketchAction();
                        saData.removeAllSketchActions(isLocal);
                    }
                }
                //, exist_Index?: number
                this.addLocalNewSketchAction = (psa: ISketchActionMedTool): void => {
                    let v4: string = (window as unknown as vwClient.uuidWindow).uuidv4();
                    saData.addNewSketchAction(psa, v4);
                }

                this.getActiveTool = (): IDrawingToolScope => {
                    return (wbScope && wbScope.activeTool) ? wbScope.activeTool : null;
                }
                this.getActiveColor = (): string => {
                    return (wbScope && wbScope.activeColor) ? wbScope.activeColor.inColor : null;
                }
                this.getActivePointSize = (): number => {
                    return (wbScope && wbScope.pointSize) ? wbScope.pointSize : 1;
                }
                this.findTool = (name: string): IDrawingToolScope => {
                    let t = null;
                    angular.forEach(wbScope.tools, (tool: IDrawingToolScope) => {
                        if (tool.inName == name)
                            t = tool;
                    });
                    return t;
                }

                this.connectToWBService = (timeToRetry: number): void =>
                {
                    let connPromise = saData.startWBServiceClient();
                    connPromise.then((): void => {

                        if (wbScope.roomToConnect)
                            saData.changeConferneceRoom(wbScope.roomConnected = wbScope.roomToConnect);
                    },
                        (reason: any) => {
                            console.log('= WB = connection has Failed ', reason);
                            //console.log('= WB = Going to retry WB service client');
                            //vwapp.components.logIn.Init().then(() => {
                            //    setTimeout(this.connectToWBService, timeToRetry);
                            //},
                            //    () => console.log('Access validation failed 23'));
                        }
                    );
                }

                this.stateChangeAndReconnect = (state: SignalR.StateChanged): void => {
                    // Here I should have tested last/previous connection-State, but 
                    // I am going to decide based on final state only... 
                    let needRestart = (state.newState == 1 && wbScope.connectionState == 2) ? true : false;
                    let needConnect = (state.newState == 4 && wbScope.connectionState == 2) ? true : false;

                    wbScope.connectionState = state.newState;
                    DebugBuild ? console.log('= WB = Now wb connection state is ' + wbScope.connectionState) : '';
                    this.sDrawingBoard.setConnectionServiceStatus(state.newState);
                    if (needRestart) {
                        DebugBuild ? console.log('= WB = re-starting Wb connection') : '';
                        wbScope.roomToConnect = wbScope.roomConnected;
                        saData.stopWBServiceClient();
                        this.connectToWBService(3000);
                    }
                    else if (needConnect) {
                        DebugBuild ? console.log('= WB = re-connecting') : '';
                        wbScope.roomToConnect = wbScope.roomConnected;
                        this.connectToWBService(60000);
                    }
                };
                
            }];
        }

        public static Factory(): any {
            var directive = (saData: vw.features.scalablewhiteboard.ISketchActionsData): ITransclusionDirective => {
                return new WhiteboardDirective(saData);
            }
            directive.$inject = ['vw.features.scalablewhiteboard.SketchActionsData'];
            return directive;
        }
    }

    angular
        .module('vw').directive('whiteBoard', WhiteboardDirective.Factory());
}