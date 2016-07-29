angular.module("restServiceModule")
    .service('tenantPropertyRest', ['$http', function($http) {

        var tenantPropertyRest = this;
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/TenantProperties';


        // add a new tenantProperty association
        tenantPropertyRest.add = function(tenantPropertyData, token) {
            return $http({
                url: url,
                method: 'POST',
                data: tenantPropertyData,
                params: {access_token: token}
            });
        };

        // get all tenantPropertys
        tenantPropertyRest.getTenantProperties = function(token) {
            return $http({
                url: url,
                method: 'GET',
                params: {access_token: token}
            });
        };
        
        // get tenantProperty record(s) given user id
        tenantPropertyRest.getTenantPropertiesById = function(tenantId, token) {
            
            // construct filter
            var filter = "?filter[where][tenantId]=" + tenantId;            
            
            return $http({
                url: url + filter,
                method: 'GET',
                params: {access_token: token}
            });
        };        
        
    }]);