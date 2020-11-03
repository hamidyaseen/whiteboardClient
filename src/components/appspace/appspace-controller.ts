
namespace vw.components
{
    export interface IAppSpaceScope extends ng.IScope {
        appTop: number;
        appLeft: number;
        appWidth: number;
        appHeight: number;

        rightBarWidth: number;
        rightBarHeight: number;
        leftBarWidth: number;
        leftBarHeight: number;

        sTop: number;
        sLeft: number;
        sWidth: number;
        sHeight: number;

        scaleFactor: number;
        maxWidth: number;
        maxHeight: number;
        maxTop: number;
        maxLeft: number;

        isDesktopView(): boolean;
        isTabletView(): boolean;
        isPhoneView(): boolean;
    }

    interface IAppSpaceController extends ng.IController {
    }

    class AppSpaceController implements IAppSpaceController
    {
        $onInit = () => { }
        public name: string = 'SharedScope';
        private deviceSize: string = "";
        private preDeviceSize: string = "";

        constructor(private appScope: vw.components.IAppSpaceScope, private $window: ng.IWindowService)
        {            
            $(window).on('resize.sharedSpace', () => { this.spaceChanged(); });
            this.spaceChanged();
            appScope.$on('$destroy', () => $(window).off('resize.sharedSpace'));

            appScope.isDesktopView = (): boolean => { return (this.deviceSize == "FullHD" || this.deviceSize == "LargeDesktop" || this.deviceSize == "MediumDesktop"); }
            appScope.isTabletView = (): boolean => {  return (this.deviceSize == "Tablet"); }
            appScope.isPhoneView = (): boolean => {  return (this.deviceSize == "Phone" || this.deviceSize == "ExtraSmallPhone"); }
        }

        private spaceChanged(): void
        {
            let borderPixes = 0;
            let w = 120;
            let h = 120;

            this.appScope.appTop = 0;
            this.appScope.appLeft = 0;
            this.deviceSize = this.getAppWindowSize();

            if (this.deviceSize == "FullHD") { }
            else {
                borderPixes = 2;
                w = this.$window.innerWidth / 16;
                h = this.$window.innerHeight / 9;
            }
            let appScale = Math.floor(w > h ? h : w);
            this.appScope.appWidth = appScale * 16 + borderPixes;
            this.appScope.appHeight = appScale * 9 + borderPixes;
            this.appScope.appTop = Math.floor((this.$window.innerHeight - this.appScope.appHeight) / 2);
            this.appScope.appLeft = Math.floor((this.$window.innerWidth - this.appScope.appWidth) / 2);
            $(".top-level-container").css({
                left: this.appScope.appLeft + 'px',
                top: this.appScope.appTop + 'px',
                width: this.appScope.appWidth + 'px',
                height: this.appScope.appHeight + 'px'
            });

            //$(".logo-block").removeClass(this.preDeviceSize).addClass(this.deviceSize);
            //$(".localetime-block").removeClass(this.preDeviceSize).addClass(this.deviceSize);
            //$(".weather-block").removeClass(this.preDeviceSize).addClass(this.deviceSize);
            //$(".locale-div").removeClass(this.preDeviceSize).addClass(this.deviceSize);

            //$(".connectname-block").removeClass(this.preDeviceSize).addClass(this.deviceSize);
            //$(".connectstate-block").removeClass(this.preDeviceSize).addClass(this.deviceSize);
            //$(".dropMenu-block").removeClass(this.preDeviceSize).addClass(this.deviceSize);
            //$(".devices-block").removeClass(this.preDeviceSize).addClass(this.deviceSize);
            //$(".dropdown-menu").removeClass(this.preDeviceSize).addClass(this.deviceSize);
            //$(".room-div").removeClass(this.preDeviceSize).addClass(this.deviceSize);

            let twoDivSpace = 0;
            if (this.deviceSize == "FullHD" || this.deviceSize == "LargeDesktop")
                twoDivSpace = this.appScope.appWidth * (25 + 23) / 100;
            else if (this.deviceSize == "MediumDesktop")
                twoDivSpace = this.appScope.appWidth * (20 + 20) / 100;
            else if (this.deviceSize == "Tablet")
                twoDivSpace = this.appScope.appWidth * (30 + 30) / 100;
            else
                twoDivSpace = this.appScope.appWidth - (borderPixes + 1);

            let centralMenuDiv = this.appScope.appWidth - borderPixes - Math.floor(twoDivSpace) - 1;
            $(".centralMenu-div").removeClass(this.preDeviceSize).addClass(this.deviceSize);
            $(".centralMenu-div").css({ width: centralMenuDiv + 'px' });

            //space between each button is calculated here
            let fiveBtnSize = 541;
            let twoBtnSize = 169;
            let spacebetweenBtn = 0;
            if (this.deviceSize == "FullHD" || this.deviceSize == "LargeDesktop")
                spacebetweenBtn = Math.floor((centralMenuDiv - fiveBtnSize - 36) / 6);
            else if (this.deviceSize == "MediumDesktop")
                spacebetweenBtn = Math.floor((centralMenuDiv - fiveBtnSize - 36) / 6);
            else if (this.deviceSize == "Tablet")
                spacebetweenBtn = Math.floor((centralMenuDiv - twoBtnSize - 15) / 3);
            else
                spacebetweenBtn = Math.floor((centralMenuDiv - twoBtnSize - 15) / 3);

            $(".spacer-btn").css({ width: spacebetweenBtn + 'px' });

            //second row starts here ...

            this.appScope.rightBarWidth = 142;
            this.appScope.rightBarHeight = this.appScope.appHeight - 81 - borderPixes;

            this.appScope.leftBarWidth = this.appScope.appWidth - (this.appScope.rightBarWidth + 2) - borderPixes;
            this.appScope.leftBarHeight = this.appScope.appHeight - 81 - borderPixes;

            $(".left-column-div").css({
                height: this.appScope.leftBarHeight + "px",
                width: this.appScope.leftBarWidth + "px"
            });
            $(".message-box").css({
                height: this.appScope.leftBarHeight + "px"
            });
            setTimeout(() => {
                let element = document.querySelector('.message-contents');
                if (element)
                    element.scrollTop = element.scrollHeight - element.clientHeight;
            }, 100);

            $(".right-column-div").css({
                height: this.appScope.rightBarHeight + "px"
            });

            this.appScope.sTop = 0;
            this.appScope.sLeft = 0;
            this.appScope.sWidth = this.appScope.leftBarWidth;
            this.appScope.sHeight = this.appScope.leftBarHeight;

            w = this.appScope.sWidth / 16;
            h = this.appScope.sHeight / 9;
            this.appScope.scaleFactor = Math.floor((w > h) ? h : w);

            this.appScope.maxTop = this.appScope.sTop;
            this.appScope.maxWidth = this.appScope.scaleFactor * 16;
            this.appScope.maxHeight = this.appScope.scaleFactor * 9;
            this.appScope.maxLeft = Math.floor((this.appScope.sWidth - this.appScope.maxWidth) / 2);

            this.preDeviceSize = this.deviceSize;
            this.appScope.$applyAsync();
        }
        private getAppWindowSize(): string {
            if ((this.$window.innerWidth == 1920 ||
                this.$window.innerWidth == 1919 ||
                this.$window.innerWidth == 1918 ||
                this.$window.innerWidth == 1921) && (this.$window.innerHeight == 1080 ||
                    this.$window.innerHeight == 1078 ||
                    this.$window.innerHeight == 1079 ||
                    this.$window.innerHeight == 1081))
                return "FullHD";
            else if (this.$window.innerWidth >= 1200)
                return "LargeDesktop";
            else if (this.$window.innerWidth >= 992)
                return "MediumDesktop";
            else if (this.$window.innerWidth >= 768)
                return "Tablet";
            else if (this.$window.innerWidth >= 320)
                return "Phone";
            else
                return "ExtraSmallPhone";
        }
    }
    AppSpaceController.$inject = ['$scope', '$window'];

    angular
        .module('vw')
        .controller('vw.components.AppSpaceCtrl', AppSpaceController);
}