module.exports = function(grunt) {

  grunt.initConfig({
    pug: {
      compile: {
        options: {
          client: false,
          pretty: true,
          data: {
            debug: process.env.DEBUG == "true"
          }
        },
        files: [ {
          cwd: "src",
          src: "**/*.jade",
          dest: "tmp/html",
          expand: true,
          ext: ".html"
        }]
      }
    },
    coffeelint: {
      app: ['src/**/*.js.coffee'],
      spec: ['spec/**/*.js.coffee']
    },
    coffee: {
      app: {
        expand: true,
        flatten: false,
        cwd: 'src',
        src: "**/*.js.coffee",
        dest: 'tmp/js/',
        ext: '.js'
      },
      spec: {
        expand: true,
        flatten: false,
        cwd: 'spec',
        src: "**/*.js.coffee",
        dest: 'tmp/spec/',
        ext: '.js'
      }
    },
    ngtemplates: {
      'angular-table-input': {
        cwd: 'tmp/html',
        src: '**/*.html',
        dest: 'tmp/js/templates.js'
      }
    },
    uglify: {
      build: {
        src: 'dist/angular_table_input.js',
        dest: 'dist/angular_table_input.min.js'
      }
    },
    concat: {
      moduleJs: {
        src: ['tmp/js/module.js', 'tmp/js/**/*.js'],
        dest: 'dist/angular_table_input.js'
      }
    },
    clean: {
      build: ['tmp', 'dist']
    },
    jasmine: {
      app: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/lodash/lodash.js',
          'bower_components/angular/angular.js',
          'bower_components/angular-mocks/angular-mocks.js',
          'bower_components/jthibeaux-jasmine-lazy/src/lazy.js',
          'dist/angular_table_input.js'
        ],
        options: {
          specs: 'tmp/spec/**/*.js'
        }
      }
    },
    connect: {
      server: {
        options: {
          base: '.',
          keepalive: true,
          port: 8000
        }
      }
    },
    watch: {
      coffeelint: {
        files: ['src/**/*.js.coffee', 'spec/**/*.js.coffee'],
        tasks: ['coffeelint']
      },
      coffee: {
        files: ['src/**/*.js.coffee', 'spec/**/*.js.coffee'],
        tasks: ['coffee']
      },
      js: {
        files: ['tmp/js/*.js'],
        tasks: ['uglify']
      },
      uglify: {
        files: ['dist/angular_table_input.js'],
        tasks: ['uglify']
      },
      pug: {
        files: ['src/**/*.jade'],
        tasks: ['pug']
      },
      templates: {
        files: ['tmp/html/**/*.html'],
        tasks: ['ngtemplates']
      },
      concat: {
        files: [
          'tmp/js/**/*.js'
        ],
        tasks: ['concat']
      },
      jasmine: {
        files: ['tmp/js/*.js', 'tmp/spec/*.js'],
        tasks: ['jasmine:app:build']
      }
    }
  });

  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-watchify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('release', ['clean', 'build'])
  grunt.registerTask('build', ['coffeelint','coffee', 'pug', 'ngtemplates', 'concat', 'uglify']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('spec', ['build', 'jasmine']);
};
