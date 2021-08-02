const gulp        = require('gulp'),
      config      = require('../config'),
      del         = require('del');

require('require-dir')('.', {recurse: true});

gulp.task('clean', function (done) {
    del([config.dest.root + '/**/*']);
    done();
})

gulp.task('default', gulp.series('clean', 'nunjucks', 'iconfont', 'sass', 'sprite:svg', 'sprite:png', 'copy', 'watch'));
