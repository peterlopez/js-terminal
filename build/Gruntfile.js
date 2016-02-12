module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      // Check source code and compiled source code for errors
      jshint: {
        files: ['../src/*.js', '../jquery.terminal.js'],
        options: {
           globals: {
              jQuery: true,
              console: true,
              module: true,
              document: true
           }
        }
      },

      /*
      * Compile files in /src using compileSource
      * then, add jQuery wrapper to compiled source code using addToEnds
      */
      concat: {
         compileSource: {
            src: [
               '../src/*.js',
               '!../src/*.utils.js',
               'end.utils.js'
            ],
            dest: '../jquery.terminal.js'
         },
         addWrapper: {
            src: [
               '../src/begin.utils.js',
               '../jquery.terminal.js',
               '../src/end.utils.js'
            ],
            dest: '../jquery.terminal.js'
         }
      },

      // Minify/compress source code
      uglify: {
        options: {
           banner: '/*! <%= pkg.name %> */\n'
        },
        build: {
           files: {
              '../jquery.terminal.min.js': '../jquery.terminal.js',
           }
        }
      },

      watch: {
        files: ['../src/*.js'],
         tasks: ['jshint', 'concat:compileSource', 'concat:addWrapper', 'uglify']
      },
   });

   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-jshint');

   grunt.registerTask('default', ['jshint', 'concat:compileSource', 'concat:addWrapper', 'uglify']);
};
