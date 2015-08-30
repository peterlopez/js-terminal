module.exports = function(grunt) {
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
            
      jshint: {
        files: ['Gruntfile.js', 'src/*.js', 'src/*.*.js', 'js-terminal.js'],
        options: {
           globals: {
              jQuery: true,
              console: true,
              module: true,
              document: true
           }
        }
      },
      
      concat: {
         js: {
            src: [
               'begin.utils.js',
               'src/*.js',
               'end.utils.js'
            ],
            dest: 'js-terminal.js'
         }
      },
      
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
         tasks: ['jshint', 'concat', 'uglify']
      },
   });

   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-jshint');
  
   grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
