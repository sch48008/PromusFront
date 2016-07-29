angular.module('promusControllerModule')
    .controller('registerUserCtrl', ['$scope', '$state', '$window', 'appUserRest', 'codeUserRest', 'firmRest', 'propertyRest', 'tenantPropertyRest', 'ssfAlertsService',
        function($scope, $state, $window, appUserRest, codeUserRest, firmRest, propertyRest, tenantPropertyRest, ssfAlertsService) {

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
                // This will be a 3-step process...
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
                //
                // Once the user is registered, if that user is of type "tenant" then the third step is to make the association
                // between the user(the tenant) and the property.  We do this in the "TenantProperty" table.
                // For other user types no association is made between the user and a property.
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Retrieve RegCode...
                codeUserRest.getRecordByCode($scope.temp.regCode)
                    .then(function(response) {

                        // handle different responses and decide what happens next...

                        // if success
                        if (response.status == 200) {
                            
                            if(response.data.length == 0){
                                return ssfAlertsService.showAlert("No Code Match", "Sorry, the registration code you entered does not match any codes that we have on file. " +
                                "Please contact help at the number on the form top right.");
                            }

                            var email = response.data[0].email;
                            

                            // Check for a match in the email value
                            if ((!email) || (0 == email.length) || (email.toLowerCase() !== $scope.user.email.toLowerCase())) {
                                ssfAlertsService.showAlert("No Email Match", "Sorry, the email address you entered does not match the email address we have on file. " +
                                "Please contact help at the number on the form top right.");
                                return;
                            }

                            // transfer these values...
                            $scope.user.firmId = response.data[0].firmId;
                            $scope.user.userType = response.data[0].userType;
                            
                            
                            // If the userType is tenant, capture the "propertyId" associated with the user
                            if($scope.user.userType === "tenant"){
                                $scope.temp.propertyId = response.data[0].propertyId;
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

                                        // todo: store a subset of user information, just as we do when the user logs in
                                        

                                        // make the association between the tenant and the property (if userType is tenant)
                                        if($scope.user.userType === "tenant"){
                                            
                                            var tenantPropertyData = {"tenantId": $window.localStorage.userId, "propertyId": $scope.temp.propertyId};
                                            
                                            tenantPropertyRest.add(tenantPropertyData, $window.localStorage.token)
                                                .then(function(response) {
                                                    
                                                    // if success
                                                    if (response.status == 200) {
                                                        // we don't need to do anything if this is successful, only alert if this fails
                                                    } else {
                                                         ssfAlertsService.showAlert("Error", "Error occurred associating tenant with property.");
                                                    }
                                                    
                                                }, function(error) {
                                                    ssfAlertsService.showAlert("Error", "Error occurred associating tenant with property. Error message is: " + error.message);
                                                });
                                        }                                        
                                        
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
