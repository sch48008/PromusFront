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

                            // if success
                            if (response.status == 200) {

                                // store the access token and user id
                                $window.localStorage.token = response.data.id;
                                $window.localStorage.userId = response.data.userId;


                                // get the user model instance and store some user info locally
                                appUserRest.getUserById($window.localStorage.userId, $window.localStorage.token)
                                    .then(function(response) {

                                        // handle different responses and decide what happens next...

                                        if (response.status == 200) {

                                            // store a subset of user information
                                            $window.localStorage.userType = response.data[0].userType;
                                            $window.localStorage.firmId = response.data[0].firmId;
                                            $window.localStorage.firstName = response.data[0].firstName;
                                            $window.localStorage.lastName = response.data[0].lastName;
                                            $window.localStorage.preferredContactMethod = response.data[0].preferredContactMethod;
                                            
                                            // navigation depends on user type
                                            switch ($window.localStorage.userType)
                                            {
                                                case "admin":
                                                    $state.go('common');
                                                    break;
                                                case "lead":
                                                    $state.go('lead');
                                                    break;
                                                case "manager":
                                                    $state.go('manager');
                                                    break;
                                                case "tenant":
                                                    $state.go('tenant');
                                                    break;                                                    
                                            }                                            
                                        }
                                        else if (response.status == 404) {
                                            ssfAlertsService.showAlert("No Server Connection", "Could not connect to server.");
                                        }
                                    }, function(error) {
                                        ssfAlertsService.showAlert("Unknown Error", "Error occurred. Error message is:   " + error.data.error.message);
                                    });
                            }
                            else if (response.status == 401) {
                                ssfAlertsService.showAlert("Login Failed", "Please retype username and password.");
                            }                            
                            else if (response.status == 404) {
                                ssfAlertsService.showAlert("No Server Connection", "Could not connect to server.");
                            }
                        }, function(error) {
                            
                            if(error.data.error.status == 401)
                            {
                                ssfAlertsService.showAlert("Login Failed", "Please retype username and password.");
                            }
                            else{
                                ssfAlertsService.showAlert("Error Occurred", "Error message is:   " + error.data.error.message);
                            }
                        });
                }
            };
        }
    ]);