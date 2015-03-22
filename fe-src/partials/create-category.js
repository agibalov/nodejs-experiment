angular.module('directives.categories.categoryEditor2', ['app.directives.utils'])
.directive('createCategory', function() {
  return {
    restrict: 'E',
    scope: {
      create: '&',
      busy: '='
    },
    template:
    '<h3>Create category</h3>' +
    '<form ng-submit="onSubmit()" validation-facade="vf">' + 
    '  <fieldset ng-disabled="busy">' +
    '    <div class="form-group" ng-class="{' + "'has-error'" + ':vf.isError(' + "'name'" + ')}">' +
    '      <label for="name" class="control-label">Name</label>' +
    '      <input type="text" class="form-control" id="name" name="name" ng-model="category.name">' +
    '      <p class="help-block" ng-if="vf.isError(' + "'name'" + ')">{{vf.getFieldError(' + "'name'" + ')}}</p>' +
    '    </div>' +
    '    <div class="form-group">' +
    '      <button type="submit" class="btn btn-default">Create</button>' +
    '    </div>' +
    '  </fieldset>' +
    '</form>',
    link: function(scope) {
      scope.category = makeCategoryTemplate();

      scope.onSubmit = function() {
        scope.vf.setAllFieldsValid();
        scope.create({
          category: scope.category
        }).then(function() {
          scope.category = makeCategoryTemplate();
        }, function(error) {
          scope.vf.setFieldErrors(error);
        });
      };

      function makeCategoryTemplate() {
        return {
          name: ''
        };
      };
    }
  };
})
.directive('categoryItem', function() {
  return {
    restrict: 'E',
    scope: {
      category: '=',
      busy: '=',
      onDelete: '&',
      onUpdate: '&'
    },
    template:
    '<div ng-if="!editingCategory">' +
    '  <span class="badge category-id">{{category.id}}</span>' +
    '  <span class="category-name">{{category.name}}</span>' +
    '  <button ng-click="deleteCategory()" class="btn btn-default" ng-class="{' + "'disabled': busy" + '}">Delete</button>' +
    '  <button ng-click="switchToEditMode()" class="btn btn-default" ng-class="{' + "'disabled': busy" + '}">Edit</button>' +
    '</div>' +
    '<div ng-if="editingCategory">' +
    '  <form ng-submit="updateCategory(vf)" validation-facade="vf">' +
    '    <fieldset ng-disabled="busy">' +
    '      <div class="form-group" ng-class="{' + "'has-error'" + ':vf.isError(' + "'name'" + ')}">' +
    '        <label for="name" class="control-label">Name</label>' +
    '        <input type="text" class="form-control" id="name" name="name" ng-model="editingCategory.name">' +
    '        <p class="help-block" ng-if="vf.isError(' + "'name'" + ')">{{vf.getFieldError(' + "'name'" + ')}}</p>' +
    '      </div>' +
    '      <div class="form-group">' +
    '        <button type="submit" class="btn btn-default">Update</button>' +
    '        <button type="button" class="btn btn-default" ng-click="switchToViewMode()">Cancel</button>' +
    '      </div>' +
    '    </fieldset>' +
    '  </form>' +
    '</div>',
    link: function(scope) {
      scope.editingCategory = null;

      scope.deleteCategory = function() {
        scope.onDelete({
          category: scope.category
        });
      };

      scope.switchToEditMode = function() {        
        scope.editingCategory = angular.copy(scope.category);
      };

      scope.switchToViewMode = function() {
        scope.editingCategory = null;
      };

      scope.updateCategory = function(validationFacade) {        
        validationFacade.setAllFieldsValid();
        scope.onUpdate({
          updatedCategory: scope.editingCategory
        }).then(function() {
          scope.switchToViewMode();
        }, function(error) {          
          validationFacade.setFieldErrors(error);
        });
      };
    }
  };
});
