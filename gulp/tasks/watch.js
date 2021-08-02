const gulp = require('gulp');

gulp.task('watch', gulp.parallel('nunjucks:watch', 'sass:watch', 'sprite:svg:watch', 'iconfont:watch', 'copy:watch'));
