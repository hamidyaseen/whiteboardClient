namespace vw.features.vwClient {
    export interface uuidWindow extends Window {
        uuidv4: () => string;
    }
}