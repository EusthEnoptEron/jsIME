var targz = require('tar.gz');
var parser = require("./lib/parser");
var fs = require("fs");

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      vanilla: {
        src: 'vanilla/build.js',
        dest: 'vanilla/build.min.js'
      }
    },
    curl: {
        "build/<%= pkg.config.edict_file %>.tar.gz":"<%= pkg.config.edict_location %>/<%= pkg.config.edict_file %>.tar.gz"
    },
    "get-edict": {
        "build/":"build/<%= pkg.config.edict_file %>.tar.gz"
    },
    parse: {
        server: {
            threshold: 0,
            src: "build/<%= pkg.config.edict_file %>/<%= pkg.config.edict_file %>",
            dest: "edict.json"
        },
        client: {
            threshold: 20000,
            src: "build/<%= pkg.config.edict_file %>/<%= pkg.config.edict_file %>",
            dest: "build/edict_mini.json"
        }
    },
    concat: {
        dict: {
            options: {
                banner: "module.exports = ",
                footer: ";"
            },
            src: ["build/edict_mini.json"],
            dest: "build/dict.js"
        },
        vanilla: {
            src: [
                "lib/browser/*.js",
                "build/module.js",
            ],
            dest: "vanilla/build.js"
        }
    },
    browserify: {
        vanilla: {
         dest:'build/module.js',
         src: 'vanilla/index.js',
            options: {
              aliasMappings: [
                {
                  cwd: "lib",
                  src: ["edict.js", "localstore.js", "serverstore.js"],
                  dest: ""
                },
                {
                    cwd: "build",
                    src: "dict.js",
                    dest: ""
                }
              ]
            }
        }
     
    },
    clean: {
        build: ["build"],
        release: [],
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerMultiTask('get-edict', "Fetch edict file from server", function(a) {
   
    if(!grunt.file.exists(this.file.src)) {
        grunt.task.run("curl", "get-edict");
    } else {
        var done = this.async();
        var compress = new targz().extract(this.file.src, this.file.dest, function(err){
            if(err) {
            }
            done(err);
        });
    }
  });

  grunt.registerMultiTask("parse", "Parse edict file", function() {
    var done = this.async();
    var self = this;

    parser.parse(this.file.src, this.data.threshold, function(dict) {
        fs.writeFile(self.file.dest, JSON.stringify(dict), done);
    });
  });

  grunt.registerTask("build-server", ["get-edict", "parse:server"]);
  grunt.registerTask("build-client", [
    "get-edict",
    "parse:client",
    "concat:dict",
    "browserify",
    "concat:vanilla",
    "uglify:vanilla"]);

  grunt.registerTask("build", ["build-server", "build-client"]);
  grunt.registerTask("default", ["build"]);
  grunt.registerTask("compile", ["concat:dict", "browserify", "concat:vanilla", "uglify:vanilla"]);
};
