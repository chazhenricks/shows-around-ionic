module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      options: {
        predef: [ "document", "console", "$", "firebase", "$localStorage", "navigator" ],
        esnext: true,
        globalstrict: true,
        globals: {"angular": true, "app": true}
      },
      files: ['www/app/**/*.js']
    },
    sass: {
      dist: {
        files: {
          'www/css/styles.css' : 'www/sass/styles.scss'
        }
      }
    },
    watch: {
      javascripts: {
        files: ['www/app/**/*.js'],
        tasks: ['jshint']
      },
      sass: {
        files: ['www/sass/**/*.scss'],
        tasks: ['sass']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['jshint','sass', 'watch']);
};

