angular.module('promusControllerModule')
    .controller('loginCtrl', ['$scope', '$state', '$window', 'appUserRest',
        function($scope, $state, $window, appUserRest) {

            $scope.user = {};

            $scope.loginUser = function(form) {

                if (form.$invalid) {
                    return alert("Please provide a valid email and password.If you have not yet registered please select the register link.");
                }
                else {

                    appUserRest.login($scope.user)
                        .then(function(response) {
                            // handle different responses and decide what happens next
                            if (response.status == 200) {
                                $window.localStorage.token = response.data.id;
                                $window.localStorage.userID = response.data.userId;
                                $state.go('lobby');
                            }
                            else if (response.status == 404) {
                                alert('Sorry, could not connect to server.');
                            }
                        }, function(error) {
                            alert('Error occurred. Error message is: ' + error.message);
                        });
                }

            };
        }
    ]);