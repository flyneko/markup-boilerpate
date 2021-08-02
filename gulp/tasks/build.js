const gulp   = require('gulp'),
      config = require('../config');

require('require-dir')('.', {recurse: true});

function build(cb) {
   return gulp.series(
        cb,
        'nunjucks',
        'iconfont',
        'sass',
        'sprite:svg',
        'sprite:png',
        'copy',
    );
}

gulp.task('build', build(function(done) {
    config.setEnv('production');
    config.logEnv();
    done();
}));

gulp.task('build:dev', build(function(done) {
    config.setEnv('development');
    config.logEnv();
    done();
}));
