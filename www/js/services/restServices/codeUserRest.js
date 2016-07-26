angular.module("restServiceModule")
    .service('codeUserRest', ['$http', function($http) {

        var codeUserRest = this;
        
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/RegCodeUsers';

        // get registration record by registration code - note: for user registration we don't have a token yet
        codeUserRest.getRecordByCode = function(regCode) {
            var filter = "?filter[where][regCode]=" + regCode;
            return $http({
            url: url + filter,
                method: 'GET'
            });            
        };
        
        // create a code for a user, requires a token
        codeUserRest.create = function(codeUser, token) {
            return $http({
                url: url,
                method: 'POST',
                data: codeUser,
                params: {access_token: token}                
            });
        };        


    }]);