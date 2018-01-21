module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat:{
          vendor:{
              src:['src/js/vendor/jquery-3.2.1.js',
                   'src/js/vendor/vue.min.js',
                   'src/js/vendor/particles.js',
                   'src/js/vendor/fontawesome/fontawesome-all.js',
                   'src/js/vendor/retina.js',
                   'src/js/vendor/howler.core.js'
                  ],
              dest:'build/js/vendor.js'
          },
          app:{
              src:['src/js/util.js','src/js/app.js'],
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
              },
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
            img:{
              'cwd':'src/img',
              'src':'**',
              'dest':'build/img',
              'expand':true
            },
            fontawesome:{
                'cwd':'src/css',
                'src':'**',
                'dest':'build/css',
                'expand':true
              },
              fontawesome:{
                'cwd':'src/sfx',
                'src':'**',
                'dest':'build/sfx',
                'expand':true
              }
      },
      minifyHtml: {
        options: {
            cdata: true,
            removeAttributeQuotes:false,
        },
        dist: {
            files: {
                'build/index.html': 'build/index.html'
            }
        }
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
        },
    },
    cacheBust: {
        default: {
            options: {
                assets: ['build/js/**','build/css/**'],
                queryString: true  
            },
            src: ['build/index.html']
        }
    },
    cssmin: {
        default: {
            files:{
                'build/css/fa-svg-with-js.css':['build/css/fa-svg-with-js.css']
            }
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
    grunt.loadNpmTasks('grunt-http');
    grunt.loadNpmTasks('grunt-minify-html');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Tasks 
    grunt.registerTask('default', ['concat', 'copy', 'less', 'cacheBust']);

    grunt.registerTask('dev', ['default', 'connect', 'watch']);

    grunt.registerTask('prod', ['clean','default','uglify', 'minifyHtml', 'json-minify','cssmin']);

    grunt.registerTask('publish', ['prod', 'gh-pages']);
  };
  