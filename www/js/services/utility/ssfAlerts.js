angular.module('ssfAlerts', [])
    .service('ssfAlertsService', ['$ionicPopup', '$q', function($ionicPopup, $q) {

        var service = this;

        // alert - using ionic popup        
        service.showAlert = function(title, body) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: body
            });
            alertPopup.then();
        };

        // confirm - using ionic popup
        service.showConfirm = function(title, body) {
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: body
            });
            return confirmPopup;
        };

    }]);