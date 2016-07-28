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

                            // handle different login responses and decide what happens next...

                            // if success
                            if (response.status == 200) {

                                // store the access token and user id
                                $window.localStorage.token = response.data.id;
                                $window.localStorage.userId = response.data.userId;


                                // we also need to get the user model instance and store some user info locally
                                appUserRest.getUserById($window.localStorage.userId, $window.localStorage.token)
                                    .then(function(response) {

                                        // handle different responses and decide what happens next...

                                        // if success
                                        if (response.status == 200) {

                                            // store a subset of user information
                                            $window.localStorage.userType = response.data[0].userType;
                                            $window.localStorage.firmId = response.data[0].firmId;
                                            $window.localStorage.firstName = response.data[0].firstName;
                                            $window.localStorage.lastName = response.data[0].lastName;
                                            $window.localStorage.preferredContactMethod = response.data[0].preferredContactMethod;
                                            

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