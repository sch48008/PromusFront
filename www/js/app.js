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
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'registerCtrl'
      })
      .state('lobby', {
        url: '/lobby',
        templateUrl: 'templates/lobby.html',
        controller: 'lobbyCtrl'
      });
  });