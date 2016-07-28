angular.module('promusControllerModule')
    .controller('registerFirmCtrl', ['$scope', '$state', '$window', 'appUserRest', 'codeFirmRest', 'firmRest', 'addressRest', 'ssfAlertsService',
        function($scope, $state, $window, appUserRest, codeFirmRest, firmRest, addressRest, ssfAlertsService) {

            // holds address data
            $scope.address = {};            
            
            // holds main firm data
            $scope.firm = {};
            
            // holds temporary data
            $scope.temp = {};            
            
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // We can hard-code this next value.  All firms are property management firms except SSF which is the admin firm.
            // SSF will be pre-registered in the database so will not need to be registered from the "Register Firm" form.
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $scope.firm.firmType = "propertyManagement";


            $scope.countries = [{
                name: 'United States',
                code: 'US'
            }, {
                name: 'Afghanistan',
                code: 'AF'
            }, {
                name: 'Åland Islands',
                code: 'AX'
            }, {
                name: 'Albania',
                code: 'AL'
            }, {
                name: 'Algeria',
                code: 'DZ'
            }, {
                name: 'American Samoa',
                code: 'AS'
            }];

            $scope.states = [{
                name: 'Alabama',
                code: 'AL'
            }, {
                name: 'Alaska',
                code: 'AK'
            }, {
                name: 'Arizona',
                code: 'AZ'
            }, {
                name: 'Arkansas',
                code: 'AR'
            }, {
                name: 'California',
                code: 'CA'
            }, {
                name: 'Colorado',
                code: 'CO'
            }];


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Save this verbiage
            // "Your registration code should have been provided to you by your SSF sales rep." +
            // "If you do not have one please contact your SSF sales rep at the phone number at top right."
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            $scope.register = function(form) {
                
                // for country we only want the country name (not the country code)
                $scope.address.country = $scope.temp.country.name;
                
                // check that a state has been selected if the country code is US and assign value
                if($scope.temp.country.code === "US"){
                    if(!$scope.temp.state){
                        return ssfAlertsService.showAlert("Missing State", "Please select a US state.");
                    } else {
                        $scope.address.state = $scope.temp.state.name;
                    }
                }
                

                // Check validity
                if (form.$invalid) {
                    return ssfAlertsService.showAlert("Incomplete", "Some fields are missing or incorrect.  Please see the form for errors.");
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // First we will retrieve the record from the RegCodeFirm table using the regCode value.  
                // If the regCode value is not found we need to display an error message.
                // Then we will add the firm address to the Address table and save the new address id.
                // Then finally we will register the firm.
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Retrieve RegCode...
                codeFirmRest.getRecordByCode($scope.temp.regCode, $window.localStorage.token)
                    .then(function(response) {
                        
                        if (response.status != 200) {
                            return ssfAlertsService.showAlert("Error", "An error occurred getting the firm registration code. Response status code was: " + response.status);
                        }
                        
                        var name = response.data[0].name;
                        if (!name || name.length == 0) {
                            return ssfAlertsService.showAlert("Error", "An unknown error occurred getting the firm registration code.");
                        }

                        // Add the address to the Address table...
                        addressRest.create($scope.address, $window.localStorage.token)
                            .then(function(response) {
    
                            if (response.status != 200) {
                                return ssfAlertsService.showAlert("Error", "An error occurred storing the firm address. Response status code was: " + response.status);
                            }
                            
                            // set address id
                            $scope.firm.addressId = response.data.id;
                            
                            // Register...
                            firmRest.register($scope.firm, $window.localStorage.token)
                                .then(function(response) {
                                    
                                    if (response.status != 200) {
                                        return ssfAlertsService.showAlert("Error", "An error occurred registering the firm. Response status code was: " + response.status);
                                    }                                
        
                                    ssfAlertsService.showAlert("Success", "The firm " +  $scope.firm.name + " was successfully registered.");
    
                                }, function(error) {
                                    ssfAlertsService.showAlert("Error", "Error occurred registering firm. Error message is: " + error.message);
                                });


                            }, function(error) {
                                ssfAlertsService.showAlert("Error", "Error occurred adding address to database. Error message is: " + error.message);
                            });
                    
                    }, function(error) {
                        ssfAlertsService.showAlert("Error", "Error occurred getting registration code. Error message is: " + error.message);
                    });                    
            };
        }
    ]);
