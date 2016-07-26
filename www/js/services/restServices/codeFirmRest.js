angular.module("restServiceModule")
    .service('codeFirmRest', ['$http', function($http) {

        var codeFirmRest = this;
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/RegCodeFirms';
        
        
        // get registration record by registration code, requires a token
        codeFirmRest.getRecordByCode = function(regCode, token) {
            var filter = "?filter[where][regCode]=" + regCode;
            return $http({
            url: url + filter,
                method: 'GET',
                headers: {'Authorization': token }  
            });            
        };        

        // create a code for a firm, requires a token
        codeFirmRest.create = function(codeFirm, token) {
            return $http({
                url: url,
                method: 'POST',
                data: codeFirm,
                headers: {'Authorization': token }                
            });
        };
    }]);