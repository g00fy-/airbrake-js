module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build: { files: [{ expand: true, src: ['src/**'], dest: 'tmp/' }] }
    },
    concat: {
      options: {
        process: true
      },
      dist: {
        src: ['src/header.js', 'src/stacktrace.js', 'src/notifier.js', 'src/footer.js'],
        dest: 'tmp/src/concat-dist.js'
      }
    },
    browserify: {
      legacy: {
        src: ['src/util/**/*.js', '<%= concat.dist.dest %>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['gruntfile.js', 'src/notifier.js', 'src/stacktrace.js', 'src/formatters/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'test/**/*.coffee'],
      tasks: ['test']
    },
    mochacli: {
      all: ['test/**/*.coffee'],
      options: {
        // require: ['should'],
        compilers: [ 'coffee:coffee-script' ],
        files: 'test/**/*.coffee',
        bail: true,
        reporter: 'spec'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.registerTask('test', ['build', 'mochacli', 'jshint']);

  grunt.registerTask('build', ['copy', 'concat', 'browserify']);
  grunt.registerTask('default', ['build']);

};
