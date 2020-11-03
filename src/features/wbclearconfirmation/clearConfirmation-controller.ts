
module vw.features.scaleablewhiteboard {

    export interface IClearConfirmationScope extends ng.IScope {
        confirmClear: any;
        Yes(): void;
        No(): void;
    }

    class ClearConfirmationController {
        static $inject = ['$scope', '$uibModalInstance', 'data'];
        constructor($scope: IClearConfirmationScope, $modalInstance: any, data: any) {
            $scope.confirmClear = {
                serviceName: 'confirm Clear',
                userResponse: 'timeout'
            };

            $scope.Yes = function () {
                $modalInstance.close($scope.confirmClear);
            };
            $scope.No = function () {
                $modalInstance.dismiss();
            };
        }
    }

    angular
        .module('vw')
        .controller('vw.features.wbclearconfirmation.ClearConfirmationController', ClearConfirmationController);
} 