describe 'tableInputCell', ->
  element = undefined
  $scope = undefined

  lazy 'row', ->
    columnName: 'someData'
  lazy 'column', -> 'columnName'
  lazy 'edit', -> false

  lazy 'fixture', ->
    """
    <table-input-cell row="row" column="column" edit="edit"></table-input-cell>
    """

  beforeEach ->
    module('angular-table-input')

  beforeEach inject ($rootScope, $compile)->
    $scope = $rootScope.$new()

    $scope.row = row
    $scope.column = column
    $scope.edit = edit

    element = angular.element(fixture)
    element = $compile(element)($scope)
    $scope.$digest()

  it 'renders row/column content', ->
    expect(element.text()).toContain(row[column])

  describe 'edit is true', ->
    lazy 'edit', -> true

    it 'renders input with row/column value', ->
      expect(element.find('input').val()).toEqual(row[column])
