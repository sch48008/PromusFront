angular.module("restServiceModule")
    .service('regCodeUserRest', ['$http', function($http) {

        var regCodeUserRest = this;
        
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/RegCodeUsers';

        // get registration record by registration code
        // regCodeUserRest.getRecordByCode = function(regCode, token) {
        regCodeUserRest.getRecordByCode = function(regCode) {
            
            var filter = "?filter[where][regCode]=" + regCode;
            
            // return $http({
            // url: url + filter,
            //     method: 'GET',
            //     params: {access_token: token}
            // });
            
            return $http({
            url: url + filter,
                method: 'GET'
            });            
        };


    }]);