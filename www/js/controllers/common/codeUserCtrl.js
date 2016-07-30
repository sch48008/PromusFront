angular.module('promusControllerModule')
    .controller('codeUserCtrl', ['$scope', '$state', '$window', '$ionicHistory', 'codeUserRest', 'firmRest', 'propertyRest', 'ssfAlertsService',
        function($scope, $state, $window, $ionicHistory, codeUserRest, firmRest, propertyRest, ssfAlertsService) {

            // these boolean values affect which controls are visible in the template
            $scope.isAdmin = $window.localStorage['userType'] === "admin";
            $scope.isLead = ($window.localStorage['userType'] === "lead") || ($window.localStorage['userType'] === "admin");
            $scope.isManager = ($window.localStorage['userType'] === "manager") || ($window.localStorage['userType'] === "lead") ||
                ($window.localStorage['userType'] === "admin");
            $scope.isTenant = ($window.localStorage['userType'] === "tenant") || ($window.localStorage['userType'] === "manager") ||
                ($window.localStorage['userType'] === "lead") || ($window.localStorage['userType'] === "admin");


            // the data we insert into the database
            $scope.codeUser = {};
            
            // to hold temporary data
            $scope.temp = {};
            

            // a method to generate a 6-digit random number
            $scope.generateCode = function() {
                $scope.codeUser.regCode = randomIntFromInterval(100000, 999999);
            };

            // a function to generate a 6-digit random number
            function randomIntFromInterval(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
            
            // properties...needed in select property dropdown for tenants
            $scope.properties = [];            
            
            // firms...needed in select firm dropdown which is only needed when the the user is admin
            $scope.firms = [];
            
            // sort function to sort firms by name
            function compare(a, b) {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            }
            
            // The 3 user types using this form are: admin, lead and manager.
            // If the user is a lead or manager, the firmId for the purposes of getting properties is simply the user's firmId.
            // Otherwise (if user is admin) we have to wait for the ng-change event of the select firm box.
            if($window.localStorage.userType == "lead" || $window.localStorage.userType == "manager") {
                
                // go ahead and get the properties because we know the firm.
                getProperties($window.localStorage.firmId, $window.localStorage.token);
                
            }
            

            // function get properties...needed in select property dropdown for tenants
            function getProperties(firmId, token){
                
                propertyRest.getPropertiesByFirm(firmId, token)
                    .then(function(response) {
    
                        // handle different responses and decide what happens next...
    
                        // if success
                        if (response.status == 200) {
                            $scope.properties = response.data;
                            
                            // sort
                            $scope.properties.sort(compare);
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
            
            // called when user changes the "firm" select box
            $scope.setProperties = function(){
                
                getProperties($scope.temp.firm.id, $window.localStorage.token);

            };
        
            
            // get firms...needed in select firm dropdown
            firmRest.getFirms($window.localStorage.token)
                .then(function(response) {

                    // handle different responses and decide what happens next...

                    // if success
                    if (response.status == 200) {
                        $scope.firms = response.data;
                        
                        // sort
                        $scope.firms.sort(compare);
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
                
            

            // the function that inserts the data (creates a new record in "RegCodeUser")
            $scope.createCode = function(form) {
                
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // We need the "firmId" for the new user.  If the user registration code is being generated by an SSF admin, then the firmId is obtained 
                // from "$scope.temp.firm" which is set by the "Select Firm" dropdown.  On the other hand, if the person generating the code is a "lead"
                // or a "manager", then we already have their firmId and the user they are generating a code for must be of the same firm.
                // We obtain all users' firmId right after they login and we store it in windows local storage.
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                
                // if current user id an SSF admin
                if($scope.isAdmin){
                    
                    // Check that they have selected a firm
                    if(!$scope.temp.firm){
                        return ssfAlertsService.showAlert("Missing Firm", "You must select a firm from the select box above.");                    
                    } 
                    
                    // assign firmId to variable. We just need the firmId, not the entire firm.
                    $scope.codeUser.firmId = $scope.temp.firm.id;
                
                
                } else { // current user is "lead" or "manager"
                    
                    // new user will get same firmId as current user
                    $scope.codeUser.firmId = $window.localStorage.firmId;
                    
                }
                
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // If the "userType" of the new user is "tenant" then we need to check and be sure a "property" has been selected.
                // We cannot validate this field using the "required" directive because this select box is hidden when the userType is not tenant.
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if($scope.codeUser.userType === "tenant"){
                    
                    // Check that they have selected a property
                    if(!$scope.temp.property){
                        return ssfAlertsService.showAlert("Missing Property", "You must select a property from the select box above when adding a tenant.");                    
                    }
                    
                    // assign propertyId to variable. We just need the propertyId, not the entire property.
                    $scope.codeUser.propertyId = $scope.temp.property.id;                    
                }

                

                

                // Check general form validity (other fields not addressed above)
                if (form.$invalid) {
                    return ssfAlertsService.showAlert("Incomplete", "Some fields are missing or incorrect.  Please see the form for errors.");
                }


                // Register...
                codeUserRest.create($scope.codeUser, $window.localStorage.token)
                    .then(function(response) {

                        // handle different responses and decide what happens next...

                        // if success
                        if (response.status == 200) {

                            ssfAlertsService.showAlert("Success", "The registration code was successfully inserted into the database." +
                                "Transmit the code to the user and direct them to use the code in the \"Register User\" form.");

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