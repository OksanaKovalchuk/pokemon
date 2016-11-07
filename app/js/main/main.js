'use strict';

angular.module('app.main', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'js/main/main.template.html',
            controller: PockCtrl,
            transclude: true
        });
    }]);

 function   PockCtrl($http, $scope){
     var $ctrl = this;
     $scope.start_api = "/api/v1/pokemon/?limit=12";
     init();
     /**
      * resolving base promise for controller
      */
     function init(){
         $scope.showDetails = false;
         $http.get("http://pokeapi.co"+ $scope.start_api).success(function(response){
             $scope.meta = response.meta;
             $scope.list = response.objects;
             for(var i=0; i<$scope.list.length; i++){
                 $scope.list[i].show = true;
             }
         });
     }

     /**
      * to call filtering function after changing type
      */
     $scope.$watch('filterType', function () {
         $ctrl.filter($scope.filterType);
     }, true);
     /**
      * filtering function
      * @param type
      */
     $ctrl.filter = function(type){
         if(type !== "all" && type) {
             for( var i=0; i<$scope.list.length; i++) {
             $scope.list[i].show = false;
             for(var j=0; j<$scope.list[i].types.length; j++) {
                 if($scope.list[i].types[j].resource_uri == type){
                     $scope.list[i].show = true;
                     }
                 }
             }
         }
         else{
             init();
         }
     };
     /**
      * to see details about exact pokemon
      * @param id
      */
     $scope.load = function(id){
         $scope.showDetails = true;
         $http.get("http://pokeapi.co"+id).success(function(response){
             $scope.pockemon = response;
             $scope.totalMoves = $scope.pockemon.moves.length;
         });

     };
     /**
      * next package of pokemons :)
      */
     $scope.next = function(){
       $scope.start_api = $scope.meta.next;
         init();
     };
     /**
      * go to previous package
      */
     $scope.previous = function(){
       $scope.start_api = $scope.meta.previous;
         init()
     };
     /**
      * get all types
      */
     $http.get("http://pokeapi.co/api/v1/type/?limit=999").success(function(response){
         $scope.types = response.objects;
     });
     /**
      * colouring different types
      * @param value
      * @returns {*}
      */
     $scope.getClass = function (value) {
         switch(value){
             case("flying" || "fighting"):
                 return "btn-danger";break;
             case("bug" || "electric" || "ghost"):
                 return "btn-info";break;
             case("water" || "ice"):
                 return "btn-primary";break;
             case ("normal" || "ground" || "rock" || "grass"):
                 return "btn-success";break;
             case ("poison" || "steel"):
                 return "btn-default";break;
             case("fire" || "dragon" || "dark" || "fairy"):
                 return "btn-warning";break;
         }
     }
 }