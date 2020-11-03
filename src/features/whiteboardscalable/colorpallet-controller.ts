
namespace vw.features.scalablewhiteboard {

    export interface IColorPalletCtrl {
    }

    export interface IColorPalletScope extends ng.IScope {       
    }

    class ColorPalletCtrl implements IColorPalletCtrl {
        constructor(scope: IColorPalletScope) {        
        }
    }

    ColorPalletCtrl.$inject = ['$scope'];
    angular.module('vw').controller('features.scalablewhiteboard.ColorPalletCtrl', ColorPalletCtrl);
}