module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
        test: {
            src: 'split.js',
            options: {
                specs: ['test/split.spec.js']
            }
        }
    },
    uglify: {
      options: {
        banner: '/*! Split.js - v<%= pkg.version %> */\n'
      },
      output: {
        files: {
          'split.min.js': ['split.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
};
