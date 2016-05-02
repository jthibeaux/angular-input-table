angular
.module('example', ['angular-table-input'])
.controller('ExampleController', [
  '$scope',
  function ($scope) {
    $scope.rows = [{
      col1: 'r1c1',
      col2: 'r1c2',
      col3: 'r1c3'
    },{
      col1: 'r2c1',
      col2: 'r2c2',
      col3: 'r2c3'
    }];

    $scope.columns = ['col1', 'col2', 'col3'];

    $scope.save = function(row) {
      return row;
    }

    $scope.remove = function(row) {
      return;
    }

    $scope.add = function(row) {
      return row;
    }
  }
]);
