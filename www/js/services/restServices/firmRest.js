angular.module("restServiceModule")
    .service('firmRest', ['$http', function($http) {

        var firmRest = this;
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/Firms';


        // register a new firm
        firmRest.register = function(firmData, token) {
            return $http({
                url: url,
                method: 'POST',
                data: firmData,
                params: {access_token: token}
            });
        };

        // get all firms
        firmRest.getFirms = function(token) {
            return $http({
                url: url,
                method: 'GET',
                params: {access_token: token}
            });
        };         
        
    }]);