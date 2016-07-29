/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// "angular.module" is a global place for creating, registering and retrieving Angular modules.
// The first parameter 'promus' is the name of the main angular module for this application.
// The 2nd parameter is an array of 'requires' which will include vendor modules and custom modules that we construct.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
angular.module('promus', ['ionic', 'promusControllerModule', 'restServiceModule', 'ssfAlerts'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'templates/common/login.html',
        controller: 'loginCtrl'
      })
        .state('register-user', {
        url: '/register-user',
        templateUrl: 'templates/common/registerUser.html',
        controller: 'registerUserCtrl'
      })
      .state('register-firm', {
        url: '/register-firm',
        templateUrl: 'templates/lead/registerFirm.html',
        controller: 'registerFirmCtrl'
      })            
      .state('code-firm', {
        url: '/admin/code-firm',
        templateUrl: 'templates/admin/codeFirm.html',
        controller: 'codeFirmCtrl'
      })
      .state('code-user', {
        url: '/common/code-user',
        templateUrl: 'templates/common/codeUser.html',
        controller: 'codeUserCtrl'
      })                        
      .state('lobby', {
        url: '/lobby',
        templateUrl: 'templates/common/lobby.html',
        controller: 'lobbyCtrl'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'templates/admin/admin.html',
        controller: 'adminCtrl'
      })
      .state('lead', {
        url: '/lead',
        templateUrl: 'templates/lead/lead.html',
        controller: 'leadCtrl'
      })
      .state('add-property', {
        url: '/lead/add-property',
        templateUrl: 'templates/lead/addProperty.html',
        controller: 'addPropertyCtrl'
      })      
      .state('manager', {
        url: '/manager',
        templateUrl: 'templates/manager/manager.html',
        controller: 'managerCtrl'
      })
      .state('tenant', {
        url: '/tenant',
        templateUrl: 'templates/tenant/tenant.html',
        controller: 'tenantCtrl'
      })
      .state('request-maintenance', {
        url: '/tenant/request-maintenance',
        templateUrl: 'templates/tenant/requestMaintenance.html',
        controller: 'requestMaintenanceCtrl'
      });            
  });
  

      
      
