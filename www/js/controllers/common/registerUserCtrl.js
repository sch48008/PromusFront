angular.module('promusControllerModule')
    .controller('registerUserCtrl', ['$scope', '$state', '$window', 'appUserRest', 'codeUserRest', 'firmRest', 'propertyRest', 'ssfAlertsService',
        function($scope, $state, $window, appUserRest, codeUserRest, firmRest, propertyRest, ssfAlertsService) {

            // holds main user data
            $scope.user = {};
            
            // holds temporary data
            $scope.temp = {};            

            // function to be used in welcome message - (not yet used)
            $scope.getFirmName = function(){
                firmRest.getFirmById($scope.user.firmId)
                    .then(function(response) {
                        if (response.status == 200) {
                            var firm = response.data[0];
                            return firm.name;
                        }else{
                            ssfAlertsService.showAlert("Unknown Error", "Attempt to get firm name failed. Response status is: " + response.status);
                        }
                    }, function(error) {
                        ssfAlertsService.showAlert("Unknown Error", "Error occurred. Error message is: " + error.message);
                    });
            };
            
      

            // Save this verbiage:
            // "Your registration code should have been provided to you by your Property Manager." +
            // "If you do not have one please contact your Property Manager at the phone number at top right."
            

            $scope.signupForm = function(form) {

                // Check validity
                if (form.$invalid) {

                    return ssfAlertsService.showAlert("Incomplete", "Some fields are missing or incorrect.  Please see the form for errors.");
                }

                // Check confirm password
                if ($scope.temp.confirmPassword !== $scope.user.password) {
                    return ssfAlertsService.showAlert("Password Mismatch", "The confirm password does not match the password. Please retype.");
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // This will be a 2-step process...
                // First we will retrieve the record from the RegCodeUser table using the regCode value.  
                // That table will give us the following values:
                //      firmId
                //      userType
                //      email (used only to validate)
                //      propertyId  (optional, used only for tenant user registration)
                // The form will give us the following values:
                //      firstName
                //      lastName
                //      phone1
                //      phone2
                //      email
                //      preferredContactMethod
                // Then we will register the user, using the combination of user information from the regCode table and the form.
                // Note: If the regCode value is not found we need to display an error message.
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Retrieve RegCode...
                codeUserRest.getRecordByCode($scope.temp.regCode)
                    .then(function(response) {

                        // handle different responses and decide what happens next...

                        // if success
                        if (response.status == 200) {

                            var email = response.data[0].email;

                            // Check for a match in the email value
                            if ((!email) || (0 == email.length) || (email.toLowerCase() !== $scope.user.email.toLowerCase())) {
                                ssfAlertsService.showAlert("No Email Match", "The email address you entered does not match the email address we have on file.");
                                return;
                            }

                            // transfer these values...
                            $scope.user.firmId = response.data[0].firmId;
                            $scope.user.userType = response.data[0].userType;
                            
                            // todo - need to add a record to the TenantProperty table (not AppUser table)
                            // $scope.user.propertyId = response.data[0].propertyId;



                            // Register...
                            appUserRest.register($scope.user)
                                .then(function(response) {

                                    // handle different responses and decide what happens next...

                                    // if success
                                    if (response.status == 200) {

                                        // store the access token and user id
                                        $window.localStorage.token = response.data.token;
                                        $window.localStorage.userId = response.data.id;

                                        // todo: store a subset of user information, just as we do when the user logs in

                                        
                                        
                                        // prepare welcome message - for now just show this
                                        ssfAlertsService.showAlert("Success!", "Welcome " + $scope.user.firstName + 
                                        "!  You have been registered with the Promus application with user type: " + $scope.user.userType + "." );

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
