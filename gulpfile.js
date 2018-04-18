const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
// Include Our Plugins
const eslint = require('gulp-eslint')
const projectFolders = ['*.js', 'src/**/*.js', 'src/**/**/*.js', 'src/**/**/**/*.js']
const testFiles = ['*spec.js', 'src/*spec.js', 'src/core/**/*spec.js', 'src/core/*spec.js', 'src/core/**/**/*spec.js', 'src/core/**/**/**/*spec.js']
// Lint Task for standard
gulp.task('lint', () => {
  return gulp.src(projectFolders)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
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


// Watch Files For Changes
gulp.task('watch', () => {
  gulp.watch(projectFolders, ['lint'])
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
gulp.task('default', ['start', 'lint','watch'])
