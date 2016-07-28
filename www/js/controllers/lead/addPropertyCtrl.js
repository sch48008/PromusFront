angular.module('promusControllerModule')
    .controller('addPropertyCtrl', ['$scope', '$state', '$window', 'propertyRest', 'addressRest', 'ssfAlertsService',
        function($scope, $state, $window, propertyRest, addressRest, ssfAlertsService) {

            // holds address data
            $scope.address = {};            
            
            // holds main property data
            $scope.property = {};
            
            // holds temporary data
            $scope.temp = {};            
            
            // property types
            $scope.propertyTypes = ['residential', 'commercial', 'mixed-use'];
            $scope.propertySubtypes = [];
            
            // possible property subtypes
            var residentialPropertyTypes = ['apartments', 'condos', 'detached homes', 'mixed']; 
            var commercialPropertyTypes =['office', 'retail', 'industrial', 'storage', 'parking', 'mixed'];
            var mixedUsePropertyTypes = ['mixed'];
            
            // function to change the select values for property subtype
            $scope.getPropertySubtypes = function(){
                switch ($scope.property.type)
                {
                    case "residential":
                        $scope.propertySubtypes = residentialPropertyTypes;
                        break;
                        
                    case "commercial":
                        $scope.propertySubtypes = commercialPropertyTypes;
                        break;
                        
                    case "mixed-use":
                        $scope.propertySubtypes = mixedUsePropertyTypes;
                        break;                        
                }
            };
            
            // address data
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

            
            

            // add property
            $scope.addProperty = function(form) {
                
                // the property belongs to the firm of the person addng the property
                $scope.property.firmId = $window.localStorage.firmId;
                
                // we record which user added the property
                $scope.property.addedBy = $window.localStorage.userId;
                
                
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
                    return ssfAlertsService.showAlert('Incomplete', 'Some fields are missing or incorrect.  Please see the form for errors.');
                }

                ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // First we will add the property address to the Address table and save the new address id.
                // Then finally we will register the property.
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                // Add the address to the Address table...
                addressRest.create($scope.address, $window.localStorage.token)
                    .then(function(response) {

                    if (response.status != 200) {
                        return ssfAlertsService.showAlert('Error', 'An error occurred storing the property address. Response status code was: ' + response.status);
                    }
                    
                    // set address id
                    $scope.property.addressId = response.data.id;
                    
                    // Register...
                    propertyRest.create($scope.property, $window.localStorage.token)
                        .then(function(response) {
                            
                            if (response.status != 200) {
                                return ssfAlertsService.showAlert('Error', 'An error occurred creating the property. Response status code was: ' + response.status);
                            }                                

                            ssfAlertsService.showAlert('Success', 'The property ' +  $scope.property.name + ' was successfully created.');

                        }, function(error) {
                            ssfAlertsService.showAlert('Error', 'Error occurred creating the property. Error message is: ' + error.message);
                        });


                    }, function(error) {
                        ssfAlertsService.showAlert('Error', 'Error occurred adding property to database. Error message is: ' + error.message);
                    });
            };
        }
    ]);
