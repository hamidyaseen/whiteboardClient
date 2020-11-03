namespace vw.features.sharedocument
{
    export interface IRemoteDSCallsHandler
    {
        selectDocument(doc: IDocInfo, vpCommand?: IViewPort): void;
        //selectedDocumentAttribChanged(vpCommand: IViewPort): void; 
        remoteChangeDocument(vpCommand: IViewPort): void;
        remoteDeletedDocument(message: string, docNum: string): void;
        //connectionStateChangedHandler(state: SignalR.StateChanged): void;
        unShareDocument(docNum?: string): void;

    }
}