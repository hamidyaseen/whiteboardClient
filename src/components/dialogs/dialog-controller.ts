
module vw.components {
    'use strict';

    export interface IDialogScope extends ng.IScope {
        launch(type: string, dialogData: any): void;
    }
    export interface IDialogController extends ng.IController { }

    class DialogsController implements IDialogController {
        $onInit = () => { }
        siteName: string;
        message: string;

        private dlg: any;
        networkErrorDlg: any;
        knockDlg: any;
        knockResponseDlg: any;
        noMultimediaDeviceDlg: any = null;
        themeIndex: number;        // reportNetworkProblem: boolean;

       constructor(private $scope: ng.IScope, // private storage: ng.localStorage.ILocalStorageService,
            private $rootScope: ng.IRootScopeService, private $dialogs: any
            // , private world: vw.services.IWorldService,
            //private snapService: vw.services.ISnapService,
            //private snapshotService: vw.services.ISnapshotService,
            //private assetsInfo: vw.services.IAssetInfo,
            //private log: vw.services.ILogService    
       )

        {
            this.siteName = "";
            //this.reportNetworkProblem = true;
            this.themeIndex = 0;

            this.dlg = null;
            this.networkErrorDlg = null;
            this.knockDlg = null;
            this.knockResponseDlg = null;
            //this.askDelTeamMemberDlg = null;

            //$scope.$on('auto-connect', () => {
            //    this.launch('AutoConnectPrompt', null)
            //});

            // App ready event broadcast siteName to set it here.
            $scope.$on('SITE-NAME', (event, name: string) => {
                this.siteName = name;
            });
            $scope.$on('FRESHUP-WEATHER', () => {  //console.log('Need to fresh up weather information...');
                this.getWeatherInformation();
            });

            $scope.$on('YES-DELETE-ALL-SNAPS', () => {
                this.launch('ClearSnapsInEmailToTeamMembers', {});
            });

            //$scope.$on('EmailSnaps', (event, snapId:string) => {
            //    this.launch('emailToTeamMembers', {emailSnapId: snapId, fromName: this.siteName});
            //});
            $scope.$on('SNAP-TO-EMAIL', (event, snapId: string) => {
                this.launch('emailToTeamMembers', { emailSnapId: snapId, fromName: this.siteName });
            });
            //$scope.$on('NO-MULTIMEDIA-DEVICE', (event, dType: string) => {
            //    this.log.missingMultimediaDevice(dType);
            //    this.launch('noMultimediaDevice', { deviceType: dType});
            //});
            //$scope.$on('ASK_AND-DELETE', (event, members: vw..rtc.TeamMember[], index: number, id: string) => {
            //    this.launch('ConfirmBeforeDelete', { teamMembers: members, memberIndex: index, assetID: id });
            //});

            $scope.$on('NETWORK-REQUEST-ERRORED', () => { this.launch('NETWORK-REQUEST-ERRORED', null); });
            $scope.$on('NETWORK-REQUEST-OK', () => { this.launch('NETWORK-REQUEST-OK', null); });

            $scope.$on('requestErrorRecovered', () => {
                if (this.networkErrorDlg) {
                    this.networkErrorDlg.dismiss();
                }
            });

            $scope.$on('CLEAR_WHOLE_WHITEBOARD', (event) => {
                this.launch('CLEAR_WHOLE_WHITEBOARD', {});
            });

            //rtcServer.addServerListener(this);
            $scope.$on('$destroy', () => {
                // rtcServer.removeServerListener(this);
            });
        }
        //public logknockResult(name: string, result: string): void {
        //    this.log.participantKnockedResult(name, result);
        //}

        //roomJoined(room: vw.services.rtc.IConferenceRoom) {
        //    room.addConferenceRoomListener(this);
        //}       

        public launch(type: string, dialogData: any): void {
            var self = this;

            switch (type) {              
                case 'NETWORK-REQUEST-ERRORED':
                    //{
                    //    if (this.networkErrorDlg)
                    //        return;

                    //    this.log.networkIssueEncounter();
                    //    // if (this.reportNetworkProblem) {
                    //        var txt = $('<Div />').html('Network issue encountered.<br> Will automatically reconnect as network is re-established.').html();
                    //        this.networkErrorDlg = this.$dialogs.error(txt);
                    //        this.networkErrorDlg.result.then(() => {
                    //            //this.reportNetworkProblem = false;
                    //            this.$scope.$parent.$broadcast('DONOT-REJOIN-ROOM');
                    //            this.networkErrorDlg = null;                                
                    //            },
                    //            () => {
                    //                this.networkErrorDlg = null;
                    //            });
                            
                    //    //}
                    //    break;
                    //}
                case 'AutoConnectPrompt':
                    //{
                    //    if (this.dlg)
                    //        return;

                    //    this.dlg = this.$dialogs.create( 'features/autoConnect/autoConnect.html', 'vw.features.AutoConnectController',
                    //        { roomList: vwapp.globalLogin.siteInfo.Configuration.Rooms, roomIndex: vwapp.globalLogin.getAutoConnectRoomIndex() },
                    //        { key: false, back: 'static' }
                    //        );
                    //    this.dlg.result.then((autoConnectingResult) => {
                    //        this.dlg = null;
                    //        APP.server.joinRoom(autoConnectingResult.aRoomID);
                    //    },
                    //        () => {
                    //            APP.server.setStandaloneAppMode();
                    //            this.message = 'keeps previous default.';
                    //            this.dlg = null;
                    //        });
                    //    break;
                    //}
                case 'conferenceRoomSettings':
                    //{
                    //    if (this.dlg)
                    //        return;

                    //    var configuration: rtc.IConfiguration = vwapp.globalLogin.getConfiguration();
                    //    var inData = { roomsList: configuration.Rooms, autoConnectRoomIndex: vwapp.globalLogin.getAutoConnectRoomIndex(),conferenceVolume: configuration.ConferenceVolume };
                    //    var rtcServer: vw.rtc.IServer = APP.server;
                    //    if (rtcServer.isRoomJoined() && rtcServer.currentRoom()) {
                    //        inData.conferenceVolume = rtcServer.currentRoom().audioLevel;
                    //    }

                    //    this.dlg = this.$dialogs.create('features/connectionSettings/connectionSettings.html', 'vw.features.ConnectionSettingsController', inData, { key: false, back: 'static' });
                    //    this.dlg.result.then((sResult) =>
                    //    {
                    //        this.dlg = null;
                    //        var needToUpdate = false;
                    //        var newSiteInfo: vw.rtc.ISiteInfo = { "Name": vwapp.globalLogin.siteInfo.Name, "Configuration": {} };
                    //        var theIndex = -1;
                    //        if (sResult.autoConferenceRoom == null && sResult.autoConferenceRoom != configuration.AutoConnectToRoom)
                    //        {
                    //            // if configuration doesnot have already null...                                
                    //            $.extend(newSiteInfo.Configuration, { "AutoConnectToRoom": 0 });
                    //            needToUpdate = true;                                
                    //        }
                    //        else if (typeof (sResult.autoConferenceRoom) == 'undefined') {
                    //            $.extend(newSiteInfo.Configuration, { "AutoConnectToRoom": 0 });
                    //            needToUpdate = true;
                    //        }
                    //        else if (sResult.autoConferenceRoom && sResult.autoConferenceRoom.ID != configuration.AutoConnectToRoom)
                    //        {                                
                    //            angular.forEach(inData.roomsList, (room: any, index: number) => {
                    //                if (room.ID === sResult.autoConferenceRoom.ID)
                    //                    theIndex = index;
                    //            });
                    //            $.extend(newSiteInfo.Configuration, { "AutoConnectToRoom": sResult.autoConferenceRoom.ID });
                    //            needToUpdate = true;
                    //        }

                    //        //var roomData = { "Name": vwapp.globalLogin.siteInfo.Name, "ConferenceVolume": null };                            
                    //        if (inData.conferenceVolume !== sResult.volume) {   // rtcServer.currentRoom().audioLevel) {
                    //            if (rtcServer && rtcServer.isRoomJoined())
                    //                rtcServer.currentRoom().audioLevel = sResult.volume;
                    //            $.extend(newSiteInfo.Configuration, { "ConferenceVolume": sResult.volume });
                    //            needToUpdate = true;
                    //        }
                    //        if (needToUpdate)
                    //            this.updateUserData(newSiteInfo);

                    //        if (!(APP.server.isRoomJoined() || APP.server.isInConference()) && !APP.server.isPreparingToJoin())
                    //            APP.server.setStandaloneAppMode();
                    //    },
                    //        () => {
                    //            this.message = 'keeps previous default.';
                    //            this.dlg = null;
                    //        });
                    //    break;
                    //}
                case 'guestBaseState-knockTo-Reception':
                    //{
                    //    if (this.dlg)
                    //        return;
                    //    this.dlg = this.$dialogs.create('features/guestFace/knockToReception.html',
                    //        'vw.features.guestFace.KnockToReceptionController', { myDisplayName: this.siteName }, {
                    //            key: false,
                    //            back: 'static'
                    //        });
                    //    this.dlg.result.then((knockToParticipantResult) => {
                    //        //if (knockToParticipantResult.hasknockedToAny)
                    //        //    this.$scope.$emit('LiftPrivacyEvent');
                    //        this.dlg = null;
                    //    },
                    //        () => {
                    //            this.message = 'keeps previous default.';
                    //            this.dlg = null;
                    //        });
                    //    break;
                    //}
                case 'knockToParticipant':
                    //{
                    //    if (this.dlg)
                    //        return;
                    //    this.dlg = this.$dialogs.create('features/knock/knockToParticipant.html',
                    //        'vw.features.knock.KnockToParticipantsController', { myDisplayName: this.siteName }, {
                    //            key: false,
                    //            back: 'static'
                    //        });
                    //    this.dlg.result.then((knockToParticipantResult) => {
                    //        //if (knockToParticipantResult.hasknockedToAny)
                    //        //    this.$scope.$emit('LiftPrivacyEvent');
                    //        this.dlg = null;
                    //    },
                    //        () => {
                    //            this.message = 'keeps previous default.';
                    //            this.dlg = null;
                    //        });
                    //    break;
                    //}
                case 'knockToResponse':
                    //{
                    //    if (this.knockDlg)
                    //        return;

                    //    if (!dialogData.isItMyOwnRequest) // if I self requested to knock me ... then knocking sound look awkward
                    //        this.$scope.$broadcast('START-VOICE', 'resources/sounds/common/KnockReceived.mp3', true);

                    //    this.knockDlg = this.$dialogs.create('features/knock/knockToResponse.html',
                    //        'vw.features.knock.KnockToResponseController', dialogData, { key: false, back: 'static' });
                    //    this.knockDlg.result.then((knockConfirmResult) => {
                    //        this.$scope.$broadcast('STOP-VOICE');
                    //        if (knockConfirmResult.userResponse === 'accepted') {
                    //            APP.server.liftPrivacy();
                    //            //APP.server.currentRoom().setLocalMemberAttributes({ privacyLevel: APP.server.supportedPrivacyLevels.None });
                    //            if (this.dlg) // close the other dialog if it on top, which is default in VR Guest mode...
                    //                this.dlg.close();
                    //        }
                    //        this.knockDlg = null;
                    //    },
                    //        () => {
                    //            this.message = 'keeps previous default.';
                    //            this.knockDlg = null;
                    //        });
                    //    break;
                    //}
                case 'knockResult':
                    //{
                    //    this.log.participantKnockedResult(dialogData.knockResultFromName, dialogData.knockResultAction);

                    //    if (this.knockResponseDlg)
                    //        return;
                    //    this.knockResponseDlg = this.$dialogs.create('features/knock/knockResponse.html',
                    //        'vw.features.knock.KnockResponseController', dialogData, { key: false, back: 'static' });
                    //    this.knockResponseDlg.result.then(() => { this.knockResponseDlg = null; },
                    //        () => {
                    //            this.message = 'keeps previous default.';
                    //            this.knockResponseDlg = null;
                    //        });
                    //    break;
                    //}
                case 'CLEAR_WHOLE_WHITEBOARD':
                    {
                        if (this.dlg)
                            return;

                        this.dlg = this.$dialogs.create('features/wbclearconfirmation/clearConfirmation.html',
                            'vw.features.wbclearconfirmation.ClearConfirmationController', dialogData, { key: false, back: 'static' });
                        this.dlg.result.then(() => {
                            //$('#DrawingBoard').clearDrawing();
                            this.$scope.$broadcast('YES_CLEAR_WHOLE_WHITEBOARD');
                            this.dlg = null;
                        },
                            () => {
                                this.message = 'keeps previous default.';
                                this.dlg = null;
                            });
                        break;
                    }
                //case 'ConfirmBeforeDelete':
                //    {
                //    if (this.askDelTeamMemberDlg)
                //        return;
                //    this.askDelTeamMemberDlg = this.$dialogs.create('features/askConfirmation/askDeleteConfirmation.html',
                //        'vw.features.askConfirmation.AskDeleteConfirmationController', dialogData, { key: false, back: 'static' });
                //    this.askDelTeamMemberDlg.result.then((member: vw.rtc.ITeamMember) => {

                //        if (dialogData.teamMembers && dialogData.memberIndex >= 0)
                //            dialogData.teamMembers.splice(dialogData.memberIndex, 1);
                //        else if (dialogData.assetID)
                //            this.assetsInfo.deleteDocument(dialogData.assetID);
                //        else
                //            console.log('--- No Document/ team meber to remove ----');

                //         //$scope.teamMembers.splice(index, num);
                //              },
                //        () => {
                //            this.message = 'keeps previous default.';                        
                //        });
                //        this.askDelTeamMemberDlg = null;
                //    break;
                //}
                case 'noMultimediaDevice':
                    //{
                    //    if (this.noMultimediaDeviceDlg)
                    //        return;
                    //    this.noMultimediaDeviceDlg = this.$dialogs.create('features/multimediaDevice/multimediaDevice.html',
                    //        'vw.features.multimediaDevice.multimediaDeviceController', dialogData, { key: false, back: 'static' });
                    //    this.noMultimediaDeviceDlg.result.then(() => {

                    //    //    if (dialogData.teamMembers && dialogData.memberIndex >= 0)
                    //    //        dialogData.teamMembers.splice(dialogData.memberIndex, 1);
                    //    //    else if (dialogData.assetID)
                    //    //        this.assetsInfo.deleteDocument(dialogData.assetID);
                    //    //    else
                    //    //        console.log('--- No Document/ team meber to remove ----');
                    //    // //$scope.teamMembers.splice(index, num);
                    //    //      },
                    //    //() => {
                    //    //    this.message = 'keeps previous default.';                        
                    //        });

                    //    this.noMultimediaDeviceDlg = null;

                    //    break;
                    //}
                case 'snapshot':
                    //{
                    //    if (this.dlg)
                    //        return;
                    //    var wbMode: boolean = APP.server.isRoomJoined() ? (APP.server.currentRoom().whiteboardMode == APP.server.supportedWhiteboardMode.ON) : (APP.server.getConferenceInitializer().initialWhiteboardMode == APP.server.supportedWhiteboardMode.ON);                        
                    //    //////this.snapshotService.grabSnap(wbMode);
                    //    ////this.snapshotService.takeSnap(wbMode).then(() => {
                    //    ////    console.log('snapshot taken now');
                    //    ////    if (this.dlg)
                    //    ////        this.dlg.close();
                    //    ////},
                    //    ////    () => { });
                    //    //var canvases = this.snapshotService.composeSnapToGallery(wbMode, APP.server.isRoomJoined() ? APP.server.isDSModeON() : false);
                    //    //if (canvases != null) {
                    //    //    console.log('snapshot taken now');                            
                    //    //}
                    //    this.snapshotService.composeSnapToGallery(wbMode, APP.server.isRoomJoined() ? APP.server.isDSModeON() : false, (result: boolean) => {
                    //        if (result) {
                    //            console.log('snapshot taken now');

                    //            this.dlg = this.$dialogs.create('features/snapGrabbing/snapGrabbing.html',
                    //                'vw.features.snapGrabbing.snapGrabbingController', dialogData, { key: false, back: 'static' });
                    //            this.dlg.result.then(() => {
                    //                this.dlg = null;
                    //            },
                    //                () => {
                    //                    this.message = 'keeps previous default.';
                    //                    this.dlg = null;
                    //                });
                    //        }                          
                    //    });
                        
                    //    break;
                    //}
                case 'ClearSnapsInEmailToTeamMembers':
                    //{
                    //    if (this.dlg) {
                    //        APP.server.currentRoom().clearConferenceSnaps();
                    //        this.dlg.dismiss('canceled');
                    //    }
                    //    break;
                    //}
                case 'emailToTeamMembers':
                    //{
                    //    if (this.dlg)
                    //        return;
                    //    this.dlg = this.$dialogs.create('features/emailSnaps/emailSnaps.html', 'vw.features.emailSnaps.EmailSnapsController', dialogData,
                    //        { key: false,  back: 'static' });
                    //    this.dlg.result.then((emailResult: vw.features.emailSnaps.IEmailDataInfo) => {
                    //        this.dlg = null;
                    //        emailResult.attachments.forEach((img: vw.features.emailSnaps.IImageInfo) => {
                    //            img.location = APP.server.currentRoom().getConferenceSnap(img.name, false);
                    //        });
                    //        var jsonData = JSON.stringify(JSON.stringify(emailResult));
                    //        $.ajax({
                    //            type: 'post',
                    //            url: 'api/email',
                    //            data: jsonData,
                    //            contentType: 'application/json;chracterset=utf-8'
                    //        }).done(function (data) {
                    //            $('#resultStatus').text(data);
                    //        });
                    //    },
                    //        () => {
                    //                // dialog is closed...
                    //            this.message = 'keeps previous default.';
                    //            this.dlg = null;
                    //        });
                    //    break;
                    //}
                case 'documentSelecction':
                    //{
                    //    if (this.dlg)
                    //        return;
                    //    this.dlg = this.$dialogs.create('features/documentSharing/documentSelection.html','vw.features.documentSharing.DocumentSelectionController', dialogData,
                    //        { key: false, back: 'static' });
                    //    this.dlg.result.then((docResult: any) => {
                    //        this.dlg = null;
                    //        var dsElement: ng.IAugmentedJQuery = angular.element(document.getElementById('sharedDocumentView'));
                    //        if (dsElement)
                    //            dsElement.controller("").$scope.$broadcast('SELECTED_DOC', docResult.selectedDocument, docResult.pinCodeText);
                    //    }, () => {
                    //            // dialog is closed...
                    //            this.message = 'keeps previous default.';
                    //            this.dlg = null;
                    //        });
                    //    break;
                    //}
                //case 'socialInfo':
                //    {
                //        if (this.dlg)
                //            return;
                //        this.dlg = this.$dialogs.create('features/socials/socialInformation.html',
                //            'vw.features.socials.socialInfromationController', {}, { key: false, back: 'static' });
                //        this.dlg.result.then(() => {
                //            this.dlg = null;
                //        },
                //            () => {
                //                this.message = 'keeps previous default.';
                //                this.dlg = null;
                //            });
                //        break;
                //    }
                case 'socialTeam':
                    //{
                    //    if (this.dlg)
                    //        return;
                    //    this.dlg = this.$dialogs.create('features/socials2/socialTeam.html',
                    //        'vw.features.socials2.SocialTeamController', {}, { key: false, back: 'static' });
                    //    this.dlg.result.then(() => {
                    //        this.dlg = null;
                    //    },
                    //        () => {
                    //            this.message = 'keeps previous default.';
                    //            this.dlg = null;
                    //        });
                    //    break;
                    //}
                case 'settings': {
                    //if (this.dlg)
                    //    return;

                    //// Logically we should create a new copy of configuration and forward to settings dialogs service
                    //// afterward just compare and see the user changes and update only the changes...
                    //var siteInfo: vw.rtc.ISiteInfo = vwapp.globalLogin.siteInfo;

                    //dialogData.site = siteInfo.SiteName;
                    //dialogData.city = this.world.insertSpace(siteInfo.Configuration.Location.City);
                    //dialogData.countryName = this.world.validateCountry(siteInfo.Configuration.Location.Country);
                    //dialogData.countryIndex = this.world.getCountryIndex(dialogData.countryName);
                    //dialogData.temperature = siteInfo.Configuration.Location.WeatherTemperature;
                    //dialogData.icon = siteInfo.Configuration.Location.WeatherIconFile;
                    //dialogData.privacyAtReconnect = siteInfo.Configuration.PrivacyAtReconnect; //  this.privacyAtReconnect;
                    //dialogData.commandResponseIndex = siteInfo.Configuration.CommandResponse; //  this.themeIndex;
                    //dialogData.viewModeIndex = siteInfo.Configuration.ViewMode; // this.viewModeIndex;
                    //dialogData.videoTextMode = self.isVideoInTextMode;
                    //dialogData.appModeIndex = siteInfo.Configuration.VwMode;
                    //dialogData.resolutionIndex = -1;
                    //APP.server.supportedResolutions.forEach((value: services.IVideoResolution, index: number) => {
                    //    if (value.name === APP.server.getResolution())
                    //        dialogData.resolutionIndex = index;
                    //});

                    //this.dlg = this.$dialogs.create('features/vwsettings/vwSettings.html', 'vw.features.vwsettings.vwSettingsController', dialogData,
                    //    { key: false, back: 'static' });
                    //this.dlg.result.then(
                    //    (settingResult) => {
                    //        this.dlg = null;

                    //        if (settingResult.vResolution != APP.server.getResolution())
                    //            APP.server.setResolution(settingResult.vResolution.name);


                    //        var currentRoom = APP.server.currentRoom();
                    //        var localMemberAttributes: vw.rtc.IMemberAttributes = {};

                    //        // if would update the information if it is really changed weatherService.addDisplayNameDataToPresence();
                    //        var needToUpdate = false, needToRearrange = false;
                    //        var newSiteInfo: vw.rtc.ISiteInfo = { "Name": siteInfo.Name, "Configuration": {} };

                    //        var tIndex = (settingResult.commandFeedback == APP.server.supportedCommandResponseModeDescip[1]) ? 1 : 0;
                    //        if (this.themeIndex !== tIndex) {
                    //            this.themeIndex = tIndex;
                    //            //this.storage.set("commandResponseIndex", this.themeIndex);
                    //            this.$rootScope.$broadcast('setCommandResponse', this.themeIndex);
                    //            $.extend(newSiteInfo.Configuration, { "CommandResponse": this.themeIndex });
                    //            needToUpdate = true;
                    //        }

                    //        if (settingResult.viewMode !== siteInfo.Configuration.ViewMode) {
                    //            //this.storage.set("viewModeIndex", settingResult.viewMode);
                    //            $.extend(newSiteInfo.Configuration, { "ViewMode": settingResult.viewMode });
                    //            needToUpdate = true;
                    //            needToRearrange = true;
                    //        }

                    //        if (settingResult.siteName !== siteInfo.SiteName) { //  this.siteName) {
                    //            //this.siteName = settingResult.siteName;
                    //            needToUpdate = true;
                    //            //this.storage.set('siteName', settingResult.siteName);
                    //            //siteInfo.SiteName = settingResult.siteName;
                    //            $.extend(newSiteInfo, { "SiteName": settingResult.siteName });
                    //            this.$scope.$parent.$broadcast('SITE-NAME', settingResult.siteName);
                    //            localMemberAttributes.name = settingResult.siteName;
                    //            vwapp.vwStrophePlugin.setDisplayNameToPresence(settingResult.siteName);
                    //            //vw.services.rtc.stropheVWPlugin.setDisplayNameToPresence(settingResult.siteName);
                    //        }


                    //        if (settingResult.autoPrivacy !== siteInfo.Configuration.PrivacyAtReconnect) {
                    //            $.extend(newSiteInfo.Configuration, { "PrivacyAtReconnect": settingResult.autoPrivacy });
                    //            needToUpdate = true;
                    //        }

                    //        if (settingResult.pLevel !== siteInfo.Configuration.PrivacyLevel) {
                    //            $.extend(newSiteInfo.Configuration, { "PrivacyLevel": settingResult.pLevel });
                    //            needToUpdate = true;
                    //            if (currentRoom && currentRoom.getLocalMember().isPrivacyEnabled())
                    //                currentRoom.setLocalMemberAttributes({ privacyLevel: settingResult.pLevel });
                    //        }

                            
                    //        if (siteInfo.Configuration.AudioDevice != settingResult.aSource.label) {
                    //            APP.server.deviceInfo.setAudioDevice(settingResult.aSource);                                
                    //            $.extend(newSiteInfo.Configuration, { "AudioDevice": settingResult.aSource.label });
                    //            needToUpdate = true;
                    //        }

                    //        if (siteInfo.Configuration.VideoDevice != settingResult.vSource.label) {
                    //            APP.server.deviceInfo.setVideoDevice(settingResult.vSource);
                    //            $.extend(newSiteInfo.Configuration, { "VideoDevice": settingResult.vSource.label });
                    //            needToUpdate = true;
                    //        }



                    //        var vrAppModes = ['VW', 'VR host', 'VR guest'];
                    //        if (vrAppModes.indexOf(settingResult.appMode, 0)+1 !== siteInfo.Configuration.VwMode) {
                    //            $.extend(newSiteInfo.Configuration, { "VwMode": vrAppModes.indexOf(settingResult.appMode, 0) + 1});
                    //            needToUpdate = true;
                    //        }

                    //        if (settingResult.videoTextMode != self.isVideoInTextMode) {
                    //            self.isVideoInTextMode = settingResult.videoTextMode;
                    //        }

                    //        if (needToUpdate)
                    //            this.updateUserData(newSiteInfo);
                    //        if (needToRearrange)
                    //            $(document).trigger('rearrangeView', [settingResult.viewMode]);

                    //        if (settingResult.OWlocationData) {
                    //            this.setWeatherInformation(settingResult.OWlocationData);

                    //            //vwapp.globalLogin.saveLocation(settingResult.OWlocationData);
                                
                    //            //siteInfo.Configuration.Location.City = this.worldService.removeSpace(settingResult.OWlocationData.City);                                
                    //            //siteInfo.Configuration.Location.Country = settingResult.OWlocationData.Country; // settingResult.countryName;
                    //            //siteInfo.Configuration.Location.WeatherTemperature = settingResult.siteTemperature;
                    //            //siteInfo.Configuration.Location.WeatherIconFile = settingResult.siteTemperatureIcon;

                    //            //this.$scope.$parent.$broadcast('FRESH-WEATHER-INFO', siteInfo.Configuration.Location.City, settingResult.siteTemperature, settingResult.siteTemperatureIcon);

                    //            ////var locationData: vw.rtc.ILocation = settingResult.OWlocationData;
                    //            //localMemberAttributes.location = {
                    //            //    country: settingResult.OWlocationData.Country ,
                    //            //    city: siteInfo.Configuration.Location.City,
                    //            //    timeZone: siteInfo.Configuration.Location.TimeZone,
                    //            //    timeOffset: new Date().getTimezoneOffset(),
                    //            //    weatherIcon: settingResult.OWlocationData.WeatherIconFile,
                    //            //    temperature: settingResult.OWlocationData.WeatherTemperature,
                    //            //};
                    //            localMemberAttributes.location = {
                    //                country: vwapp.globalLogin.siteInfo.Configuration.Location.Country,
                    //                city: vwapp.globalLogin.siteInfo.Configuration.Location.City,
                    //                timeZone: vwapp.globalLogin.siteInfo.Configuration.Location.TimeZone,
                    //                timeOffset: new Date().getTimezoneOffset(),
                    //                weatherIcon: vwapp.globalLogin.siteInfo.Configuration.Location.WeatherIconFile,
                    //                temperature: vwapp.globalLogin.siteInfo.Configuration.Location.WeatherTemperature,
                    //                };
                    //        }

                    //        //if (currentRoom && !_.isEmpty(localMemberAttributes)) {
                    //        //    currentRoom.setLocalMemberAttributes(localMemberAttributes);
                    //        //}
                    //        if (currentRoom && APP.server.isRoomJoined() && APP.server.isInConference())
                    //        {
                    //            // if going to reconnect the conference, then no need to set conference attributes... just setin login service
                    //            if (settingResult.applyNu) {
                    //                APP.server.leaveRoom();
                    //                APP.server.joinRoom(currentRoom.id);
                    //            }                                
                    //            if (typeof (localMemberAttributes) != 'undefined' && localMemberAttributes != null)
                    //                currentRoom.setLocalMemberAttributes(localMemberAttributes);
                    //        }
                    //        this.$scope.$parent.$broadcast('updateToPresence');
                    //    },
                    //    () => {
                    //        this.message = 'keeps previous default.';
                    //        this.dlg = null;
                    //    });

                    break;
                }
                default:
                    break;
            }
        }

        // To set the conference video view mode on conference or on the conferenceRoomInitializer... 
        set isVideoInTextMode(textMode: boolean) {
            //var currentRoom = APP.server.currentRoom();
            ////var VV_Mode = textMode ? vw.services.rtc.VideoViewMode.TEXT_VIEW : vw.services.rtc.VideoViewMode.FLIPPED_VIEW;
            //var vvm = textMode ? APP.server.supportedVideoViewModes.TEXT_VIEW : APP.server.supportedVideoViewModes.FLIPPED_VIEW;
            //if (currentRoom)
            //    currentRoom.videoViewMode = vvm;

            //APP.server.getConferenceInitializer().initialVideoViewMode = vvm;
            ////vw.rtc.conferenceInitializer.initialVideoViewMode = vvm;
            ////vw.services.rtc.conferenceRoomInitializer.initialVideoViewMode = VV_Mode;
        }

        // To detect conference video view mode from confernece or from conference 
        get isVideoInTextMode(): boolean {
            //var currentRoom = APP.server.currentRoom();
            //var isVTM = (currentRoom) ? APP.server.currentRoom().videoViewMode : APP.server.getConferenceInitializer().initialVideoViewMode;
            //return (isVTM === APP.server.supportedVideoViewModes.TEXT_VIEW);
            return true;
        }

        private updateUserData = (aSiteInfo: vw.azureinterface.ISiteInfo) => {
            //vwapp.globalLogin.siteInfo = aSiteInfo;
            //this.directoryService.saveSiteInfo(userData);
        };
        private setWeatherInformation(OWlocationData: any): void {
            //vwapp.globalLogin.saveLocation(OWlocationData);

            //var location = vwapp.globalLogin.siteInfo.Configuration.Location;

            //location.City = this.world.removeSpace(OWlocationData.City);
            //location.Country = OWlocationData.Country;
            //location.WeatherTemperature = OWlocationData.WeatherTemperature;
            //location.WeatherIconFile = OWlocationData.WeatherIconFile; //this.checkFileExtension(locale.WeatherIconFile);

            //this.$scope.$parent.$broadcast('FRESH-WEATHER-INFO', location.City, location.WeatherTemperature, location.WeatherIconFile);
        }

        private getWeatherInformation(): void {
            //var statusCode = null;
            //var locationResponse = '';
            ////var OWlocationData = null;
            //if (vwapp.globalLogin.siteInfo && vwapp.globalLogin.siteInfo.Configuration) {
            //    var location = vwapp.globalLogin.siteInfo.Configuration.Location;
            //    var i = location.City.lastIndexOf(',');
            //    var inCity: string = (i > 0) ? location.City.substring(0, i) : location.City;
            //    var inCountry: string = (i > 0) ? location.City.substring(i + 1) : location.Country; // .country.shortName;
            //    var combined: string = inCity + ',' + inCountry;

            //    vwapp.globalLogin.searchLocation('search=' + combined).then((newLocationInfo: any) => {
            //    newLocationInfo.WeatherTemperature = Math.round(parseFloat(newLocationInfo.WeatherTemperature)).toString();
            //    console.log('New weather information at ' + new Date() + ' is ' + newLocationInfo.City + ' & ' + newLocationInfo.Country);
            //    // if found the same city otherwise no location and weather to update
            //    if (newLocationInfo.City.toUpperCase() == inCity.toUpperCase()) {
            //        this.setWeatherInformation(newLocationInfo);
            //        //scope.settingsInfo.cityName = newLocation.City;
            //        //scope.settingsInfo.siteTemperature = newLocation.WeatherTemperature;
            //        //scope.settingsInfo.siteTemperatureIcon = this.checkFileExtension(newLocation.WeatherIconFile);
            //        //scope.settingsInfo.countryName = this.world.getCountryName(newLocation.Country);
            //    }
            //    else if (this.world.getCountryIndex(newLocationInfo.Country) > 0) {
            //        this.setWeatherInformation(newLocationInfo);
            //        //    //scope.settingsInfo.cityName = locale.City;
            //        //    scope.settingsInfo.siteTemperature = newLocation.WeatherTemperature;
            //        //    scope.settingsInfo.siteTemperatureIcon = this.checkFileExtension(newLocation.WeatherIconFile);
            //        //    scope.settingsInfo.countryName = newLocation.City + ',' + this.world.getCountryName(newLocation.Country);
            //    }
            //    },
            //        (locale: vw.rtc.ILocation) => { });
            //}
        }
    }

    DialogsController.$inject = ['$scope',  '$rootScope', 'dialogs']; //'storage',
        //    , 'vw.services.WorldService'
        //    , 'vw.services.snapService'
        //    , 'vw.services.snapshortService'
        //    , 'vw.services.AssetInfoService'
        //    , 'vw.services.logService'


    angular
        .module('vw')
        .controller('vw.components.DialogsController', DialogsController);

    angular
        .module('vw')
        .config(['dialogsProvider', (dialogsProvider): void => {
            //dialogsProvider.useBackdrop('static');
            //dialogsProvider.useEscClose(false);
            //dialogsProvider.useCopy(false);
            dialogsProvider.useClass('fade');
            //dialogsProvider.setSize('sm');
        }]);
}
