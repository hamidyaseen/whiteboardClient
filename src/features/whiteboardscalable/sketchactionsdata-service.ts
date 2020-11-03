namespace vw.features.scalablewhiteboard {
    export interface ISketchActionMedTool {
        sketchAction: SketchAction;
        tool: IDrawingToolScope
    }
    export interface ISketchActionPlus extends ISketchActionMedTool {
        id: string;
    }

    export interface ISketchActionsData {
        preStartWhiteboardServiceClient(callback: vwClient.IConnectionStateReciever): void;
        setRemoteActionsHandler(callback: vwClient.IRemoteActionsReciever): void;

        startWBServiceClient(): JQueryPromise<any>;
        stopWBServiceClient(): void; // SignalR.Connection;
        changeConferneceRoom(userRoom: string): void;

        addSketchActionFinal(psa: ISketchActionMedTool): number;
        addNewSketchAction(psa: ISketchActionMedTool, uID: string): void; //, exist_Index?: number

        removeAllSketchActions(isLocal: boolean): void;
        undoLastSketchAction(): void;
        setClearWhiteboardDataHandler(callbak: any): void;
    }

    class SketchActionsData implements ISketchActionsData {
        // internal sketch action holdings.
        private _sketchActions: ISketchActionMedTool[];
        private _inWaitSketchActions: ISketchActionPlus[] = null;

        constructor() { //private vwClient: vw.features.vwClient.IClient) {
            this._sketchActions = [];
            this._inWaitSketchActions = [];
        }
        public preStartWhiteboardServiceClient(callback: vwClient.IConnectionStateReciever): void
        {
            
        }
        public setRemoteActionsHandler(callback: vwClient.IRemoteActionsReciever): void {
            //this.vwClient.setRemoteActionsHandler(callback);
        }
        public remoteConfirmationReciever(id: string): void {
            if (this._inWaitSketchActions && this._inWaitSketchActions.length > 0) {
                let foundIndex: number = -1;
                this._inWaitSketchActions.forEach((sa: ISketchActionPlus, index: number) => {
                    if (sa && sa.id === id) {
                        foundIndex = index;
                        this.finalizeSketchAction(sa);
                    }
                });

                if (foundIndex >= 0) {
                    // delete from waiting list.
                    this._inWaitSketchActions[foundIndex] = null;
                    this.redrawWaitingSketchActions();
                }
            }
        }
        private finalizeSketchAction(sa: ISketchActionPlus): number {
            //this._waitSketchActions[Index].sketchAction.transmit = true;
            sa.sketchAction.transmit = true;

            // redraw as final
            //this._waitSketchActions[Index].tool.drawFinalSketchAction(this._waitSketchActions[Index].sketchAction); //, true);
            sa.tool.drawFinalSketchAction(sa.sketchAction);

            // add to final ones
            let ret = this.addSketchActionFinal(sa);

            // remove from waiting canvas.
            sa.tool.clearWaitingSketchAction();

            //if (this._clearWhiteboardDrawing) { // if there is clearing mechanism then clear and redraw.
            //    this._clearWhiteboardDrawing();                        
            //}
            // redraw all other waiting Sketchings...
            return ret;
        }
        //public remoteConfirmationReciever(id: string): void {
        //    console.log("Tranmit confirmed for " + id);

        //    if (this._waitSketchActions && this._waitSketchActions[index] && this._waitSketchActions[index] != null) {
        //        this._waitSketchActions[index].sketchAction.transmit = true;
        //        // redraw as final
        //        this._waitSketchActions[index].tool.drawFinalSketchAction(this._waitSketchActions[index].sketchAction); //, true);
        //        // add to final ones
        //        this.addSketchActionFinal(this._waitSketchActions[index]);
        //        // remove from waiting canvas.
        //        this._waitSketchActions[index].tool.clearWaitingSketchAction();
        //        // delete from waiting list.
        //        this._waitSketchActions[index] = null;
        //        //if (this._clearWhiteboardDrawing) { // if there is clearing mechanism then clear and redraw.
        //        //    this._clearWhiteboardDrawing();                        
        //        //}
        //        // redraw all other waiting Sketchings...
        //        this.redrawWaitingSketchActions();

        //    }
        //}

        public startWBServiceClient(): JQueryPromise<any> {
            //return this.vwClient.startClient();
            let jqDef = $.Deferred<any>();
            if (jqDef) {
                let result = true;
                if (result) {
                    jqDef.resolve(true);
                } else {
                    jqDef.reject(false);
                }

                return jqDef.promise();
            }
            return jqDef;
        }
        public stopWBServiceClient(): void {    // SignalR.Connection {
            //return this.vwClient.stopClient();
        }
        public changeConferneceRoom(userRoom: string): void {
            ////let thisUser = userRoom.replace(/[\s\.-]/igm, "_");
            ////thisUser = thisUser.replace(/[@]/igm, "_AT_");
            ////this.vwClient.roomJoined(userRoom);
            //this.vwClient.joinGroup(userRoom).then(() => {
            //    this.vwClient.refreshWhiteboard();
            //}, () => {
            //    console.log("Failed to Change hub room.");
            //});
        }
        public addSketchActionFinal(psa: ISketchActionMedTool): number {
            let len = this._sketchActions.length;
            this._sketchActions.push(psa);  // jsut add sketch action to local
            if (this._sketchActions.length == len)
                console.log('= WB = remote sketch action is Failed to pushed to _sketchActions');
            return this._sketchActions.length;
        }

        public addNewSketchAction(psa: ISketchActionMedTool, uID: string): void {
            (psa as ISketchActionPlus).id = uID;
            //////this.vwClient.sendSketchAction(psa.sketchAction, uID);

            psa.tool.drawWaitingSketchAction(psa.sketchAction);
            let len = this._inWaitSketchActions.push(psa as ISketchActionPlus);

            // above true means, put this stoke at the index == length
            let tryCount: number = 6;
            let tryInterval: number = 500; //500ms
            setTimeout(() => {
                this.checkFailedToTransmit(uID, tryCount, tryInterval);
            }, tryInterval);
        }

        public removeAllSketchActions(isLocal: boolean): void {
            ////if (isLocal)
            ////    this.vwClient.sendClearWhiteboard();
            // clear means removing all the strokes, final and waiting  
            this._sketchActions = [];
            this._inWaitSketchActions = [];
        }
        public undoLastSketchAction(): void {
            //////this.vwClient.undoLastSketchAction();
        }
        public setClearWhiteboardDataHandler(callbak: any): void {
            //////this.vwClient.setClearWhiteboardHandler(callbak);
        }

        // self checking transmitted SA and confirmation 
        private checkFailedToTransmit(id: string, timesTry: number, tryInterval: number): void {
            if (this._inWaitSketchActions.length >= 1) {
                this._inWaitSketchActions.forEach((sa: ISketchActionPlus, index: number) => {
                    if (sa && sa.id === id) {
                        if (timesTry) {
                            console.log('still waiting for last stoke.' + id + ' tried ' + timesTry);
                            timesTry -= 1;
                            tryInterval += 500;
                            setTimeout(() => { this.checkFailedToTransmit(id, timesTry, tryInterval); }, tryInterval);
                        }
                        else {
                            // stop transmitting the same old stoks
                            // disable the drawing canvas
                            // report network issue
                            //   let firstIssueDetectedSA: ISketchActionMedTool = this._waitSketchActions[Index];

                            //vwapp.gLog.networkIssueEncounter('network issue', 'encountered');
                            console.log('Network issue encountered for zthe sketch ' + id);
                            //    toastr.error('Network issue encountered.');
                        }
                    }
                });

                //if (this._waitSketchActions[Index] && this._waitSketchActions[Index].sketchAction && !(this._waitSketchActions[Index].sketchAction.transmit)) {
                //      // this sa in not transmitted
                //    if (timesTry) {
                //        console.log('still waiting for last stoke.' + Index + ' tried ' + timesTry);
                //        timesTry -= 1;                        
                //        tryInterval += 500;
                //        setTimeout(() => { this.checkFailedToTransmit(id, timesTry, tryInterval); }, tryInterval);
                //    }
                //    else {
                //        // stop transmitting the same old stoks
                //        // disable the drawing canvas
                //        // report network issue
                //        let firstIssueDetectedSA: ISketchActionMedTool = this._waitSketchActions[Index];

                //        //vwapp.gLog.networkIssueEncounter('network issue', 'encountered');
                //        console.log('Network issue encountered by the sketch.' + Index);
                //    //    toastr.error('Network issue encountered.');
                //    }
                //}
            }
        }

        private redrawWaitingSketchActions(): void {
            if (this._inWaitSketchActions.length >= 1)
                angular.forEach(this._inWaitSketchActions, (psa: ISketchActionMedTool) => {
                    if (psa != null)
                        psa.tool.drawWaitingSketchAction(psa.sketchAction);//, false);
                });
        }

        public static instance(vwClient: vw.features.vwClient.IClient): ISketchActionsData {
            return new SketchActionsData(); //vwClient);
        }
    }
    SketchActionsData.instance.$inject = ['vw.features.vwClient.VWClient'];
    angular
        .module('vw')
        .factory('vw.features.scalablewhiteboard.SketchActionsData', SketchActionsData.instance);
}