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

      scope.edit = (row)->
        row._editing = true

      scope.cancel = (row, index)->
        row._editing = false
        copyRow(row, scope.rows[index])

      scope.callSave = (row, index)->
        $q.when(
          scope.save(
            row: row
            index: index
          )
        )
        .then (savedRow)->
          row._editing = false
          return unless savedRow

          copyRow(scope.rows[index], savedRow)
          copyRow(scope.editingRows[index], savedRow)

      scope.callRemove = (row, index)->
        $q.when(
          scope.remove(
            row: scope.rows[index]
            index: index
          )
        )
        .then (removeContinue)->
          return unless removeContinue
          scope.editingRows.splice(index, 1)
          scope.rows.splice(index, 1)

      scope.callAdd = ->
        $q.when(scope.add(row: scope.addRow))
        .then (addedRow)->
          return unless addedRow
          scope.rows.push(addedRow)
          scope.addRow = {}

      scope.clearAdd = ->
        scope.addRow = {}

      scope.addRow = {}
      scope.$watchCollection 'rows', updateRows
]
