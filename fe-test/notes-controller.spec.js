describe('NotesController', function() {
  beforeEach(module('notes', function($exceptionHandlerProvider) {
    $exceptionHandlerProvider.mode('log');
  }));

  beforeEach(inject(function($controller, $rootScope, $q, apiService) {
    $controller('NotesController', {
      $scope: $rootScope,
      $q: $q,
      notes: [],
      apiService: apiService
    });
  }));

  it('should publish notes on the scope', inject(function($rootScope) {
    expect($rootScope.notes).toBeDefined();
  }));

  describe('reloadNotes()', function() {
    var getNotesResultDeferred;

    beforeEach(inject(function($rootScope, $q, apiService) {
      getNotesResultDeferred = $q.defer();
      spyOn(apiService, 'getNotes').and.returnValue(getNotesResultDeferred.promise);
      $rootScope.reloadNotes();
    }));

    it('should call apiService.getNotes()', inject(function(apiService) {
      expect(apiService.getNotes).toHaveBeenCalled();
    }));

    describe('when the call to apiService.getNotes() succeeds', function() {
      beforeEach(inject(function($rootScope) {
        $rootScope.$apply(function() {
          getNotesResultDeferred.resolve([{
            id: 123,
            content: 'hello there',
            categories: []
          }]);
        });
      }));

      it('should update the list of notes', inject(function($rootScope) {
        expect($rootScope.notes.length).toBe(1);
      }));
    });

    describe('when call fails', function() {
      beforeEach(inject(function($rootScope, errors) {
        $rootScope.$apply(function() {
          getNotesResultDeferred.reject(new errors.UnexpectedError());
        });
      }));

      it('should throw', inject(function($exceptionHandler, errors) {
        expect($exceptionHandler.errors.length).toBe(1);
        expect($exceptionHandler.errors[0].constructor).toBe(errors.UnexpectedError);
      }));
    });
  });

  describe('createNote()', function() {
    var createNoteResultDeferred;

    beforeEach(inject(function($rootScope, $q, apiService) {
      createNoteResultDeferred = $q.defer();
      spyOn(apiService, 'createNote').and.returnValue(createNoteResultDeferred.promise);
      spyOn($rootScope, 'reloadNotes')
    }));

    it('should call apiService.createNote() when new note is submitted', inject(function($rootScope, apiService) {
      $rootScope.createNote({
        content: 'hello there',
        categories: []
      });

      expect(apiService.createNote).toHaveBeenCalled();
    }));

    describe('when apiService.createNote() finishes', function() {
      beforeEach(inject(function($rootScope) {
        $rootScope.createNote({
          content: 'hello there',
          categories: []
        });
      }));

      describe('successfully', function() {
        beforeEach(inject(function($rootScope) {
          $rootScope.$apply(function() {
            createNoteResultDeferred.resolve({
              id: 123,
              content: 'hello there',
              categories: []
            });
          });
        }));

        it('should request an updated list of notes', inject(function($rootScope) {
          expect($rootScope.reloadNotes).toHaveBeenCalled();
        }));
      });

      describe('with error', function() {
        describe('when error is ValidationError', function() {
          it('should not rethrow it', inject(function($rootScope, errors, $exceptionHandler) {
            $rootScope.$apply(function() {
              createNoteResultDeferred.reject(new errors.ValidationError());
            });

            expect($exceptionHandler.errors.length).toBe(0);
          }));
        });

        describe('when error is UnexpectedError', function() {
          it('should rethrow it', inject(function($rootScope, errors, $exceptionHandler) {
            $rootScope.$apply(function() {
              createNoteResultDeferred.reject(new errors.UnexpectedError());
            });

            expect($exceptionHandler.errors.length).toBe(1);
            expect($exceptionHandler.errors[0].constructor).toBe(errors.UnexpectedError);
          }));
        });

        describe('when error is ConnectivityError', function() {
          it('should rethrow it', inject(function($rootScope, errors, $exceptionHandler) {
            $rootScope.$apply(function() {
              createNoteResultDeferred.reject(new errors.ConnectivityError());
            });

            expect($exceptionHandler.errors.length).toBe(1);
            expect($exceptionHandler.errors[0].constructor).toBe(errors.ConnectivityError);
          }));
        });
      });
    });
  });
});
