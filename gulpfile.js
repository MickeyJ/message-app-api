const gulp = require('gulp');
const task = require('./gulp.tasks');

gulp.task('test', task.test);
gulp.task('lint', task.lint);
gulp.task('babel', task.babel);
gulp.task('build', task.build);
gulp.task('clear-cache', task.clearCache);
gulp.task('dev', task.dev());
gulp.task('dev-inspect', task.dev(true));
gulp.task('test-watch', ['test'], task.testWatch);
gulp.task('default', task.default);