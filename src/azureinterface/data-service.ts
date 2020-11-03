namespace azureinterface.dataservice {
    export interface IdataService {
    }

    class DataService implements IdataService
    {
        constructor() { }

        public static instance(): DataService {
            return new DataService();
        }
    }
    DataService.$inject = [];
    angular.module('vw').factory('azureinterface.dataservice', DataService.instance);
}