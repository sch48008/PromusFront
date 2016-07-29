angular.module("restServiceModule")
    .service('taskRest', ['$http', function($http) {

        var taskRest = this;
        var url = 'https://promus-backend-bitflipper86.c9users.io/api/Tasks';


        // register a new task
        taskRest.create = function(taskData, token) {
            return $http({
                url: url,
                method: 'POST',
                data: taskData,
                params: {access_token: token}
            });
        };

        // get all tasks
        taskRest.getTasks = function(token) {
            return $http({
                url: url,
                method: 'GET',
                params: {access_token: token}
            });
        };
        
        // get task given id
        taskRest.getTaskById = function(id, token) {
            
            // construct filter
            var filter = "?filter[where][id]=" + id; 
            
            return $http({
                url: url + filter,
                method: 'GET',
                params: {access_token: token}
            });
        };        
        
    }]);