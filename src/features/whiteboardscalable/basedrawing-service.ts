namespace vw.features.scalablewhiteboard {
        
    export interface IBaseDrawService {
            // tool proerties...
        color: string
        thickness: number;
        compositeOperation: string;
    }

    export interface IInitializableDrawService extends IBaseDrawService
    {
        initialize(canvasBoard: HTMLCanvasElement): boolean;
        isInitialized(): boolean;
        isDrawing(): boolean;
        drawSketchAction(action: SketchAction): void;
        clearIntermediateDrawings(): void;
        clearFinalDrawings(): void;
    }
    export interface IInitializeDrawService extends IBaseDrawService {
        initialize(aDrawBoard: IStatusBoardScope): boolean;
        isInitialized(): boolean;
        isDrawing(): boolean;
        drawSketchAction(action: SketchAction): void;
        clearIntermediateDrawings(): void;
        clearFinalDrawings(): void;
    }
}