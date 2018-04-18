const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
// Include Our Plugins
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const mocha = require('gulp-mocha')
const istanbul = require('gulp-istanbul')
const standard = require('gulp-standard')
const projectFolders = ['*.js', 'src/**/*.js', 'src/**/**/*.js', 'src/**/**/**/*.js']
const testFiles = ['*spec.js', 'src/*spec.js', 'src/core/**/*spec.js', 'src/core/*spec.js', 'src/core/**/**/*spec.js', 'src/core/**/**/**/*spec.js']
// Lint Task for standard
gulp.task('standard', () => {
  return gulp.src(projectFolders)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: false
    }))
})

// Pre-Test for Istanbul

gulp.task('pre-test', () => {
  return gulp.src(projectFolders)
  .pipe(istanbul())
  .pip(istanbul.hookRequire())
})
// Istanbul

gulp.task('test', ['pre-test'], () => {
  return gulp.src(testFiles)
    .pipe(mocha())
})

// Compile Our Sass
gulp.task('sass', () => {
  return gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
})

// Concatenate & Minify JS
gulp.task('scripts', () => {
  return gulp.src('js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})

// Watch Files For Changes
gulp.task('watch', () => {
  gulp.watch(projectFolders, ['standard'])
  gulp.watch('scss/*.scss', ['sass'])
})
// Nodemon task
gulp.task('start', () => {
  nodemon({
    script: 'src/server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  })
})

// Default Task
gulp.task('default', ['start', 'standard', 'sass', 'scripts', 'watch'])
