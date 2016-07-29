angular.module("restServiceModule")
    .service('propertyRest', ['$http', function($http) {

        var propertyRest = this;
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/Properties';
        
        // create a new property
        propertyRest.create = function(propertyData, token) {
            return $http({
                url: url,
                method: 'POST',
                data: propertyData,
                params: {access_token: token}
            });
        };        


        // get all properties
        propertyRest.getProperties = function(token) {
            return $http({
                url: url,
                method: 'GET',
                params: {access_token: token}
            });
        };
        
        
        // get properties by firm using firmId
        propertyRest.getPropertiesByFirm = function(firmId, token) {
            
            // construct filter
            var filter = "?filter[where][firmId]=" + firmId;
            
            return $http({
                url: url + filter,
                method: 'GET',
                params: {access_token: token}
            });
        };
        
        
        // get property given id
        propertyRest.getPropertyById = function(id, token) {
            return $http({
                url: url,
                method: 'GET',
                params: {access_token: token, id: id}
            });
        };        
        
    }]);