/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var $gruntTools = require('giant-grunt-tools'),
        multiTasks = [].toMultiTaskCollection(),
        gruntTasks = [].toGruntTaskCollection(),
        publicFolder = 'public/';

    $gruntTools.GruntProxy.create()
        .setGruntObject(grunt);

    'clean'
        .toMultiTask({
            common: [publicFolder]
        })
        .setPackageName('grunt-contrib-clean')
        .addToCollection(multiTasks);

    'copy'
        .toMultiTask({
            common: {
                files: [
                    {
                        expand: true,
                        src   : [
                            'images/**'
                        ],
                        dest  : publicFolder
                    },
                    {
                        src : 'templates/index.html',
                        dest: 'public/index.html'
                    }
                ]
            }
        })
        .setPackageName('grunt-contrib-copy')
        .addToCollection(multiTasks);

    'replace'
        .toMultiTask({
            common: {
                src         : 'public/index.html',
                dest        : 'public/index.html',
                replacements: [
                    // rips out all non-controlling comments
                    {
                        from: /\s*<!--\s+[^>]*>/g,
                        to  : ''
                    },

                    // adds body tag
                    {
                        from: /\s*<!--\{\{BODY\}\}-->/g,
                        to  : '<body></body>'
                    }
                ]
            }
        })
        .setPackageName('grunt-text-replace')
        .addToCollection(multiTasks);

    'notify'
        .toMultiTask({
            'build-complete': {
                options: {
                    title  : "Giant Project",
                    success: true,
                    message: "Build completed."
                }
            }
        })
        .setPackageName('grunt-notify')
        .addToCollection(multiTasks);

    'build'.toAliasTask()
        .addSubTasks(
        'clean:common',
        'copy:common',
        'replace:common',
        'build-complete')
        .addToCollection(gruntTasks);

    // registering tasks
    multiTasks.toGruntConfig()
        .applyConfig()
        .getAliasTasksGroupedByTarget()
        .mergeWith(multiTasks.toGruntTaskCollection())
        .mergeWith(gruntTasks)
        .applyTask();
};
