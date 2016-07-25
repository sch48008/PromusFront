angular.module('promusControllerModule')
    .controller('adminCtrl', ['$scope', '$state', '$window', '$ionicHistory', 'codeFirmRest', 'ssfAlertsService',
        function($scope, $state, $window, $ionicHistory, codeFirmRest, ssfAlertsService) {

            // the data we insert into the database
            $scope.codeFirm = {};

            // a method to generate a 6-digit random number
            $scope.generateCode = function() {
                $scope.codeFirm.regCode = randomIntFromInterval(100000, 999999);
            };

            // a function to generate a 6-digit random number
            function randomIntFromInterval(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            // the function that inserts the data (creates a new record in "RegCodeFirm")
            $scope.createCode = function(form) {

                // Check validity
                if (form.$invalid) {
                    return ssfAlertsService.showAlert("Incomplete", "Some fields are missing or incorrect.  Please see the form for errors.");
                }


                // Register...
                codeFirmRest.create($scope.codeFirm)
                    .then(function(response) {

                        // handle different responses and decide what happens next...

                        // if success
                        if (response.status == 200) {

                            ssfAlertsService.showAlert("Success", "The registration code was successfully inserted into the database." +
                            "Transmit the code to the firm's primary contact and direct them to use the code in the \"Register Firm\" form.");

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