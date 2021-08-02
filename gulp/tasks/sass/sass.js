const gulp         = require('gulp'),
      fs           = require('fs'),
      gulpif       = require('gulp-if'),
      cleanCSS     = require('gulp-clean-css'),
      sass         = require('gulp-sass'),
      config       = require('./../../config'),
      postcss      = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      base64       = require('gulp-base64-inline'),
      sassGlob     = require('gulp-sass-glob'),
      atImport     = require("postcss-import"),
      gcmq         = require('gulp-group-css-media-queries'),
      consolidate  = require('gulp-consolidate'),
      path         = require('path');

const processors = [
    autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }),
    atImport({
        addModulesDirectories: ["node_modules", "web_modules"]
    })
];
const fontsJson = JSON.parse(fs.readFileSync(config.src.root + '/fonts.json'));

gulp.task('sass:fonts', function (done) {
    let fonts = [];
    const weightsDefs = {
        'Regular': 'normal',
        'Medium': 500,
        'SemiBold': 600,
        'Bold': 'bold',
        'ExtraBold': 800,
        "Black": 900
    };

    Object.entries(fontsJson).map(([fontName, weights]) => {
        weights.map(weight => {
            fonts.push({
                name: fontName,
                subname: fontName + '-' + weight,
                weight: weightsDefs[weight]
            })
        })
    });

    return gulp.src(__dirname + '/_fonts.scss')
        .pipe(consolidate('lodash', {
            fonts,
            fontsPath: path.relative(config.dest.css, config.dest.fonts)
        }))
        .pipe(gulp.dest(config.src.sassGen))

    //done();
});

gulp.task('sass:native', function(done) {
    gulp
        .src(config.src.sass + '/*.sass')
        .pipe(sassGlob())
        .pipe(sass({
            outputStyle: config.production ? 'compressed' : 'expanded', // nested, expanded, compact, compressed
            precision: 5
        }))
        .pipe(base64('..'))
        .pipe(postcss(processors))
        .pipe(gcmq())
        .pipe(gulpif(config.production, cleanCSS()))
        .pipe(gulp.dest(config.dest.css));

    done();
});

gulp.task('sass', gulp.series('sass:fonts', 'sass:native'));

gulp.task('sass:watch', function() {
    gulp.watch(config.src.sass + '/**/*.{sass,scss}', gulp.series('sass:native'));
});