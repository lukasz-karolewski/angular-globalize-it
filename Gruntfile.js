module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.registerTask('default', ['build', 'test']);
    grunt.registerTask('build', ['jshint', 'concat', 'ngAnnotate', 'uglify']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('publish', ['bump-only:patch', 'refreshPkg', 'default', 'changelog', 'bump-commit']);

    grunt.task.registerTask('refreshPkg', 'Refresh config.pkg after bump-only', function() {
        grunt.config('pkg', grunt.file.readJSON('package.json'));
    });

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
                    'src/**/*.js',
                    '!**/*Spec.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        ngAnnotate: {
            options: {
                add: true,
                remove: true,
                singleQuotes: true
            },
            dist: {
                src: ['<%= concat.angulari18n.dest %>'],
                dest: '<%= concat.angulari18n.dest %>'
            }
        },

        uglify: {
            options: {
                beautify: {
                    beautify: false,
                    ascii_only: true
                },
                ascii_only: true,
                sourceMap: true,
                sourceMapName: 'dist/<%= pkg.name %>.map',
                banner: '/* <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            angulari18n: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= ngAnnotate.dist.dest %>']
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
            testConcat: {
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

        changelog: {
            options: {
                //editor: "notepad++.exe"
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        }
    });
};
