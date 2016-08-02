angular.module('promusControllerModule')
    .controller('adminCtrl', ['$scope', '$state', '$window', '$ionicHistory', 'appUserRest', 'ssfAlertsService',
        function($scope, $state, $window, $ionicHistory, appUserRest, ssfAlertsService) {
            
            // Logout function
            $scope.logout = function() {
                appUserRest.logout($window.localStorage.token)
                    .then(function(response) {

                        //The successful code for logout is 204
                        if (response.status === 204) {
                            console.log("successful logout");

                            // delete user info from local storage
                            delete $window.localStorage['token'];
                            delete $window.localStorage['userID'];

                            $ionicHistory.nextViewOptions({
                                historyRoot: true,
                                disableBack: true
                            });
                            $state.go('login');
                        }
                        else {
                            ssfAlertsService.showAlert("Error", "Could not logout at this moment, try again.");
                        }
                    }, function(response) {
                        ssfAlertsService.showAlert("Error", "Could not logout at this moment, try again.");
                    });
            };
        }
    ]);