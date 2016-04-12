var gulp = require('gulp'),
    shorthand = require('gulp-shorthand'),
    uncss = require('gulp-uncss'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    useref = require('gulp-useref'),
    ts = require('gulp-typescript'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    tsProject = ts.createProject('tsconfig.json'),

    dir = {
        src: './source/',
        debug: '../www/',
        release: '../www/',
        styles: {
            css: 'css/',
            scss: 'scss/',
            maps: '/'
        },
        scripts: {
            js: 'js/',
            ts: 'ts/',
            maps: '/',
            d: 'ts/typings/'
        },
        img: 'images/',
        html: 'pages/',
        dependencies: [
            'movies/**/*',
            'images/**/*',
            'pages/**/*',
			'index.php',
			'.htaccess',
            '*.!(twig)'
        ]
    };

//********************** Tasks *************************************

gulp.task('cpy-dep-debug', function () {
    return gulp.src(dir.dependencies, { cwd: dir.src, base: dir.src})
        .pipe(gulp.dest(dir.debug))
});

gulp.task('cpy-dep-release', function () {
    return gulp.src(dir.dependencies, { cwd: dir.src, base: dir.src})
        .pipe(gulp.dest(dir.release))
});

/*******************************************************************
 ******************* Build Debug ***********************************
 *******************************************************************/


//Clean Debug Folder
gulp.task('cls-debug', function () {
    return gulp.src(dir.debug)
        .pipe(clean({
            force: true,
            read: false
        }));
});

//Replace blocks of html code with builds
gulp.task('cHtml-debug', function () {
    return gulp.src('**/*.html.twig', {cwd: dir.src})
        .pipe(useref())
        .pipe(gulp.dest(dir.debug));
});

//Compile scss witch sourcemaps
gulp.task('cpm-scss-debug', function () {
    return gulp.src('main.scss', {cwd: dir.src + dir.styles.scss})
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write(dir.styles.maps))
        .pipe(gulp.dest(dir.debug + dir.styles.css));
});

//Compile TypeScript with sourcemaps
gulp.task('cmp-ts-debug', function () {
    return gulp.src('**/*.ts', {cwd: dir.src + dir.scripts.ts})
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write(dir.styles.maps))
        .pipe(gulp.dest(dir.debug + dir.scripts.js));
});



/*******************************************************************
******************* Build Release **********************************
********************************************************************/

//******* Tasks ********

//Clean Release Folder
gulp.task('cls-release', function () {
    return gulp.src(dir.release)
        .pipe(clean({
            force: true,
            read: false
        }));
});

gulp.task('compressVendors-release', function () {
    return gulp.src('js/vendor/*.js', {cwd: dir.release})
        .pipe(uglify())
        .pipe(gulp.dest(dir.release));
});

gulp.task('cHtml-release', function () {
    return gulp.src('**/*.html.twig', {cwd: dir.src})
        .pipe(useref())
        .pipe(gulp.dest(dir.release));
});

//Compile TypeScript
gulp.task('cmp-ts-release', function () {
    return gulp.src('**/*.ts', {cwd: dir.src + dir.scripts.ts})
        .pipe(ts(tsProject))
        .pipe(uglify())
        .pipe(gulp.dest(dir.release + dir.scripts.js));
});

//Compile scss
gulp.task('cpm-scss-release', function () {
    return gulp.src('main.scss', {cwd: dir.src + dir.styles.scss})
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss('app.css'))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(uncss({
            html: [dir.src + 'index.html', dir.src + dir.html + '**/*'],
            ignore: [/\w\.in/,
                '.fade',
                '.collapse',
                '.collapsing',
                /(#|\.)navbar(\-[a-zA-Z]+)?/,
                /(#|\.)dropdown(\-[a-zA-Z]+)?/,
                /(#|\.)(open)/,
                '.modal',
                '.modal.fade.in',
                '.modal-dialog',
                '.modal-document',
                '.modal-scrollbar-measure',
                '.modal-backdrop.fade',
                '.modal-backdrop.in',
                '.modal.fade.modal-dialog',
                '.modal.in.modal-dialog',
                '.modal-open',
                '.in',
                '.modal-backdrop']
        }))
        .pipe(shorthand())
        .pipe(cssnano())
        .pipe(gulp.dest(dir.release + dir.styles.css));
});

/*******************************************************************
 ******************* Global Tasks **********************************
 ********************************************************************/



gulp.task('start', function () {
    setTimeout(function(){console.log("Watching for chages...")},2000);
    gulp.watch(dir.src + dir.styles.scss + '**/*.scss', ['cpm-scss-debug']);
    gulp.watch(dir.src + dir.scripts.ts + '**/*.ts', ['cmp-ts-debug']);
});

gulp.task('debug', ['cls-debug'], function(){
    gulp.start('cpy-dep-debug');
    gulp.start('cHtml-debug');
    gulp.start('cmp-ts-debug');
    gulp.start('cpm-scss-debug');
});
gulp.task('release', ['cls-release'], function(){
    gulp.start('cpy-dep-release');
    gulp.start('cHtml-release');
    gulp.start('cmp-ts-release');
    gulp.start('cpm-scss-release');
});

