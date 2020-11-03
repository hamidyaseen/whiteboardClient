/// <reference path="ipageinfo.ts" />

namespace vw.features.sharedocument
{
    export interface IDocInfo {
        ID: string;
        Title: string;
        TotalPages: number;
        Locked: boolean;
        DateCreated: string;
        Pages:  IPageInfo[];
        poster: string;
    }
}