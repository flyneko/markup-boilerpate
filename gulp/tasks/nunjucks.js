const gulp           = require('gulp'),
      nunjucksRender = require('gulp-nunjucks-render'),
      plumber        = require('gulp-plumber'),
      gulpif         = require('gulp-if'),
      changed        = require('gulp-changed'),
      prettify       = require('gulp-prettify'),
      frontMatter    = require('gulp-front-matter'),
      config         = require('../config');

function renderHtml(onlyChanged) {
    const manageEnvironment = function(environment) {
        environment.addFilter('number_format', function(number, decimals, decPoint, thousandsSep) {
            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');

            const n = !isFinite(+number) ? 0 : +number,
                  prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                  sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
                  dec = (typeof decPoint === 'undefined') ? '.' : decPoint,
                  toFixedFix = (n, prec) => {
                    const k = Math.pow(10, prec);
                    return '' + (Math.round(n * k) / k).toFixed(prec)
                  };

            const s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')

            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
            }

            if ((s[1] || '').length < prec) {
                s[1] = s[1] || ''
                s[1] += new Array(prec - s[1].length + 1).join('0')
            }

            return s.join(dec)
        });

        environment.addGlobal('js_include', function (src) {
            return '<script type="text/javascript" src="' + src + '?' + Math.round(Date.now() / 1000) + '"></script>';
        });

        environment.addGlobal('css_include', function (src) {
            return '<link rel="stylesheet" type="text/css" href="' + src + '?' + Math.round(Date.now() / 1000) + '">';
        });
    };

    nunjucksRender.nunjucks.configure({
        watch: false,
        trimBlocks: true,
        lstripBlocks: false,
        autoescape: false
    });

    gulp
        .src([config.src.templates + '/**/[^_]*.nunj'])
        .pipe(plumber({
            errorHandler: config.errorHandler
        }))
        .pipe(gulpif(onlyChanged, changed(config.dest.html)))
        .pipe(frontMatter({ property: 'data' }))
        .pipe(nunjucksRender({
            manageEnv: manageEnvironment,
            data: {
                random: Math.round(Math.random() * 1000000000)
            },
            PRODUCTION: config.production,
            path: [config.src.templates]
        }))
        .pipe(prettify({
            indent_size: 2,
            wrap_attributes: 'auto', // 'force'
            preserve_newlines: false,
            unformatted: ['pre', 'code', 'a'],
            end_with_newline: true
        }))
        .pipe(gulp.dest(config.dest.html));
}

gulp.task('nunjucks', function(done) {
    renderHtml();
    done();
});

gulp.task('nunjucks:changed', function(done) {
    renderHtml(true);
    done();
});

gulp.task('nunjucks:watch', function() {
    gulp.watch([
        config.src.templates + '/**/[^_]*.nunj'
    ], gulp.series('nunjucks:changed'));

    gulp.watch([
        config.src.templates + '/**/_*.nunj'
    ], gulp.series('nunjucks'));
});
