namespace vw.azureinterface {
    "use strict";
    //----------------- AZURE interface ------------------------
    export interface IConferenceRoomInfo {
        ID: string;
        Name: string;
        Active: boolean;
    }

    export interface ILocation {
        TimeZone: string;    // HYA as string
        Country: string;
        City: string;
        WeatherIconFile: string;
        WeatherTemperature: string;  // HYA, as string
    }

    export interface IOrganization {
        Name: string;
        Logo: string;
    }

    export interface IConfiguration {
        TimeoutAfterLiveSession?: number;
        Rooms?: IConferenceRoomInfo[];
        AutoConnectToRoom?: string; // this is ID of IConferenceRoomInfo from list , index of list would help a lot in client side
        ViewMode?: number;  // this View mode is Team View or Single View[Dua Mode]
        PrivacyLevel?: vw.azureinterface.PrivacyLevel; // rtc.PrivacyLevel;
        ConferenceVolume?: number;
        CommandResponse?: number;
        EventLog?: boolean;
        PrivacyAtReconnect?: boolean;
        AutoAcceptKnock?: boolean;
        Location?: ILocation;
        VwMode?: number;
        KnockTimeout?: number;
        AudioDevice?: string;
        VideoDevice?: string;

        // Auto-connection Mode
        AutoConnectMode?: number;
        AutoConnectTime?: string;
        DisconnectTime?: string;
        IncludeWeekend?: boolean;
    }

    export interface ISiteInfo {
        Name: string;
        UserName?: string;
        SiteName?: string;
        Organization?: IOrganization;
        Configuration: IConfiguration;
        //hya: New Adil have added them here
        Email?: string;
        Phone?: string;
        GUID?: string;
        ServerTimestamp?: string;
    }
}