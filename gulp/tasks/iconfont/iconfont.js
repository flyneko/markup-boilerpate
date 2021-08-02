const gulp         = require('gulp'),
      async        = require('async'),
      iconfont     = require('gulp-iconfont'),
      consolidate  = require('gulp-consolidate'),
      _            = require('lodash'),
      config       = require('../../config');
// var runTimestamp = Math.round(Date.now() / 1000);

const fontProps = {
    fontName: 'iconfont',
    fontPath:  '../fonts/iconfont/',
    className: 'ticon',
    random: Math.round(Math.random() * 1000000000)
};

gulp.task('iconfont', function(done) {
    const iconStream = gulp.src([config.src.svgFontIcons + '/*.svg'])
        .pipe(iconfont({
            fontName: fontProps.fontName,
            formats: ['woff', 'woff2'],
            // appendUnicode: true,
            // timestamp: runTimestamp,
            normalize: true,
            fontHeight: 1001,
            fontStyle: 'normal',
            fontWeight: 'normal'
        }));

    async.parallel([
        function handleGlyphs (cb) {
            iconStream.on('glyphs', function(glyphs, options) {
                const props = {...fontProps, glyphs};
                gulp.src(__dirname + '/_iconfont.scss')
                    .pipe(consolidate('lodash', props))
                    .pipe(gulp.dest(config.src.sassGen))
                    .on('finish', () => {
                        gulp.src(__dirname + '/_iconfont-utils.scss')
                            .pipe(consolidate('lodash', props))
                            .pipe(gulp.dest(config.src.sassGen));

                        gulp.src(__dirname + '/iconfont.html')
                            .pipe(consolidate('lodash', props))
                            .pipe(gulp.dest(config.dest.root + '/_icons/'));
                    });
            })
            .on('finish', cb);
        },
        function handleFonts (cb) {
            iconStream
                .pipe(gulp.dest(config.dest.fonts + '/' + fontProps.fontName))
                .on('finish', cb);
        }
    ], done);
});

gulp.task('iconfont:watch', function() {
    gulp.watch(config.src.svgFont + '/*.svg', gulp.series('iconfont'));
});
