module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat:{
          vendor:{
              src:['src/js/vendor/jquery-3.2.1.js','src/js/vendor/vue.js','src/js/vendor/particles.js'],
              dest:'build/js/vendor.js'
          },
          app:{
              src:['src/js/*.js'],
              dest:'build/js/app.js'
          }
      },
      less:{
          site:{
            options:{
                compress:true,
            },
            files:{
                'build/css/main.css':'src/less/main.less',
                'build/css/bootstrap.css':'src/less/vendor/bootstrap/bootstrap.less'
            }
        }
      },
      uglify:{
          js:{
              files:{
                  'build/js/vendor.js':'build/js/vendor.js',
                  'build/js/app.js':'build/js/app.js',
              }
          }
      },
      copy:{
          html:{
            'cwd':'src/html',
            'src':'*.html',
            'dest':'build',
            'expand':true
            },
            data:{
            'cwd':'src/data',
            'src':'**',
            'dest':'build/data',
            'expand':true
            },
      },
      watch: {
            scripts: {
              files: ['src/**'],
              tasks: ['default'],
              options: {spawn: false}
            }
      },
    clean: ['build/**'],
    'gh-pages': {
      options: {
        base: 'build'
      },
      src: ['**']
    },
    connect: {
      server:{
      options:{
        port: 8080,
        base: './build'
      }
    }
    },
    'json-minify': {
    build: {
      files: 'build/**/*.json'
    }
  }
  
   });
  
  
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-json-minify');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('default', ['concat', 'copy', 'less']);

    grunt.registerTask('dev', ['default','connect', 'watch']);

    grunt.registerTask('prod', ['clean','default','uglify', 'json-minify']);

    grunt.registerTask('publish', ['prod', 'gh-pages']);
  };
  