angular.module('promusControllerModule')
    .controller('registerCtrl', ['$scope', '$state', '$window', 'appUserRest', 'regCodeUserRest', 'ssfAlertsService',
        function($scope, $state, $window, appUserRest, regCodeUserRest, ssfAlertsService) {


            $scope.user = {};
            $scope.contactMethods = {
                    Email: "email",
                    Phone: "phone",
                    Text: "text"
                };


            // $scope.showHelp = function() {
            //     ssfAlertsService.showAlert("Registration Code", "Your registration code should have been provided to you by your Property Manager." +
            //         "If you do not have one please contact your Property Manager at the phone number at top right.");

            // };

            $scope.signupForm = function(form) {

                // Check validity
                if (form.$invalid) {

                    return ssfAlertsService.showAlert("Incomplete", "Some fields are missing or incorrect.  Please see below.");
                }

                // Check confirm password
                if ($scope.user.confirmPassword !== $scope.user.password) {
                    return ssfAlertsService.showAlert("Password Mismatch", "The confirm password does not match the password. Please retype.");
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
                // regCodeUserRest.getRecordByCode($scope.user.regCode, $window.localStorage['token'])
                regCodeUserRest.getRecordByCode($scope.user.regCode)
                    .then(function(response) {

                        // handle different responses and decide what happens next...

                        // if success
                        if (response.status == 200) {

                            var email = response.data[0].email;

                            // Check for a match in the email value
                            if ((!email) || (0 == email.length) || (email !== $scope.user.email)) {
                                ssfAlertsService.showAlert("No Email Match", "The email address you entered does not match the email address on file.");
                                return;
                            }

                            // transfer these values...
                            $scope.user.firmId = response.data[0].firmId;
                            $scope.user.userType = response.data[0].userType;
                            $scope.user.propertyId = response.data[0].propertyId;
                            $scope.user.preferredContactMethod = response.data[0].preferredContactMethod;



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
