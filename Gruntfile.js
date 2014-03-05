module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: [
            '/**',
            ' * <%= pkg.name %> - v<%= pkg.version %>',
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>',
            ' * License <%= pkg.license.type %>',
            ' */\n'
        ].join('\n'),

        // Task configuration.
        clean: {
            tmp: [
                '.jshint'
            ]
        },

        jsonmin: {
            jshint: {
                options: {
                    stripWhitespace : true,
                    stripComments   : true
                },
                files: {
                    '.jshint': '.jshintrc'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshint'
            },
            src: [
                'src/*.js'
            ]
        },

        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                    'src/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        umd: {
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: '<%= concat.dist.dest %>',
                indent: '    '
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },

        bowercopy: {
            options: {
                clean: true
            },
            examples: {
                options: {
                    destPrefix: 'examples/assets/vendor'
                },
                files: {
                    'EventEmitter.min.js': 'eventEmitter/EventEmitter.min.js'
                }
            }
        },

        watch: {
            src: {
                files: 'src/*.js',
                tasks: [
                    'lint',
                    'build'
                ]
            }
        }
    });

    // These plugins provide necessary tasks.
    // load all grunt tasks
    require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

    // Default task.
    grunt.registerTask( 'lint', [
        'jsonmin:jshint',
        'jshint',
        'clean:tmp'
    ]);

    grunt.registerTask( 'build', [
        'concat',
        'umd',
        'uglify'
    ]);

    grunt.registerTask( 'examples', [
        'build',
        'bowercopy:examples'
    ]);

    grunt.registerTask( 'default', [
        'lint',
        'build'
    ]);

};
