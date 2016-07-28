angular.module("restServiceModule")
    .service('addressRest', ['$http', function($http) {

        var addressRest = this;
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/Addresses';


        // create a new address
        addressRest.create = function(addressData, token) {
            return $http({
                url: url,
                method: 'POST',
                data: addressData,
                params: {access_token: token}
            });
        };

        // get all addresses
        addressRest.getAddresses = function(token) {
            return $http({
                url: url,
                method: 'GET',
                params: {access_token: token}
            });
        };
        
        // get address given id
        addressRest.getAddressById = function(id, token) {
            return $http({
                url: url,
                method: 'GET',
                params: {access_token: token, id: id}
            });
        };        
        
    }]);