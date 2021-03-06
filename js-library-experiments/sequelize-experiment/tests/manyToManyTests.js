var Sequelize = require("sequelize");
var Q = require("q");

exports.manyToManyTests = {
  setUp: function(callback) {
    this.sequelize = new Sequelize('database', 'username', 'password', {
      dialect: 'sqlite',
      storage: 'my.db'
    });

    this.Note = this.sequelize.define('Note', {
      content: Sequelize.STRING
    });

    this.Category = this.sequelize.define('Category', {
      name: Sequelize.STRING
    });

    this.Category.hasMany(this.Note);
    this.Note.hasMany(this.Category);

    this.sequelize.sync().success(function() {
      callback();
    }).error(function(e) {      
      throw e;
    });
  },

  tearDown: function(callback) {
    this.sequelize.drop().success(function() {
      callback()
    }).error(function(e) {
      throw e;
    });
  },

  dummy: function(test) {
    var self = this;
    function createCategory(name) {
      var deferred = Q.defer();

      self.Category.create({ name: name }).success(function(category) {
        deferred.resolve(category);
      }).error(function(e) {
        deferred.reject(e);
      });

      return deferred.promise;
    }

    function createNote(content) {
      var deferred = Q.defer();

      self.Note.create({ content: content }).success(function(note) {
        deferred.resolve(note);
      }).error(function(e) {
        deferred.reject(e);
      });

      return deferred.promise;
    }

    function addNoteToCategory(note, category) {
      var deferred = Q.defer();

      note.addCategory(category).success(function() {
        deferred.resolve();
      }).error(function(e) {
        deferred.reject(e);
      });

      return deferred.promise;
    }

    function getNoteWithCategories(noteId) {
      var deferred = Q.defer();

      var options = { 
        where: { id: noteId }, 
        include: [ self.Category ]
      };
      self.Note.find(options).success(function(note) {
        deferred.resolve(note);
      }).error(function(e) {
        deferred.reject(e);
      });

      return deferred.promise;
    }

    Q.all(["js", "articles"].map(function(categoryName) {
      return createCategory(categoryName).then(function(category) {
        return {
          categoryName: categoryName,
          category: category
        };
      });
    })).then(function(nameCategoryPairs) {
      return nameCategoryPairs.reduce(function(categoryMap, nameCategoryPair) {
        categoryMap[nameCategoryPair.categoryName] = nameCategoryPair.category;
        return categoryMap;
      }, {});
    }).then(function(categories) {
      return createNote("hello").then(function(note) {
        return {
          note: note,
          categories: categories
        };
      });
    }).then(function(noteAndCategories) {
      var note = noteAndCategories.note;      
      var jsCategory = noteAndCategories.categories.js;
      var articlesCategory = noteAndCategories.categories.articles;
      
      return Q.all([
        addNoteToCategory(note, jsCategory), 
        addNoteToCategory(note, articlesCategory)
      ]).then(function() {
        return note.id;
      });
    }).then(function(noteId) {
      return getNoteWithCategories(noteId);
    }).then(function(note) {
      test.equal(note.id, 1);
      test.equal(note.content, "hello");
      test.equal(note.Categories.length, 2);
      test.equal(note.Categories[0].id, 1);
      test.equal(note.Categories[0].name, "js");
      test.equal(note.Categories[1].id, 2);
      test.equal(note.Categories[1].name, "articles");
      test.done();
    });
  }
};
