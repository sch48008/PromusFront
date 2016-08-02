angular.module("restServiceModule")
    .service('appUserRest', ['$http', function($http) {

        var appUserRest = this;
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/AppUsers';

        // register a new user
        appUserRest.register = function(userData) {
            return $http({
                url: url,
                method: 'POST',
                data: userData
            });
        };

        // login a user
        appUserRest.login = function(loginData) {
            return $http({
                url: url + '/login',
                method: 'POST',
                data: loginData
            });
        };
        
        
        // get user by id
        appUserRest.getUserById = function(id, token) {
            var filter = "?filter[where][id]=" + id;            
            
            return $http({
                url: url + filter,
                method: 'GET',
                headers: {'Authorization': token }
            });
        };        
        

        // logout method
        appUserRest.logout = function(token) {
            return $http({
                url: url + "/logout",
                method: "POST",
                headers: {
                    'Authorization': token
                }
            });
        };        
    }]);