
namespace vw.features.scalablewhiteboard {
    export interface SketchActionEvent {
        px: number;
        py: number;
        pEvent: string;
    }
    export interface IPoint extends SketchActionEvent { }
    //export interface IPoint {
    //    px: number;
    //    py: number;
    //}
    export interface SketchAction {
        tool: string;
        color: string;
        size: number;
        transmit: boolean;
        events: SketchActionEvent[];
    }
    export interface ITool {
        tool: string;
        color: string;
        size: string;
    }

    //export interface WhiteboardHubClient
    //{
    //    updateWhiteboard(action: SketchAction): void;
    //    clearWhiteboard(): void;
    //    confirmation(index: number): void;
    //    broadcastMessage(name: string, message: string): void;
    //}    
    //export interface WhiteboardHubServer
    //{
    //    joinRoom(name: string): void;
    //    send(action: SketchAction, index: number): void;
    //    undo(): void;
    //    clear(): void;
    //    changeRoom(newName: string);
    //    sendTextMessage(name: string, message: string): void;
    //}
    export interface WhiteboardHubConnection {
        state: number;
    }

    //export interface VWHubClient {
    //    updateWhiteboard(action: SketchAction): void;
    //    clearWhiteboard(): void;
    //    confirmation(index: number): void;
    //    reportLogMessage(msg: string): void;
    //    grabLog(msg: string): void;
    //    broadcastMessage(name: string, message: string): void;
    //}
    //export interface VWHubServer {
    //    joinRoom(roomId: string): void;
    //    ping(): void;
    //    refreshWhiteboard(): void;
    //    broadcastMessage(name: string, message: string): void;
    //    send(action: SketchAction, index: number): void;
    //    undo(): void;
    //    clear(): void;
    //}    
    //export interface vWHubConnection {
    //    state: number;
    //}

    //export interface WhitebaordHub {
    //    client: WhiteboardHubClient;
    //    server: WhiteboardHubServer;
    //    connection: WhiteboardHubConnection;
    //}
    export interface WhiteboardHubClient {
        updateWhiteboard(action: SketchAction): void;
        clearWhiteboard(): void;
        confirmation(index: number): void;
        reportLogMessage(msg: string): void;
        broadcastMessage(name: string, message: string): void;
    }
    export interface DocShareHubClient {
        changeDocument(command: sharedocument.IViewPort): void;
        load(viewPort: sharedocument.IViewPort): void;
        reload(message: string): void;
        clearDocument(message: string, docNum: string): void;

        reportConnections(count: number): void;
        showMessage(message: string): void;
        
    }
    export interface GeneralHubClient {
        call(conferenceRoom: any): void;
        grabLog(log: string): void;
    }

    export interface WhiteboardHubServer {
        joinRoom(name: string): void;
        refreshWhiteboard(): void;
        send(action: SketchAction, index: number): void;
        undo(): void;
        clear(): void;
        changeRoom(newName: string);
        sendTextMessage(name: string, message: string): void;
    }
    export interface DocShareHubServer {
    }

    export interface VWHubProxy extends SignalR.Hub.Proxy
    {
        wbClient?: WhiteboardHubClient;
        wbServer?: WhiteboardHubServer;
        dsClient?: DocShareHubClient;
        dsServer?: DocShareHubServer;
        gClient?: GeneralHubClient;
       // connection?: WhiteboardHubConnection;
    }
}

