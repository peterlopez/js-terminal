module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      // Check source code and compiled source code for errors
      jshint: {
        files: ['Gruntfile.js', 'src/*.js', 'js-terminal.js'],
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
               'src/*.js',
               '!src/*.utils.js',
               'end.utils.js'
            ],
            dest: 'js-terminal.js'
         },
         addToEnds: {
            src: [
               'src/begin.utils.js',
               'js-terminal.js',
               'src/end.utils.js'
            ],
            dest: 'js-terminal.js'
         }
      },

      // Minify/compress source code
      uglify: {
        options: {
           banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
           files: {
              'js-terminal.min.js': 'js-terminal.js',
           }
        }
      },
      
      watch: {
        files: ['src/*.js', 'begin.js', 'end.js'],
         tasks: ['jshint', 'concat:compileSource', 'concat:addToEnds', 'uglify']
      },
   });

   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-jshint');

   grunt.registerTask('default', ['jshint', 'concat:compileSource', 'concat:addToEnds', 'uglify']);
};
