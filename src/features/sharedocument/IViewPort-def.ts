namespace vw.features.sharedocument
{
    export interface IViewPort
    {
        //As IDocInfo.ID: string; is transfer/storing in this document field, keeping as it is just for compatibility.
        document: string;
        id: string;
        page: string;
        left: string;
        top: string;
        zoom: string;   //Global Zoom Factor
    }

    export interface IInitializableViewPort extends IViewPort
    {
        initialize(): void;
        getActiveZoom(): number;
        getActiveZoomPercentage(): number;
        //canZoomInFurther(z: number): boolean;
        //canZoomOutFurther(z: number): boolean;
    }
}