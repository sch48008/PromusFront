angular.module('promusControllerModule')
    .controller('registerUserCtrl', ['$scope', '$state', '$window', 'appUserRest', 'codeUserRest', 'firmRest', 'propertyRest', 'tenantPropertyRest', 'ssfAlertsService',
        function($scope, $state, $window, appUserRest, codeUserRest, firmRest, propertyRest, tenantPropertyRest, ssfAlertsService) {

            // holds main user data
            $scope.user = {};
            
            // holds temporary data
            $scope.temp = {};            

            // this function is used below
            var completeRegistration = function(){
                
                ////////////////////////////////////////////////////////////////////////////////
                // Welcome message
                ////////////////////////////////////////////////////////////////////////////////
                var role = "";
                switch ($scope.user.userType)
                {
                    case "admin":
                        role = "an administrator.";
                        break;
                    case "lead":
                        role = "a lead property manager.";
                        break;
                    case "manager":
                        role = "a property manager.";
                        break;
                    case "tenant":
                        role = "a tenant for the property:  " + $scope.temp.propertyName + ".";
                        break;                                                    
                }                                                      
                
                var welcomeMessage = "Welcome " + $scope.user.firstName + 
                "!  You have been registered with Promus for the firm: " + $scope.temp.firmName +
                " as "+ role;
                
                ssfAlertsService.showAlert("Success!", welcomeMessage);
                

                ////////////////////////////////////////////////////////////////////////////////
                // Navigation depends on user type
                ////////////////////////////////////////////////////////////////////////////////
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
                
            };
      

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Save this verbiage:
            // "Your registration code should have been provided to you by your Property Manager." +
            // "If you do not have one please contact your Property Manager at the phone number at top right."
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            

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

                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Retrieve RegCode...
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                codeUserRest.getRecordByCode($scope.temp.regCode)
                    .then(function(response) {

                        // retrieve regCode was successful
                        if (response.status == 200) {
                            
                            if(response.data.length == 0){
                                return ssfAlertsService.showAlert("No Code Match", "Sorry, the registration code you entered does not match any codes that we have on file. " +
                                "Please contact help at the number on the form top right.");
                            }

                            // get email value from regCode table
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
                            
                            
                            //////////////////////////////////////////////////////////////////////////////////////////////
                            // Get the firm instance so that we can get the firm name
                            //////////////////////////////////////////////////////////////////////////////////////////////
                            firmRest.getFirmById($scope.user.firmId, $window.localStorage.token)
                                .then(function(response) {

                                    // get firm name was successful
                                    if (response.status == 200) {
                                        
                                        // store firm name
                                        $scope.temp.firmName = response.data[0].name;
                                        
                                        
                                        /////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Register...
                                        /////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        appUserRest.register($scope.user)
                                            .then(function(response) {
            
            
                                                // registration was successful
                                                if (response.status == 200) {
                                                    
                                                    // Store the access token and user id
                                                    $window.localStorage.token = response.data.token;
                                                    $window.localStorage.userId = response.data.id;
                                                    
            
                                                    //////////////////////////////////////////////////////////////////////////////////////////////
                                                    // Get the user model instance and store some user info locally
                                                    // This is the same thing we do when someone logs in.
                                                    //////////////////////////////////////////////////////////////////////////////////////////////
                                                    appUserRest.getUserById($window.localStorage.userId, $window.localStorage.token)
                                                        .then(function(response) {
                                                            
                                                            // get user instance was successful
                                                            if (response.status == 200) {
                    
                                                                // store a subset of user information
                                                                $window.localStorage.userType = response.data[0].userType;
                                                                $window.localStorage.firmId = response.data[0].firmId;
                                                                $window.localStorage.firstName = response.data[0].firstName;
                                                                $window.localStorage.lastName = response.data[0].lastName;
                                                                $window.localStorage.preferredContactMethod = response.data[0].preferredContactMethod;
                                                                
                                                                
                                                                //////////////////////////////////////////////////////////////////////////////////////////////
                                                                // Make the association between the tenant and the property (if userType is tenant)
                                                                //////////////////////////////////////////////////////////////////////////////////////////////
                                                                if($scope.user.userType === "tenant"){
                                                                    
                                                                    var tenantPropertyData = {"tenantId": $window.localStorage.userId, "propertyId": $scope.temp.propertyId};
                                                                    
                                                                    tenantPropertyRest.add(tenantPropertyData, $window.localStorage.token)
                                                                        .then(function(response) {
                                                                            
                                                                            // if success
                                                                            if (response.status == 200) {
                                                                               
                                                                                // we need to get the property name
                                                                                propertyRest.getPropertyById($scope.temp.propertyId, $window.localStorage.token)
                                                                                    .then(function(response) {
                                                                                        
                                                                                        // if success
                                                                                        if (response.status == 200) {
                                                                                            
                                                                                            $scope.temp.propertyName = response.data[0].name;
                                                                                            
                                                                                            // finally can complete registration
                                                                                            completeRegistration();
                                                 
                                                                                        } else {
                                                                                             ssfAlertsService.showAlert("Error", "Error occurred associating tenant with property.");
                                                                                        }
                                                                                    }, function(error) {
                                                                                        ssfAlertsService.showAlert("Error", "Error occurred associating tenant with property. Error message is:   " + error.data.error.message);
                                                                                    });                                                          
                                                                            } else {
                                                                                 ssfAlertsService.showAlert("Error", "Error occurred associating tenant with property.");
                                                                            }
                                                                        }, function(error) {
                                                                            ssfAlertsService.showAlert("Error", "Error occurred associating tenant with property. Error message is:   " + error.data.error.message);
                                                                        });
                                                                } else {
                                                                    // finally can complete registration
                                                                    completeRegistration();                                                                    
                                                                }
                                                            }
                                                            else if (response.status == 404) {
                                                                ssfAlertsService.showAlert("No Server Connection", "Could not connect to server.");
                                                            }
                                                        }, function(error) {
                                                            ssfAlertsService.showAlert("Unknown Error", "Error occurred. Error message is:   " + error.data.error.message);
                                                        });
                                                }
                                                else if (response.status == 404) {
                                                    ssfAlertsService.showAlert("No Server Connection", "Could not connect to server.");
                                                }
                                            }, function(error) {
                                                ssfAlertsService.showAlert("Unknown Error", "Error occurred. Error message is:   " + error.data.error.message);
                                            });                                                   
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

                                    ssfAlertsService.showAlert("Unknown Error", "Error occurred. Error message is:   " + error.data.error.message);

                                });
                        }
                        else if (response.status == 404) {
                            ssfAlertsService.showAlert("No Server Connection", "Could not connect to server.");
                        }
                        else if (response.status == 500) {
                            ssfAlertsService.showAlert("No Server Connection", "The server appears to be offline.");
                        }
                    }, function(error) {
                        ssfAlertsService.showAlert("Unknown Error", "Error occurred. Error message is:   " + error.data.error.message);
                    });
            };
        }
    ]);
