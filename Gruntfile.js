module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

    // this would be run by typing "grunt test" on the command line
    grunt.registerTask('test', ['jshint', 'karma']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                banner: '/* <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n"use strict";\n',
                separator: ';\n',
                process: function (src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            angulari18n: {
                src: [
                    'src/app.js',
                    'src/services/*.js',
                    'src/filters/*.js',
                    'src/directives/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
        },

        uglify: {
            options: {
                beautify: {
                    beautify: false,
                    ascii_only: true
                },
                ascii_only: true,
                banner: '/* <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            angulari18n: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.angulari18n.dest %>']
                }
            }
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: '.jshintrc'
            },
            sources: {
                src: ['<%= concat.angulari18n.src %>']
            }
        },

        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            watch: {
                background: true
            },
            continuous: {
                singleRun: true
            }
        },

        watch: {
            sources: {
                files: ['<%= concat.angulari18n.src %>', 'Gruntfile.js'],
                tasks: ['newer:jshint', 'concat', 'uglify']
            }
        }
    });
};
