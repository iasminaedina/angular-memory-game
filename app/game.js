
function Tile(title) {
  this.title = title;
  this.flipped = false;
}

Tile.prototype.flip = function() {
  this.flipped = !this.flipped;
}

memoryGame.controller('GameCtrl', function GameCtrl($scope, $timeout, $window, $location, $routeParams) {

  $scope.tileNames = [
    'brick-1', 'brick-2', 'brick-3', 'brick-4', 'brick-5', 'brick-6',
    'brick-7', 'brick-8'
  ];

  $scope.init = function() {
    var tileDeck = makeDeck($scope.tileNames);
  
    $scope.grid = makeGrid(tileDeck);
    $scope.clickCount = 0;
    $scope.unmatchedPairs = $scope.tileNames.length;
  
    var stopTimer = function() {
      $timeout.cancel(timer);
    }
  
     // for the timer
    $scope.timeLimit = 45000;
    var timer = null;
    (function startTimer() {
      $scope.timeLimit -= 1000;
      
      timer = $timeout(startTimer, 1000);
      if ($scope.timeLimit === 0) {
        stopTimer();
        $window.location.href = '/loser';
      }
    })();
  
    $scope.flipTile = function(tile) {
      if (tile.flipped) {
        return;
      }
  
      $scope.clickCount++;
  
      tile.isSecond = false;
  
      tile.flip();

      if (!$scope.firstPick || $scope.secondPick) {

        if ($scope.secondPick) {
          tile.isSecond = false;
          $scope.firstPick.flip();
          $scope.secondPick.flip();
          $scope.firstPick = $scope.secondPick = undefined;
        }
  
        $scope.firstPick = tile;
  
      } else {

        tile.isSecond = true;
        if ($scope.firstPick.title === tile.title) {
          $scope.firstPick = $scope.secondPick = undefined;
          $scope.unmatchedPairs--;
          $timeout(function() {
            tile.isSecond = false;
          }, 1000);
        } else {
          $scope.secondPick = tile;
          var firstPick = $scope.firstPick;
          var secondPick = $scope.secondPick;
          $timeout(function() {
            firstPick.flip();
            secondPick.flip();
            tile.isSecond = false;
          }, 1000);
          $scope.firstPick = $scope.secondPick = undefined;
        }
      }

      //redirect to winner page
      if ($scope.unmatchedPairs <= 0) {
        $location.path('/didit/' + 'clicks:' + $scope.clickCount + '/time:' + $scope.timeLimit / 10);
      }
    }
  };

  $scope.init();
});

/* array with two of each tileName in it */
function makeDeck(tileNames) {
  var tileDeck = [];
  tileNames.forEach(function(name) {
    tileDeck.push(new Tile(name));
    tileDeck.push(new Tile(name));
  });

  return tileDeck;
}


function makeGrid(tileDeck) {
  var gridDimension = Math.sqrt(tileDeck.length),
      grid = [];

  for (var row = 0; row < gridDimension; row++) {
    grid[row] = [];
    for (var col = 0; col < gridDimension; col++) {
        grid[row][col] = removeRandomTile(tileDeck);
    }
  }

  return grid;
}


function removeRandomTile(tileDeck) {
  var i = Math.floor(Math.random()*tileDeck.length);
  return tileDeck.splice(i, 1)[0];
}
