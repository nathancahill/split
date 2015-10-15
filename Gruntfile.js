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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
};
