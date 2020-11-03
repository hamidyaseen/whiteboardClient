
namespace vw.features.scalablewhiteboardparent {

    export interface IWhiteboardParentController extends ng.IController {
        roomList: vw.azureinterface.IConferenceRoomInfo[];
        currentRoom: vw.azureinterface.IConferenceRoomInfo;
        updateChangeRoom(): void;
    }

    class WhiteboardParentController implements IWhiteboardParentController {
        $onInit = () => { }
        private name: string;
        public roomList: vw.azureinterface.IConferenceRoomInfo[] = [];
        public currentRoom: vw.azureinterface.IConferenceRoomInfo = null;


        private isInRoom: boolean;

        constructor(private wbManagerScope: ng.IScope) {
            this.name = 'Whiteboard Controller';
            this.isInRoom = false;
            this.populateRoomsData();
        }

        public updateChangeRoom(): void {
            if (this.isInRoom) {
                this.wbManagerScope.$parent.$broadcast('CONF-ROOM-LEFT', this.currentRoom);
                this.wbManagerScope.$parent.$broadcast('CONF-ROOM-JOINED', this.currentRoom);
            }
            else {
                this.isInRoom = true;
                //this.wbManagerScope.$parent.$broadcast('SITE-ORGANIZATION', vwapp.components.logIn.getSiteInfo().Organization);
                this.wbManagerScope.$parent.$broadcast('CONF-ROOM-STANDALONE', this.currentRoom);
            }
        }

        private populateRoomsData(): void
        {
                vwapp.components.logIn.Init().then(() => {
                    vwapp.components.logIn.initUser().then(() => {
                        this.roomList = vwapp.components.logIn.getConfiguration().Rooms;
                        //this.currentRoom = vwapp.logIn.getConfiguration().Rooms[0];
                        this.currentRoom = vwapp.components.logIn.getStandaloneRoom();
                        // this.isInRoom = true;
                        this.wbManagerScope.$applyAsync();
                        //this.wbManagerScope.$parent.$broadcast('CONF-ROOM-STANDALONE', this.currentRoom);
                        this.wbManagerScope.$parent.$broadcast('SITE-ORGANIZATION', vwapp.components.logIn.getSiteInfo().Organization);

                    },
                        (message: string) => { alert('Failed to initialize user ' + message); });
                }, (message: string) => { alert('Failed to login ' + message); });
        }
    }

    WhiteboardParentController.$inject = ['$scope'];

    angular
        .module('vw')
        .controller('vw.features.scalablewhiteboardparent.WhiteboardParent', WhiteboardParentController);
}