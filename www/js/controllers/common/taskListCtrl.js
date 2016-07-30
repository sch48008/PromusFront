angular.module('promusControllerModule')
    .controller('taskListCtrl', ['$scope', '$state', '$window', '$ionicHistory', 'appUserRest', 'taskRest', 'propertyRest', 'ssfAlertsService',
        function($scope, $state, $window, $ionicHistory, appUserRest, taskRest, propertyRest, ssfAlertsService) {


            // will hold raw tasks
            $scope.tasks = [];

            // will hold display tasks
            $scope.displayTasks = [];


            // sort function to sort firms by propertyId
            // function compare(a, b) {
            //     if (a.propertyId < b.propertyId)
            //         return -1;
            //     if (a.propertyId > b.propertyId)
            //         return 1;
            //     return 0;
            // }
            
            
            function getUserNameById(userId, token, count){
                
                appUserRest.getUserById(userId, token)
                    .then(function(response) {

                        if (response.status == 200) {
                            
                            $scope.displayTasks[count].createdBy = response.data[0].firstName + " " + response.data[0].lastName;
                        }
                        else {
                            ssfAlertsService.showAlert("Error", "Error occurred getting user name.");
                        }
                    }, function(error) {
                        ssfAlertsService.showAlert("Error", "Error occurred getting user name. Error message is:   " + error.data.error.message);
                    });                                       
            }
            
            
            function getPropertyNameById(propertyId, token, count){
                
                propertyRest.getPropertyById(propertyId, token)
                    .then(function(response) {

                        if (response.status == 200) {
                            
                            $scope.displayTasks[count].propertyName = response.data[0].name;
                        }
                        else {
                            ssfAlertsService.showAlert("Error", "Error occurred getting property for task.");
                        }
                    }, function(error) {
                        ssfAlertsService.showAlert("Error", "Error occurred getting property for task. Error message is:   " + error.data.error.message);
                    });                

                
            }


            // get the tasks by firmId
            getTasks($window.localStorage.firmId, $window.localStorage.token);
            

            // function get tasks...
            function getTasks(firmId, token) {

                taskRest.getTasksByFirmId(firmId, token)
                    .then(function(response) {

                        // if success
                        if (response.status == 200) {

                            $scope.tasks = response.data;

                            // sort
                            // $scope.tasks.sort(compare);
                            
                            var count = 0;
                            
                            // get the tasks and construct an array of "display tasks"
                            $scope.tasks.forEach(function(task) {
                                
                                var displayTask = {};
                                
                                // these values are simply transferred
                                displayTask.taskId = task.id;
                                displayTask.unit = task.unit;
                                displayTask.taskNumber = task.taskNumber;
                                displayTask.subject = task.subject;
                                displayTask.origin = task.origin;
                                displayTask.priority = task.priority;
                                displayTask.status = task.status;
                                displayTask.created = task.created;
                                
                                $scope.displayTasks[count] = displayTask;

                                // get property name given property id
                                getPropertyNameById(task.propertyId, $window.localStorage.token, count);
                                
                                // get user name given userid
                                getUserNameById(task.createdBy, $window.localStorage.token, count);

                                count++;
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
            }
            
        }
    ]);




// $scope.tasks = [
// {
//     name: "Fix kitchen faucet",
//     property: "Pinnacle Point",
//     unit: 7,
//     person: "Kathy Rimes",
//     date: "July 12, 2016"
// },
// {
//     name: "Hang Blinds",
//     property: "Midtown Lofts",
//     unit: 3,
//     person: "Shia James",
//     date: "July 3, 2016"
// },
// {
//     name: "Replace Carpet",
//     property: "Park Place",
//     unit: 5,
//     person: "Michael Santos",
//     date: "August 2, 2016"
// }                
// ];