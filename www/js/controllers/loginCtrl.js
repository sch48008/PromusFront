angular.module('promusControllerModule')
    .controller('loginCtrl', ['$scope', '$state', '$window', 'appUserRest', 'ssfAlertsService',
        function($scope, $state, $window, appUserRest, ssfAlertsService) {

            $scope.user = {};

            $scope.loginUser = function(form) {

                if (form.$invalid) {

                    ssfAlertsService.showAlert("Invalid Entry", "Please provide a valid email and password.  If you have not yet registered please select the register link.");
                }
                else {

                    appUserRest.login($scope.user)
                        .then(function(response) {

                            // handle different responses and decide what happens next...

                            // if success
                            if (response.status == 200) {

                                // store the access token and user id
                                $window.localStorage.token = response.data.id;
                                $window.localStorage.userId = response.data.userId;

                                // take user to the lobby
                                $state.go('lobby');
                            }
                            else if (response.status == 404) {

                                ssfAlertsService.showAlert("No Server Connection", "Could not connect to server.");

                            }
                        }, function(error) {

                            ssfAlertsService.showAlert("Unknown Error", "Error occurred. Error message is: " + error.message);

                        });
                }

            };
        }
    ]);