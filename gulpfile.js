"use strict";
/*eslint-disable*/


var gulp = require("gulp"),
    stylus = require("gulp-stylus"),
    livereload = require("gulp-livereload"),
    run = require("gulp-run"),
    path = require("path");


var config = {
        rawPath: {
            js: "res/prejs/**/*.js",
            stylus: "res/precss/**/*.styl"
        },
        distPath: {
            js: "res/js",
            stylus: "res/css"
        }
    },
    changedFile = "";


gulp.task("js", function() {
    // var babelPresets = ["es2015", "env", "babili"];
    var babelPresets = ["env"];

    var babelCompiler = babel({
        presets: babelPresets
    });

    babelCompiler.on("error", function(e) {
        console.log(e);
        babelCompiler.end();
    });

    var file = config.rawPath.js,
        dest = config.distPath.js;

    if (changedFile !== "") {
        file = changedFile;
        dest = parsePath(file).replace("prejs", "js");
        changedFile = "";
    }

    return gulp.src(file)
        .pipe(babelCompiler)
        .pipe(gulp.dest(dest))
        .pipe(livereload());
});


gulp.task("stylus", function() {
    var stylusCompiler = stylus({
        compress: true
    });

    stylusCompiler.on("error", function(e) {
        console.log(e);
        stylusCompiler.end();
    });

    var file = config.rawPath.stylus,
        dest = config.distPath.stylus;

    if (changedFile !== "") {
        file = changedFile;
        dest = parsePath(file).replace("precss", "css");
        changedFile = "";
    }

    return gulp.src(file)
        .pipe(stylusCompiler)
        .pipe(gulp.dest(dest))
        .pipe(livereload());
});


gulp.task("watch", function() {
    var shouldQuit = false;

    livereload.listen({
        port: 35729,
        quiet: true
    });

    gulp.watch(config.rawPath.js)
        .on("unlink", function(file) {
            console.log("File removed: " + file.path);
        })
        .on("add", function(file) {
            console.log("File added: " + file.path);
        })
        .on("change", function(file) {
            console.log("File: " + file.path);
            changedFile = file.path;
            gulp.start("js");
        });


    gulp.watch(config.rawPath.jsx)
        .on("change", function(file) {
            console.log("File: " + file.path);
            changedFile = file.path;
            gulp.start("jsx");
        });


    gulp.watch(config.rawPath.stylus)
        .on("change", function(file) {
            console.log("File: " + file.path);
            changedFile = file.path;
            gulp.start("stylus");
        })
        .on("unlink", function(file) {
            console.log("File removed: " + file.path);
        })
        .on("add", function(file) {
            console.log("File added: " + file.path);
        });

});


gulp.task("default", ["js", "stylus", "watch"]);



function parsePath(file) {
    var filePath = file.substr(file.indexOf("res")),
        itemName = file.substr(file.lastIndexOf("\\"), file.length),
        dest = filePath;

    // dest = dest.substr(dest.indexOf("\\") + 1, dest.length);
    dest = dest.replace(itemName, "");

    return dest;
}
