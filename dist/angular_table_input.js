(function() {
  angular.module('angular-table-input', []);

}).call(this);

(function() {
  angular.module('angular-table-input').directive('tableInput', [
    '$q', function($q) {
      return {
        templateUrl: 'directives/table_input/template.html',
        scope: {
          rows: '=',
          columns: '=',
          save: '&',
          remove: '&',
          add: '&'
        },
        link: function(scope) {
          var copyRow, rowIndex, updateRows;
          updateRows = function() {
            return scope.editingRows = _.map(scope.rows, function(row) {
              return _.pick(row, scope.columns);
            });
          };
          copyRow = function(to, from) {
            return _.merge(to, _.pick(from, scope.columns));
          };
          rowIndex = function(row) {
            return scope.editingRows.indexOf(row);
          };
          scope.edit = function(row) {
            return row._editing = true;
          };
          scope.cancel = function(row) {
            row._editing = false;
            return copyRow(row, scope.rows[rowIndex(row)]);
          };
          scope.callSave = function(row) {
            var index;
            index = rowIndex(row);
            return $q.when(scope.save({
              row: row,
              index: index
            })).then(function(savedRow) {
              row._editing = false;
              if (!savedRow) {
                return;
              }
              copyRow(scope.rows[index], savedRow);
              return copyRow(scope.editingRows[index], savedRow);
            });
          };
          scope.callRemove = function(row) {
            var index;
            index = rowIndex(row);
            return $q.when(scope.remove({
              row: scope.rows[index],
              index: index
            })).then(function(removeContinue) {
              if (!removeContinue) {
                return;
              }
              scope.editingRows.splice(index, 1);
              return scope.rows.splice(index, 1);
            });
          };
          scope.callAdd = function() {
            return $q.when(scope.add({
              row: scope.addRow
            })).then(function(addedRow) {
              if (!addedRow) {
                return;
              }
              scope.rows.push(addedRow);
              return scope.addRow = {};
            });
          };
          scope.clearAdd = function() {
            return scope.addRow = {};
          };
          scope.addRow = {};
          return scope.$watchCollection('rows', updateRows);
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
    "<div class=\"table-responsive\">\n" +
    "  <table class=\"table\" style=\"width:100%; table-layout:fixed\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th ng-repeat=\"column in columns\" ng-bind=\"column\"></th>\n" +
    "        <th style=\"width:95px\"></th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"row in editingRows\">\n" +
    "        <td ng-repeat=\"column in columns\">\n" +
    "          <table-input-cell row=\"row\" column=\"column\" edit=\"row._editing\"></table-input-cell>\n" +
    "        </td>\n" +
    "        <td class=\"text-right\">\n" +
    "          <div class=\"btn-group\">\n" +
    "            <button class=\"btn btn-default\" ng-click=\"edit(row)\" ng-if=\"!row._editing\"><i class=\"fa fa-pencil\"></i></button>\n" +
    "            <button class=\"btn btn-danger\" ng-click=\"callRemove(row)\" ng-if=\"!row._editing\"><i class=\"fa fa-times\"></i></button>\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"callSave(row)\" ng-if=\"row._editing\"><i class=\"fa fa-check\"></i></button>\n" +
    "            <button class=\"btn btn-default\" ng-click=\"cancel(row)\" ng-if=\"row._editing\"><i class=\"fa fa-undo\"></i></button>\n" +
    "          </div>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "      <tr>\n" +
    "        <td ng-repeat=\"column in columns\">\n" +
    "          <table-input-cell row=\"addRow\" column=\"column\" edit=\"true\">       </table-input-cell>\n" +
    "        </td>\n" +
    "        <td class=\"text-right\">\n" +
    "          <div class=\"btn-group\">\n" +
    "            <button class=\"btn btn-primary\" ng-click=\"callAdd()\"><i class=\"fa fa-plus\"></i></button>\n" +
    "            <button class=\"btn btn-default\" ng-click=\"clearAdd()\"><i class=\"fa fa-undo\"></i></button>\n" +
    "          </div>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>"
  );


  $templateCache.put('directives/table_input_cell/template.html',
    "<span ng-if=\"!edit\" ng-bind=\"row[column]\"></span>\n" +
    "<input class=\"form-control\" ng-if=\"edit\" type=\"text\" ng-model=\"row[column]\"/>"
  );

}]);
