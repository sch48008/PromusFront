angular.module("restServiceModule", [])
    .service('appUserRest', ['$http', function($http) {

        var appUserRest = this;
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/AppUsers';

        // register a new user
        appUserRest.register = function(newUserData) {
            return $http({
                url: url,
                method: 'POST',
                data: newUserData
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

        // logout - TODO: not yet implemented in controller
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