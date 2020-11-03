namespace vw.features.vwClient {
    interface vwConnectionOptions extends SignalR.ConnectionOptions {
        withCredentials?: boolean,
    }

    interface vwConnection extends SignalR.Connection {
        accessToken?: string,
    }

    export interface IConnectionStateReciever {
        (state: SignalR.StateChanged): void;
    }
    export interface IRemoteActionsReciever {
        (action: scalablewhiteboard.SketchAction): void;
    }
    export interface IRemoteConfirmationReciever {
        (id: string): void;
    }
    export interface IRemoteCleanReciever {
        (): void;
    }

    export interface IClient {
        init(): boolean;
        setConnectionStateReciever(stateReciever: IConnectionStateReciever): boolean;
        setRemoteActionsHandler(callback: IRemoteActionsReciever): boolean;
        setRemoteConfirmationHandler(callback: IRemoteConfirmationReciever): boolean;
        setClearWhiteboardHandler(callback: IRemoteCleanReciever): boolean;


        startClient(): JQueryPromise<any>;
        doesAlive: boolean;
        stopClient(): SignalR.Connection;

        joinGroup(name: string): JQueryPromise<any>;
        refreshWhiteboard(): void;
        sendSketchAction(sa: scalablewhiteboard.SketchAction, id: string): JQueryPromise<any>;
        sendClearWhiteboard(): void;
        undoLastSketchAction(): void;

        // Document share interface 
        dsRemoteCallsHandler: sharedocument.IRemoteDSCallsHandler;

        unlockDocument(docNum: string, pin: string): JQueryPromise<any>;
        shareDocument(vpCommand: sharedocument.IViewPort): JQueryPromise<any>;
        unshareDocument(docName: string): JQueryPromise<any>;
        deleteDocument(docName: string): JQueryPromise<any>;
        shareZoomLevel(vpCommand: sharedocument.IViewPort): JQueryPromise<any>;
        shareScrollPos(vpCommand: sharedocument.IViewPort): JQueryPromise<any>;
        shareAliveState(): JQueryPromise<any>;
        callToVWUser(hUser: string): JQueryPromise<any>;
    }

    class VWClient implements IClient {
        private readonly hubUrl: string = "/SignalR/hubs/"; // it need base address...
        private hubProxy: scalablewhiteboard.VWHubProxy = null;
        private connection: SignalR.Hub.Connection = null;
        private connState: SignalR.ConnectionState = SignalR.ConnectionState.Disconnected;

        // Document Share call
        private _dsRemoteCallsHandler: sharedocument.IRemoteDSCallsHandler = null;
        public set dsRemoteCallsHandler(rcHandler: sharedocument.IRemoteDSCallsHandler) {
            if (rcHandler) this._dsRemoteCallsHandler = rcHandler;
        }

        constructor() { }

        public setConnectionStateReciever(stateReciever: IConnectionStateReciever): boolean {
            if (this.hasHubProxy && this.connection.stateChanged && typeof stateReciever === "function") {
                this.connection.stateChanged((state: SignalR.StateChanged) => {
                    console.log(' ?? connection state ' + state.newState);
                    this.connState = state.newState;
                    stateReciever(state);
                });
                return true;
            }
            return false;
        }
        public init(): boolean {
            let bRet = this.initConnection(true);
            bRet = bRet && this.initClient();
            bRet = bRet && this.initWBClient();
            bRet = bRet && this.initDSClient();
        //    bRet = bRet && this.initCMClient();
            return bRet;
        }
        // ======= Private ========
        private initConnection(enableLog: boolean): boolean {
            if (!this.hasHubProxy) {
                this.connection = $.hubConnection(this.hubUrl, { logging: enableLog } as SignalR.Hub.Options);

                this.hubProxy = this.connection.createHubProxy('vWHub') as scalablewhiteboard.VWHubProxy;
                if (!this.hubProxy) {
                    console.log('Fail to load hub proxy');
                    return false;
                }
            }
            return true;
        }

        private initClient(): boolean {
            if (this.hasHubProxy) {
                this.hubProxy.on('reportLogMessage', (msg: string): void => {
                    console.log(" = hub = " + msg);
                });
                this.hubProxy.on('broadcastMessage', (name: string, message: string): void => {
                    console.log(" = hub = " + name + " : " + message);
                });

                this.hubProxy.on('reportConnections', (count: number): void => {
                    console.log(' = hub= ' + count + ' reportConnections');
                });
                this.hubProxy.on('showMessage', (message: string): void => {
                    console.log(' = hub = ' + message + ' ---showMessage');
                });
                this.hubProxy.on('grabLog', (log: string): void => {
                    console.log(' = hub =' + log + ' ---grabLog.');
                });
                this.hubProxy.on('call', (conferenceRoom: any): void => {
                    console.log(' = hub = ' + conferenceRoom + ' Host got message to join room.');
                    //console.log('==== ' + cfRoom + ' Host got message to join room.');
                    //APP.server.joinAutoConnectRoom(1);
                });
            }
            return true;
        }
        private initWBClient(): boolean {
            if (this.hasHubProxy) {
                this.hubProxy.on('updateWhiteboard', (sAction: scalablewhiteboard.SketchAction): void => {
                    console.log(' -- got a Remote Action to update.');
                });
                this.hubProxy.on('clearWhiteboard', (): void => {
                    console.log(' -- clear whiteboard from Remote.');
                });
                this.hubProxy.on('confirmation', (id: string): void => {
                    console.log(' -- Stoke ' + id + ' is tranmitted.');
                });
            }
            return true;
        }
        private initDSClient(): boolean {
            if (this.hasHubProxy) {
                this.hubProxy.on('changeDocument', (command: sharedocument.IViewPort): void => {
                    console.log('-- change document from Remote.');
                    this, this._dsRemoteCallsHandler.remoteChangeDocument(command);
                });
                this.hubProxy.on('load', (viewPort: sharedocument.IViewPort): void => {
                    console.log(' -- ' + viewPort + ' -- load');
                });
                this.hubProxy.on('reload', (message: string): void => {
                    console.log(' -- ' + message + ' -- reload');
                });

                // Instead of writting callback , let make default callback,
                this.hubProxy.on('clearDocument', (message: string, docNum: string): void => {
                    console.log(' -- clear Document -- ' + message + ' = ' + docNum);
                    if (docNum && docNum.length > 0 && this._dsRemoteCallsHandler &&
                        this._dsRemoteCallsHandler.unShareDocument &&
                        this._dsRemoteCallsHandler.remoteDeletedDocument) {
                        if (message.indexOf('unshared!') >= 0)
                            this._dsRemoteCallsHandler.unShareDocument(docNum);
                        else if (message.indexOf('deleted!') >= 0)
                            this._dsRemoteCallsHandler.remoteDeletedDocument(message, docNum);
                        else
                            console.log('-- clear Document -- invalid message --');
                    }
                });
            }
            return true;
        }

        public startClient(): JQueryPromise<any> {
            let jPromise = null;
            if (this.hasHubProxy) {
                console.log(' --- Going to start connection ');
                
                //  $.connection.hub.logging = DebugBuild ? true : false;
                jPromise = this.connection.start({ transport: ['webSockets'], withCredentials: false } as vwConnectionOptions);

            }
            return jPromise
        }
        public stopClient(): SignalR.Connection {
            if (this.doesConnectionAlive) {
                let connection = this.connection.stop(true, true);
                // May be I shuld null this connection object or not 
                this.connection = null;
                return connection;
            }
        }
        public setRemoteActionsHandler(callback: IRemoteActionsReciever): boolean {
            if (this.hasHubProxy && typeof callback === "function") {
                console.log('--- Set Remote Action Handler');
                this.hubProxy.on('updateWhiteboard', callback);
                return true;
            }
            return false
        }
        public setRemoteConfirmationHandler(callback: IRemoteConfirmationReciever): boolean {
            if (this.hasHubProxy && typeof callback === "function") {
                console.log(' -- Set Remote Confirmation Handler');
                this.hubProxy.on('confirmation', callback);
                return true;
            }
            return false;
        }
        public setClearWhiteboardHandler(callback: IRemoteCleanReciever): boolean {
            if (this.hasHubProxy && typeof callback === "function") {
                console.log(' -- set Clear Whiteboard Handler');
                this.hubProxy.on('clearWhiteboard', callback);
                return true;
            }
            return false;
        }
        public joinGroup(gName: string): JQueryPromise<any> {
            let promise = null;
            if (this.doesConnectionAlive && this.isNonEmptyString(gName)) {
                console.log(' -- Going to join group =' + gName);
                //console.log('whiteboard loaded data is=' + this._drawingActionsCount);
                promise = this.hubProxy.invoke('joinRoom', gName);
                promise.then(() => {
                    this._doesInGroup = true;
                }, () => {
                    this._doesInGroup = true;
                });
                return promise;
            }
            else
                console.log('= hub = client servivce is not connected or invalid name. ');
            return promise;
        }
        // ============= Private Interface ==============
        private get hasHubProxy(): boolean {
            //return (this.connection !== null && this.hubProxy !== null);
            let ret = (this.connection !== null);
            if (!ret) { console.log(" ## connection is not created ##"); return ret; }
            ret = (this.hubProxy !== null)
            if (!ret) {
                console.log(" ## No hub proxy ##"); return ret;
            }
            return ret;
        }

        private get doesConnectionAlive(): boolean {
            //return (this.connection !== null && this.hubProxy !== null &&
            //    this.connState == SignalR.ConnectionState.Connected);

            let ret = (this.connection !== null);
            if (!ret) { console.log(" ## connection is not created ##"); return ret; }
            ret = (this.hubProxy !== null)
            if (!ret) {
                console.log(" ## No hub proxy ##"); return ret;
            }
            ret = (this.connState == SignalR.ConnectionState.Connected);
            if (!ret) {
                console.log(" ## connection is not connect ##"); return ret;
            }
            return ret;
        }
        private _doesInGroup: boolean = false;
        private get doesJoinedGroup(): boolean { return this._doesInGroup; }
        private isNonEmptyString(str: string): boolean {
            return str && str.length > 0; // Or any other logic, removing whitespace, etc.
        }
        public get doesAlive(): boolean { return this.doesConnectionAlive; }

        // ============== Whiteboard Interface ==============
        public refreshWhiteboard(): void {
            if (this.doesConnectionAlive && this.doesJoinedGroup)
                this.hubProxy.invoke('refreshWhiteboard');
            else
                console.log('= hub = client servivce is not connected or invalid name or group.');
        }
        public sendSketchAction(sa: scalablewhiteboard.SketchAction, id: string): JQueryPromise<any> {
            if (this.doesConnectionAlive && this.doesJoinedGroup)
                return this.hubProxy.invoke('send', sa, id);
            else
                return null;
        }
        public sendClearWhiteboard(): void {
            if (this.doesConnectionAlive && this.doesJoinedGroup)
                this.hubProxy.invoke('clear');
            else
                console.log('= WB = Whiteboard servivce is not connected.');
        }
        public undoLastSketchAction(): void {
            if (this.doesConnectionAlive && this.doesJoinedGroup)
                this.hubProxy.invoke('undo');
            else
                console.log('= WB = Whiteboard servivce is not connected.');
        }


        // ============== Doc Share Interface ==============
        public unlockDocument(docNum: string, pin: string): JQueryPromise<any> {
            if (this.doesConnectionAlive && this.doesJoinedGroup)
                return this.hubProxy.invoke('unlockDocument', docNum, pin);
            else
                return null;
        }

        // it should handle the async result...
        public shareDocument(vpCommand: sharedocument.IViewPort): JQueryPromise<any> {
            DebugBuild ? console.log('Going to share the local document ' + vpCommand.document) : "";
            return this.changeDocumentInfo(vpCommand);
        }
        public unshareDocument(docName: string): JQueryPromise<any> {
            if (this.doesConnectionAlive && this.doesJoinedGroup)
                return this.hubProxy.invoke('unshareDocument', docName);
            else
                return null;
        }
        public deleteDocument(docName: string): JQueryPromise<any> {
            // if really visible need to deselect            
            // if there is one document selected 
            // if it is a local command to delete
            // if connection to DS hub is alive.
            if (this.doesConnectionAlive && this.doesJoinedGroup)
                this.hubProxy.invoke('deleteDocument', docName);
            else
                return null;
        }

        private changeDocumentInfo(vpCommand: sharedocument.IViewPort): JQueryPromise<any> {
            if (this.doesConnectionAlive && this.doesJoinedGroup)
                return this.hubProxy.invoke('changeDocument', vpCommand);
            return null;
        }
        public shareZoomLevel(vpCommand: sharedocument.IViewPort): JQueryPromise<any> {
            return this.changeDocumentInfo(vpCommand);
        }
        public shareScrollPos(vpCommand: sharedocument.IViewPort): JQueryPromise<any> {
            return this.changeDocumentInfo(vpCommand);
        }

        public shareAliveState(): JQueryPromise<any> {
            if (this.doesConnectionAlive && this.doesJoinedGroup)
                return this.hubProxy.invoke('ping');
            else
                return null;
        }
        public callToVWUser(hUser: string): JQueryPromise<any> {
            if (this.doesConnectionAlive && this.doesJoinedGroup)
                return this.hubProxy.invoke('call', hUser);
            else
                return null;
        }

        public static instance(): VWClient {
            return new VWClient();
        }
    }
    VWClient.$inject = [];

    angular
        .module('vw')
        .factory('vw.features.vwClient.VWHubClient', VWClient.instance);
}