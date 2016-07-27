angular.module('promusControllerModule')
    .controller('registerFirmCtrl', ['$scope', '$state', '$window', 'appUserRest', 'codeFirmRest', 'firmRest', 'ssfAlertsService',
        function($scope, $state, $window, appUserRest, codeFirmRest, firmRest, ssfAlertsService) {


            $scope.firm = {};
            
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // We can hard-code this value.  All firms are property management firms except SSF which is the admin firm.
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


            // save for verbiage
            // $scope.showHelp = function() {
            //     ssfAlertsService.showAlert("Registration Code", "Your registration code should have been provided to you by your SSF sales rep." +
            //         "If you do not have one please contact your SSF sales rep at the phone number at top right.");
            // };

            $scope.register = function(form) {

                // Check validity
                if (form.$invalid) {

                    return ssfAlertsService.showAlert("Incomplete", "Some fields are missing or incorrect.  Please see the form for errors.");
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // First we will retrieve the record from the RegCodeFirm table using the regCode value.  
                // Todo: If the regCode value is not found we need to display an error message.
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Retrieve RegCode...
                codeFirmRest.getRecordByCode($scope.firm.regCode, $window.localStorage.token)
                    .then(function(response) {

                        // handle different responses and decide what happens next...

                        // if success
                        if (response.status == 200) {

                            var name = response.data[0].name;
                            if (name && name.length > 0) {


                                // Register...
                                firmRest.register($scope.firm, $window.localStorage.token)
                                    .then(function(response) {

                                        // handle different responses and decide what happens next...

                                        // if success
                                        if (response.status == 200) {

                                            ssfAlertsService.showAlert("Success", "The firm was successfully registered.");
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
