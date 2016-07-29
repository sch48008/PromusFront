angular.module('promusControllerModule')
    .controller('requestMaintenanceCtrl', ['$scope', '$state', '$window', 'propertyRest', 'addressRest', 'taskRest', 'tenantPropertyRest', 'ssfAlertsService',
        function($scope, $state, $window, propertyRest, addressRest, taskRest, tenantPropertyRest, ssfAlertsService) {


            // holds main request data
            $scope.request = {};

            // holds temporary data
            $scope.temp = {};
            
            // properties...needed in select property dropdown for tenants
            $scope.properties = [];                
            
            // a function to generate a 6-digit random number
            function randomIntFromInterval(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }  
            
            // get properties...in this case we want only the properties associated with the user (tenant). Usually this is just one property but may be more.
            tenantPropertyRest.getTenantPropertiesById($window.localStorage.userId, $window.localStorage.token)
                .then(function(response) {
                    
                    if (response.status == 200) {
                        var tenantProperties = response.data;
                        
                        // tenant may be associated with more than one property.  Add each property to the scope array.
                        tenantProperties.forEach(function(record){
                            propertyRest.getPropertyById(record.propertyId, $window.localStorage.token)
                                .then(function(response) {
                                    
                                    if (response.status == 200) {
                                        $scope.properties.push(response.data[0]);
                                    } else {
                                        ssfAlertsService.showAlert("Error", "Error occurred getting properties for tenant.");
                                    }
                                }, function(error) {
                                    ssfAlertsService.showAlert("Error", "Error occurred getting properties for tenant. Error message is: " + error.message);
                                });                                
                        });
                        
                    } else {
                         ssfAlertsService.showAlert("Error", "Error occurred getting properties for tenant.");
                    }
                }, function(error) {
                    ssfAlertsService.showAlert("Error", "Error occurred getting properties for tenant. Error message is: " + error.message);
                });            
            
            
            // add request
            $scope.requestMaintenance = function(form) {
                
                // generate a user-friendly 5-digit task number to help track the task
                $scope.request.taskNumber = randomIntFromInterval(10000, 99999);
                

                // the request belongs to the firm of the person adding the request
                $scope.request.firmId = $window.localStorage.firmId;
                
                // we record the user that created the request
                $scope.request.createdBy = $window.localStorage.userId;                
                
                // Because this is a tenant request form we know the origin
                $scope.request.origin = "tenant";
                
                // All requests begin with priority of "medium".  Only a property manager can escalate to high or deescalate to low.
                $scope.request.priority = "medium";
                
                // The initial status of a tenant request is always "new"
                $scope.request.status = "new";
                

                $scope.request.created = Date.now();
                
                
                
                // transfer the propertyId from the select box
                $scope.request.propertyId = $scope.temp.property.id;



                // Check validity
                if (form.$invalid) {
                    return ssfAlertsService.showAlert('Incomplete', 'Some fields are missing or incorrect.  Please see the form for errors.');
                }


                // Create task...
                taskRest.create($scope.request, $window.localStorage.token)
                    .then(function(response) {

                        if (response.status != 200) {
                            return ssfAlertsService.showAlert('Error', 'An error occurred creating the request. Response status code was: ' + response.status);
                        }

                        ssfAlertsService.showAlert('Success', 'The request \"' + $scope.request.subject + '\" was successfully submitted.');

                    }, function(error) {
                        ssfAlertsService.showAlert('Error', 'Error occurred creating the request. Error message is: ' + error.message);
                    });

            };
        }
    ]);
