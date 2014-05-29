module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'karma:testConcatenated']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                banner: '/* <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n"use strict";\n',
                separator: '\n',
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
            }
        },

        uglify: {
            options: {
                beautify: {
                    beautify: false,
                    ascii_only: true
                },
                ascii_only: true,
                banner: '/* <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
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
        bower: {
            install: {
                options: {
                    copy: false,
                    verbose: true
                }
            }
        },
        karma: {
            testConcatenated: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            testMinified: {
                configFile: 'karma.conf.min.js',
                singleRun: true
            }
        },

        watch: {
            sources: {
                files: ['<%= concat.angulari18n.src %>', 'test/*.js'],
                tasks: ['default']
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        }
    });
};
