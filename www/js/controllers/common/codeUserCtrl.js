angular.module('promusControllerModule')
    .controller('codeUserCtrl', ['$scope', '$state', '$window', '$ionicHistory', 'codeUserRest', 'firmRest', 'ssfAlertsService',
        function($scope, $state, $window, $ionicHistory, codeUserRest, firmRest, ssfAlertsService) {

            // these boolean values affect which controls are visible in the template
            $scope.isAdmin = $window.localStorage['userType'] === "admin";
            $scope.isLead = ($window.localStorage['userType'] === "lead") || ($window.localStorage['userType'] === "admin");
            $scope.isManager = ($window.localStorage['userType'] === "manager") || ($window.localStorage['userType'] === "lead") ||
                ($window.localStorage['userType'] === "admin");
            $scope.isTenant = ($window.localStorage['userType'] === "tenant") || ($window.localStorage['userType'] === "manager") ||
                ($window.localStorage['userType'] === "lead") || ($window.localStorage['userType'] === "admin");


            // the data we insert into the database
            $scope.codeUser = {};
            
            // test function
            // $scope.showFirm = function(){
            //     alert("firmId = " + $scope.codeUser.firm.id);
            // };

            // a method to generate a 6-digit random number
            $scope.generateCode = function() {
                $scope.codeUser.regCode = randomIntFromInterval(100000, 999999);
            };

            // a function to generate a 6-digit random number
            function randomIntFromInterval(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
            
            // firms...needed in select firm dropdown
            $scope.firms = [];
            
            
            // properties...needed in select properties dropdown when userType...dummy for now
            $scope.properties = [{id:"xxxx", name:"Property1"}, {id:"yyyy", name:"Property2"}, {id:"zzzz", name:"Property3"}];            


            // get firms...needed in select firm dropdown
            firmRest.getFirms($window.localStorage.token)
                .then(function(response) {

                    // handle different responses and decide what happens next...

                    // if success
                    if (response.status == 200) {
                        $scope.firms = response.data;
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
                
            

            // the function that inserts the data (creates a new record in "RegCodeUser")
            $scope.createCode = function(form) {
                
                // assign firmId to variable and blank-out firm object.  We just need the firmId
                $scope.codeUser.firmId = $scope.codeUser.firm.id;
                $scope.codeUser.firm = {};

                // Check validity
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

                        ssfAlertsService.showAlert("Unknown Error", "Error occurred. Error message is: " + error.message);

                    });
            };
        }
    ]);