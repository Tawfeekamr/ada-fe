const gulp = require("gulp");
const postcss = require("gulp-postcss");
const cssnano = require("gulp-cssnano");
const nested = require("postcss-nested");
const postcssLogical = require("postcss-logical");
const dir = require("postcss-dir-pseudo-class");
const next = require("postcss-cssnext");
const importFile = require("postcss-import");

const sassFilesDirs = ["src/styles"];

// ... variables
const watchedFiles = sassFilesDirs.map(sassDir => `${sassDir}/**/*.css`);
// ... variables
const inputFile = "./src/styles/main.css";
// const inputFile = './src/styles/**/*.css';
const outputDir = "./src";
const buildDir = "./build";
// const autoprefixerOptions = {
//   browsers: ['last 1 version'],
// };
const plugins = [importFile(), postcssLogical(), dir(), next(), nested()];
gulp.task("css", () => {
  return gulp
    .src(inputFile)
    .pipe(postcss(plugins))
    .on("error", function(err) {
      this.emit("end");
    })
    .pipe(cssnano())
    .pipe(gulp.dest(outputDir));
});
gulp.task("cssBuild", () => {
  return gulp
    .src(inputFile)
    .pipe(postcss(plugins))
    .on("error", function(err) {
      this.emit("end");
    })
    .pipe(cssnano())
    .pipe(gulp.dest(buildDir));
});

gulp.task("watch", () => {
  return gulp.watch(watchedFiles, ["css"]).on("change", event => {
    console.log(`File ${event.path} was ${event.type} running tasks...`);
  });
});
gulp.task("set-build-env", function() {
  return (GENERATE_SOURCEMAP = "false");
});
// gulp.task("build", ["cssBuild"]);
// gulp.task("build", ["set-build-env"], function () {
//   ["cssBuild"];
// });
// gulp.task("default", ["css"]);
gulp.task("default", ["set-build-env"], function() {
  ["css"];
});
