const fs      = require('fs'),
      gulp    = require('gulp'),
      config  = require('../config.js'),
      concat  = require('gulp-concat'),
      minify  = require('gulp-minify'),
      svgo    = require('gulp-svgo'),
      rename  = require("gulp-rename"),
      vendors = JSON.parse(fs.readFileSync(config.src.root + '/vendors.json'));

gulp.task('copy:temp', function(done) {
    gulp
        .src(config.src.temp + '/**/*.*')
        .pipe(gulp.dest(config.dest.temp));

    done();
});

gulp.task('copy:fonts', function(done) {
    gulp
        .src(config.src.fonts + '/**/*.{ttf,eot,woff,woff2}')
        .pipe(rename(function (path) {
            path.basename = path.dirname;
        }))
        .pipe(gulp.dest(config.dest.fonts));

    done();
});

gulp.task('copy:js', function(done) {
    gulp
        .src(config.src.js + '/**/*.*')
        .pipe(gulp.dest(config.dest.js));
    done();
});

gulp.task('copy:libs', function(done) {
    const js = [],
          css = [];

    Object.entries(vendors).map(([vendorName, vendorList]) => {
        vendorList.map(j => {
            j = `${config.root}/node_modules/${vendorName}/${j}`;
            if (/\.css$/i.test(j))
                css.push(j);
            if (/\.js$/i.test(j))
                js.push(j);

            const pathArr = j.split('/');
            gulp.src(j + '/**/*').pipe(gulp.dest(`${config.dest.vendors}/${vendorName}/${pathArr[pathArr.length - 1]}`));

            //if (fs.lstatSync(j).isDirectory()) {
            //   var pathArr = j.split('/');
            //   gulp.src(j + '/**/*').pipe(gulp.dest(config.dest.vendors + '/' + vendor + '/' + pathArr[pathArr.length - 1]));
            //}
        })
    });

    js.length && gulp.src(js)
        .pipe(concat('vendors.min.js'))
        .pipe(minify({ ext: {min: '.js'}, noSource: true}))
        .pipe(gulp.dest(config.dest.js));

    css.length && gulp.src(css)
        .pipe(concat('vendors.min.css'))
        .pipe(gulp.dest(config.dest.css));

    done();
});

gulp.task('copy:img', function(done) {
    gulp
        .src([
            config.src.img + '/**/*.{jpg,png,jpeg,svg,gif}',
            '!' + config.src.img + '/svgo/**/*.*'
        ])
        .pipe(svgo())
        .pipe(gulp.dest(config.dest.img));
    done();
});

gulp.task('copy', gulp.series('copy:img', 'copy:fonts', 'copy:js', 'copy:libs', 'copy:temp'));

gulp.task('copy:watch', function() {
    gulp.watch(config.src.img + '/**/*.*', gulp.series('copy:img'));
    gulp.watch(config.src.js + '/**/*.*', gulp.series('copy:js'));
    gulp.watch(config.src.root + '/vendors.json', gulp.series('copy:libs'));
    gulp.watch(config.src.temp + '/**/*.*', gulp.series('copy:temp'));
});
