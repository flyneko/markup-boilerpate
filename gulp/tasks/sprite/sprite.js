const gulp        = require('gulp'),
      spritesmith = require('gulp.spritesmith'),
      config      = require('../../config');

gulp.task('sprite:png', function(done) {
    var spriteData = gulp.src(config.src.pngIcons + '/*.png')
        .pipe(spritesmith({
            retinaSrcFilter: config.src.pngIcons +  '/*@2x.png',
            retinaImgName: 'spritesheet@2x.png',
            imgName: 'spritesheet.png',
            cssName: '_sprite-png.sass',
            cssTemplate: 'gulp/tasks/sprite/sass.template.mustache'
        }));

    // Deliver spritesheets to `dist/` folder as they are completed
    spriteData.img.pipe(gulp.dest(config.dest.img + '/'));

    // Deliver CSS to `./` to be imported by `index.scss`
    spriteData.css.pipe(gulp.dest(config.src.sassGen + '/'));

    done();
});