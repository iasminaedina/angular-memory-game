'use strict';

var memoryGame = angular.module('memoryGame', ['ngAnimate', 'ngRoute'])

  //routes
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when("/", {
      templateUrl: 'views/gameboard.html',
      controller: 'GameCtrl'
    })
    .when("/loser", {
      templateUrl: 'views/loser.html',
      controller: 'loserCtrl'
    })
    .when("/didit/:clicks/:time", {
      templateUrl: 'views/winner.html',
      controller: 'winnerCtrl'
    })
  })

  .controller('loserCtrl', function loserCtrl($scope) {
    $scope.message = "YOU LOSE!";
  })

  .controller('winnerCtrl', function winnerCtrl($scope) {
    $scope.message = "YOU WIN!";
  })

  //usages:
  //- in the repeater as: <mg-card tile="tile"></mg-card>
  //- card currently being matched as: <mg-card tile="game.firstPick"></mg-card>

  .directive('mgCard', function() {
    return {
      restrict: 'E',
      // instead of inlining the template string here, one could use templateUrl: 'mg-card.html'
      // and then either create a mg-card.html file with the content or add
      // <script type="text/ng-template" id="mg-card.html">.. template here.. </script> element to
      // index.html
      template: '<div class="container">' +
                  '<div class="card" ng-class="{flipped: tile.flipped}">' +
                    '<img class="front" ng-src="img/back.png">' +
                    '<img class="back" ng-src="img/{{tile.title}}.png">' +
                  '</div>' +
                '</div>',
      scope: {
        tile: '='
      }
    }
  });