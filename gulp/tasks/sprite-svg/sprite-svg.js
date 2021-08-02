const gulp        = require('gulp'),
      plumber     = require('gulp-plumber'),
      svgmin      = require('gulp-svgmin'),
      svgStore    = require('gulp-svgstore'),
      rename      = require('gulp-rename'),
      cheerio     = require('gulp-cheerio'),
      cheerioS    = require('cheerio'),
      through2    = require('through2'),
      consolidate = require('gulp-consolidate'),
      config      = require('../../config'),
      async       = require('async');

gulp.task('sprite:svg', function(done) {
    const spriteStream = gulp
        .src(config.src.svgIcons + '/**/*.svg')
        .pipe(plumber({
            errorHandler: config.errorHandler
        }))
        .pipe(svgmin({
            js2svg: {
                pretty: true
            },
            plugins: [
                {
                    removeViewBox: false
                },
                {
                    removeDesc: true
                }, {
                    cleanupIDs: true
                }, {
                    mergePaths: false
                }]
        }))
        .pipe(rename({ prefix: 'icon-' }))
        .pipe(svgStore({ inlineSvg: false }));

    async.parallel([
        function handleSymbols (cb) {
            spriteStream.pipe(through2.obj(function(file, encoding, cbl) {
                const $ = cheerioS.load(file.contents.toString(), {xmlMode: true});
                const data = $('svg > symbol').map(function() {
                    const $this  = $(this);
                    const size   = $this.attr('viewBox').split(' ').splice(2);
                    const name   = $this.attr('id');
                    const ratio  = size[0] / size[1]; // symbol width / symbol height
                    const stroke = $this.find('[stroke]').attr('stroke');
                    let fill   = false;
                    let isOneColor = true;

                    $this.find('[fill]:not([fill="currentColor"])').map(function (i) {
                        if (i == 0)
                            fill = $(this).attr('fill');
                        else {
                            if (fill != $(this).attr('fill'))
                                isOneColor = false;
                        }
                    });

                    if ((isOneColor && fill) || ratio != 1)
                        return {
                            name: name,
                            ratio: +ratio.toFixed(2),
                            fill: fill || 'initial',
                            stroke: stroke || 'initial'
                        };
                }).get();

                gulp.src(__dirname + '/_sprite-svg.scss')
                    .pipe(consolidate('lodash', {
                        symbols: data
                    }))
                    .pipe(gulp.dest(config.src.sassGen));

                gulp.src(__dirname + '/sprite.html')
                    .pipe(consolidate('lodash', {
                        symbols: data
                    }))
                    .pipe(gulp.dest(config.dest.root + '/_icons/'))

                cbl();
            })).on('finish', cb);
        },
        function handleFonts (cb) {
            spriteStream
                .pipe(cheerio({
                    run: function($, file) {
                        //$('[fill]:not([fill="currentColor"])').removeAttr('fill');
                        //$('[stroke]').removeAttr('stroke');
                        $('symbol:first-child').prepend( $('<style>g {}</style>'))
                    },
                    parserOptions: { xmlMode: true }
                }))
                .pipe(rename({ basename: 'sprite' }))
                .pipe(gulp.dest(config.dest.img))
                .on('finish', cb);
        }
    ], done);
});

gulp.task('sprite:svg:watch', function() {
    gulp.watch(config.src.svgIcons + '/**/*.svg', gulp.series('sprite:svg'));
});