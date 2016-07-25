angular.module("restServiceModule")
    .service('codeFirmRest', ['$http', function($http) {

        var codeFirmRest = this;
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/RegCodeFirms';

        // register a new user
        codeFirmRest.create = function(codeFirm) {
            return $http({
                url: url,
                method: 'POST',
                data: codeFirm
            });
        };


        
        
        // get user by id
        // codeFirmRest.getUserById = function(userId) {
        //     return $http({
        //         url: url,
        //         method: 'GET',
        //         params: {id: userId}
        //     });
        // };        
        

        // logout - TODO: not yet implemented in controller
        // codeFirmRest.logout = function(token) {
        //     return $http({
        //         url: url + "/logout",
        //         method: "POST",
        //         headers: {
        //             'Authorization': token
        //         }
        //     });
        // };
        
        
    }]);