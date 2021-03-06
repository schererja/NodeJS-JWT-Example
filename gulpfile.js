const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
// Include Our Plugins
const eslint = require('gulp-eslint');

const projectFolders = ['*.js', 'src/**/*.js', 'src/**/**/*.js', 'src/**/**/**/*.js'];
const testFiles = ['*spec.js', 'src/*spec.js', 'src/core/**/*spec.js', 'src/core/*spec.js', 'src/core/**/**/*spec.js', 'src/core/**/**/**/*spec.js'];
// Lint Task for standard
gulp.task('lint', () => gulp.src(projectFolders)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError()));


// Watch Files For Changes
gulp.task('watch', () => {
  gulp.watch(projectFolders, ['lint']);
  gulp.watch('scss/*.scss', ['sass']);
});
// Nodemon task
gulp.task('start', () => {
  nodemon({
    script: 'src/server.js',
    ext: 'js html',
    env: { NODE_ENV: 'development' },
  });
});

// Default Task
gulp.task('default', gulp.series(['start', 'lint', 'watch']));
