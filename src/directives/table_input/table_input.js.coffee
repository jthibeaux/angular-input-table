angular
.module('angular-table-input')
.directive 'tableInput', [
  '$q'
  ($q)->
    templateUrl: 'directives/table_input/template.html'
    scope:
      rows: '='
      columns: '='
      save: '&'
      remove: '&'
      add: '&'
    link: (scope)->
      updateRows = ->
        scope.editingRows = _.map(
          scope.rows,
          (row)-> _.pick(row, scope.columns)
        )

      copyRow = (to, from)->
        _.merge(
          to,
          _.pick(from, scope.columns)
        )

      rowIndex = (row)->
        scope.editingRows.indexOf(row)

      scope.edit = (row)->
        row._editing = true

      scope.cancel = (row)->
        row._editing = false
        copyRow(row, scope.rows[rowIndex(row)])

      scope.callSave = (row)->
        $q.when(scope.save(row: row))
        .then (savedRow)->
          row._editing = false
          index = rowIndex(row)
          copyRow(scope.rows[index], savedRow)
          copyRow(scope.editingRows[index], savedRow)

      scope.callRemove = (row)->
        index = rowIndex(row)
        $q.when(scope.remove(row: scope.rows[index]))
        .then ->
          scope.editingRows.splice(index, 1)
          scope.rows.splice(index, 1)

      scope.callAdd = ->
        $q.when(scope.add(row: scope.addRow))
        .then (addedRow)->
          scope.rows.push(addedRow)
          scope.addRow = {}

      scope.clearAdd = ->
        scope.addRow = {}

      scope.addRow = {}
      scope.$watchCollection 'rows', updateRows
]
