angular
.module('angular-table-input')
.directive 'tableInputCell', [
  ->
    templateUrl: 'directives/table_input_cell/template.html'
    scope:
      row: '='
      column: '='
      edit: '='

]
