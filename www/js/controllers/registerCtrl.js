angular.module('promusControllerModule')
    .controller('registerCtrl', ['$scope', '$state', '$window', 'appUserRest', 'ssfAlertsService',
        function($scope, $state, $window, appUserRest, ssfAlertsService) {

            $scope.regCode = 0;
            $scope.confirmPassword = "";
            $scope.user = {};
            
            // flag for registration record
            var registrationFound = false;

            $scope.signupForm = function(form) {

                // Check validity
                if (form.$invalid) {

                    return ssfAlertsService.showAlert("Incomplete", "Some fields are missing or incorrect.  Please see below.");
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////
                // This will be a 2-step process...
                // First we will retrieve the record from the RegCodeUser table using the regCode value.  
                // That will give us the following info:
                //      firmId
                //      userType
                //      email
                //      propertyId (optional)
                // Then we will register the user, providing all the user information.
                // If the regCode value is not found we need to display an error message.
                ////////////////////////////////////////////////////////////////////////////////////////////////

                // Retrieve RegCode...
                regCodeUserRest.getRecordByCode($scope.regCode, $window.localStorage['token'])
                    .then(function(response) {

                        // handle different responses and decide what happens next...

                        // if success
                        if (response.status == 200) {
                            
                            var record = response.data;
                            
                            // Check for a match in the email value
                            if ((!record.email) || (0 == record.email.length) || (record.email !== $scope.user.email )){
                                ssfAlertsService.showAlert("No Email Match", "The email address you entered does not match the email address on file.");
                                return;
                            }
                            
                            // transfer these values...
                            $scope.user.firmId = record.firmId;
                            $scope.user.userType = record.userType;
                            $scope.user.propertyId = record.propertyId;
                            
                            // set flag
                            registrationFound = true;


                        }
                        else if (response.status == 404) {
                            ssfAlertsService.showAlert("No Server Connection", "Could not connect to server.");
                        }
                        else if (response.status == 500) {
                            ssfAlertsService.showAlert("No Server Connection", "The server appears to be offline.");
                        }
                    }, function(error) {

                        ssfAlertsService.showAlert("Unknown Error", "Error occurred. Error message is: " + error.message);

                    });
                    
                if(!registrationFound){
                     ssfAlertsService.showAlert("Registration Unsuccessful", "Sorry we were not able to verify your registation information. Please try again or contact the help number listed above.");                    
                }


                // Register...
                appUserRest.register($scope.user)
                    .then(function(response) {

                        // handle different responses and decide what happens next...

                        // if success
                        if (response.status == 200) {

                            // store the access token and user id
                            $window.localStorage.token = response.data.token;
                            $window.localStorage.userId = response.data.id;

                            // take user to the lobby
                            $state.go('lobby');
                        }
                        else if (response.status == 422) {
                            ssfAlertsService.showAlert("Email Already Exists", "Sorry, that email value is already registered.");
                        }
                        else if (response.status == 404) {
                            ssfAlertsService.showAlert("No Server Connection", "Could not connect to server.");
                        }
                        else if (response.status == 500) {
                            ssfAlertsService.showAlert("No Server Connection", "The server appears to be offline.");
                        }
                    }, function(error) {

                        ssfAlertsService.showAlert("Unknown Error", "Error occurred. Error message is: " + error.message);

                    });
            };
        }
    ]);
