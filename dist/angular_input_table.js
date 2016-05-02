(function() {
  angular.module('angular-table-input', []);

}).call(this);

(function() {
  angular.module('angular-table-input').directive('tableInput', [
    function() {
      return {
        templateUrl: 'directives/table_input/template.html',
        scope: {
          rows: '=',
          columns: '='
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('angular-table-input').directive('tableInputCell', [
    function() {
      return {
        templateUrl: 'directives/table_input_cell/template.html',
        scope: {
          row: '=',
          column: '=',
          edit: '='
        }
      };
    }
  ]);

}).call(this);

angular.module('angular-table-input').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('directives/table_input/template.html',
    "\n" +
    "<table>\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th ng-repeat=\"column in columns\" ng-bind=\"column\"></th>\n" +
    "      <th></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows\">\n" +
    "      <td ng-repeat=\"column in columns\">\n" +
    "        <table-input-cell row=\"row\" column=\"column\" edit=\"row.editing\"></table-input-cell>\n" +
    "      </td>\n" +
    "      <td>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"edit(row)\" ng-if=\"!row.editing\"><i class=\"fa fa-pencil\"></i></button>\n" +
    "        <button class=\"btn btn-danger\" ng-click=\"remove(row)\" ng-if=\"!row.editing\"><i class=\"fa fa-times\"></i></button>\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"save(row)\" ng-if=\"row.editing\"><i class=\"fa fa-check\"></i></button>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"cancel(row)\" ng-if=\"row.editing\"><i class=\"fa fa-undo\"></i></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>"
  );


  $templateCache.put('directives/table_input_cell/template.html',
    "<span ng-if=\"!edit\" ng-bind=\"row[column]\"></span>\n" +
    "<input class=\"form-control\" ng-if=\"edit\" type=\"text\" ng-model=\"row[column]\"/>"
  );

}]);
