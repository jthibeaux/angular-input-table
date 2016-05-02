
describe 'tableInput', ->
  element = undefined
  $scope = undefined
  $q = undefined

  lazy 'cellData', -> 'someData'
  lazy 'row', ->
    columnName: cellData
  lazy 'rows', ->
    [row]
  lazy 'columns', ->
    ['columnName']

  lazy 'fixture', ->
    """
    <table-input
      rows="rows"
      columns="columns"
      add="add(row)"
      save="save(row)"
      remove="remove(row)"
    ></table-input>
    """

  lazy 'removeSpy', -> jasmine.createSpy('remove')

  lazy 'saveSpy', -> jasmine.createSpy('save').and.callFake (row)-> return row

  lazy 'addSpy', -> jasmine.createSpy('add').and.callFake (row)-> return row

  beforeEach ->
    module('angular-table-input')

  beforeEach inject ($rootScope, $compile, _$q_)->
    $q = _$q_
    $scope = $rootScope.$new()

    $scope.rows = rows
    $scope.columns = columns
    $scope.remove = removeSpy
    $scope.save = saveSpy
    $scope.add = addSpy

    element = angular.element(fixture)
    element = $compile(element)($scope)
    $scope.$digest()

  it 'renders column header', ->
    expect(element.find('thead').text()).toContain('columnName')

  it 'renders row', ->
    expect(element.find('tr:eq(1)').text()).toContain(cellData)

  describe 'removing', ->
    beforeEach ->
      element.find('tr:eq(1) .fa-times').click()
      $scope.$digest()

    it 'removes item from table', ->
      expect(element.find('tr:eq(1)').text()).not.toContain(cellData)

    it 'invokes remove', ->
      expect(removeSpy).toHaveBeenCalledWith(row)

    describe 'remove fails', ->
      lazy 'removeSpy', ->
        jasmine.createSpy('remove').and.returnValue($q.reject())

      it 'does not remove item from table', ->
        expect(element.find('tr:eq(1)').text()).toContain(cellData)

  describe 'editing', ->
    lazy 'newValue', -> 'something else'
    beforeEach ->
      element.find('tr:eq(1) .fa-pencil').click()
      $scope.$digest()
      element.find('tr:eq(1) input').val(newValue).change()
      $scope.$digest()

    it 'renders input for cell', ->
      expect(element.find('tr:eq(1) input').val()).toEqual(newValue)

    describe 'canceling', ->
      beforeEach ->
        element.find('tr:eq(1) .fa-undo').click()
        $scope.$digest()

      it 'restores original value', ->
        expect(element.find('tr:eq(1)').text()).toContain(cellData)

    describe 'saving', ->
      beforeEach ->
        element.find('tr:eq(1) .fa-check').click()
        $scope.$digest()

      it 'retains new value', ->
        expect(element.find('tr:eq(1)').text()).toContain(newValue)

      it 'changes original row value', ->
        expect(rows[0].columnName).toEqual(newValue)

      describe 'save fails', ->

        lazy 'saveSpy', ->
          jasmine.createSpy('save').and.returnValue($q.reject())

        it 'stays in edit mode', ->
          expect(element.find('tr:eq(1) input').val()).toEqual(newValue)

        it 'leaves original row value', ->
          expect(rows[0].columnName).toEqual(cellData)

  describe 'adding', ->
    lazy 'addedValue', -> 'something new'

    beforeEach ->
      element.find('tr:eq(2) input').val(addedValue).change()
      $scope.$digest()

    describe 'added', ->
      beforeEach ->
        element.find('tr:eq(2) .fa-plus').click()
        $scope.$digest()
        $scope.$digest()

      it 'adds new row to the table', ->
        expect(element.find('tr').length).toEqual(4)

      it 'sets new row column to value of input', ->
        expect(element.find('tr:eq(2)').text()).toContain(addedValue)

      it 'adds row to original row array', ->
        expect(rows.length).toEqual(2)

      describe 'add fails', ->

        lazy 'addSpy', ->
          jasmine.createSpy('add').and.returnValue($q.reject())

        it 'does not add new row to the table', ->
          expect(element.find('tr').length).toEqual(3)

        it 'does not add row to original row array', ->
          expect(rows.length).toEqual(1)

    describe 'clearing', ->
      beforeEach ->
        element.find('tr:eq(2) .fa-undo').click()
        $scope.$digest()

      it 'clears the add input', ->
        expect(element.find('tr:eq(2) input').val()).toEqual('')
