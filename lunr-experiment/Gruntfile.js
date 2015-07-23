module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      all: {
        src: ['./test.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', 'mochaTest');
};
