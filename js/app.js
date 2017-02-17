// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var url = "https://api.magicthegathering.io/v1/cards";

var MTGapp = angular.module('MTGapp', ['ionic', 'ngRoute', 'ngSanitize'])
.run(function($ionicPlatform,$rootScope,$location) {

  $rootScope.goHome = function() {
      $location.path('/list');
  };

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


MTGapp.config(['$routeProvider', function($routeProvider){//the square brackets are for minification
  $routeProvider
      .when('/list',
      {
        controller: 'ListController',
        templateUrl: 'partials/list.html'
      })
      .when('/details/:itemId',{
        controller: 'DetailsController',
        templateUrl: 'partials/details.html'
      })
      .otherwise({redirectTo: '/list'});

}]);


MTGapp.factory("magicFac", ['$http', '$routeParams',function($http,$routeParams){  
    var obj = {};
   
    obj.fetchAllCards = function(){
        return $http.get(url);
    }

    obj.fetchCardDetails = function(){
        return $http.get(url+"/"+$routeParams.itemId);
    }

 return obj;
}]);

MTGapp.controller('ListController',['$scope', 'magicFac', '$ionicLoading', function($scope, magicFac, $ionicLoading){//the square brackets are for minification

  $scope.loadCards = function() {
      $ionicLoading.show(); //start spinner

      magicFac.fetchAllCards()
      .success(function(response){
          //console.log(response.cards[4].colors[0]);

          $scope.cards = response.cards;

          $ionicLoading.hide();
      })
      .finally(function(){
          $scope.$broadcast('scroll.refreshComplete');
      });
  };

$scope.loadCards();
}]);

MTGapp.controller('DetailsController',[ '$scope', 'magicFac', '$ionicLoading', function($scope, magicFac, $ionicLoading){
  $ionicLoading.show(); //start spinner
  //console.log($routeParams.itemId);//which list item the user clicked on
  
  magicFac.fetchCardDetails()
  .success(function(response){
      console.log(response.card);
      $scope.cardDetail = response.card;
      //$scope.charDetail = response[$routeParams.itemId];
      //$scope.charDetail.largeImage = $scope.charDetail.url.substring(48,52);

      $ionicLoading.hide();
  });

}]);