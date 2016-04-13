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

    dir = {
        src: './source/',
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

/*******************************************************************
 ******************* Compile Tasks *********************************
 *******************************************************************/

//Copy All Dependencies
gulp.task('cpy-dependencies', function () {
    return gulp.src(dir.dependencies, { cwd: dir.src, base: dir.src})
        .pipe(gulp.dest(dir.release))
});

//Clean Folder Before Build
gulp.task('cls', function () {
    return gulp.src(dir.release)
        .pipe(clean({
            force: true,
            read: false
        }));
});

//Replace blocks of html code with builds
gulp.task('CompileHtml', function () {
    return gulp.src('**/*.html.twig', {cwd: dir.src})
        .pipe(useref())
        .pipe(gulp.dest(dir.release));
});

//Compile Client part TypeScript with sourcemaps
gulp.task('cmp-ts-client', function () {
    var tsProject = ts.createProject('tsconfig.json', {"out": "client.js"});
    return gulp.src('client/**/*.ts', {cwd: dir.src + dir.scripts.ts})
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write(dir.styles.maps))
        .pipe(gulp.dest(dir.release + dir.scripts.js));
});

//Compile Admin part TypeScript with sourcemaps
gulp.task('cmp-ts-admin', function () {
    var tsProject = ts.createProject('tsconfig.json', {"out": "admin.js"});
    return gulp.src('admin/**/*.ts', {cwd: dir.src + dir.scripts.ts})
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write(dir.styles.maps))
        .pipe(gulp.dest(dir.release + dir.scripts.js));
});

//Compile scss witch sourcemaps without PostCSS
gulp.task('cpm-scss-debug', function () {
    return gulp.src(['client.scss', 'admin.scss'], {cwd: dir.src + dir.styles.scss})
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write(dir.styles.maps))
        .pipe(gulp.dest(dir.release + dir.styles.css));
});

/*******************************************************************
******************* Release Tasks **********************************
********************************************************************/

//Minify all Javascript
gulp.task('MinifyJS', function () {
    return gulp.src('**/*.js', {cwd: dir.release})
        .pipe(uglify())
        .pipe(gulp.dest(dir.release));
});

//Clean all maps
gulp.task('cls-maps', function () {
    return gulp.src('**/*.map', {cwd: dir.release})
        .pipe(clean({
            force: true,
            read: false
        }));
});

//Compile scss with PostCSS
gulp.task('cpm-scss-release', function () {
    return gulp.src(['client.scss', 'admin.scss'], {cwd: dir.src + dir.styles.scss})
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(shorthand())
        .pipe(cssnano())
        .pipe(gulp.dest(dir.release + dir.styles.css));
});

//Delete unused styles and minify
gulp.task('PostCSS',['uncss-Bootstrap'], function(){
    return gulp.src('**/*.css', {cwd: dir.release + dir.styles.css})
    .pipe(shorthand())
    .pipe(cssnano())
    .pipe(gulp.dest(dir.release + dir.styles.css));
});

//Uncss Bootstrap3
gulp.task('uncss-Bootstrap', function(){
    return gulp.src('bootstrap.css', {cwd: dir.release + dir.styles.css})
        .pipe(uncss({
            html: [dir.release + 'views/*.html.twig', dir.release + dir.html + '**/*.tpl'],
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
        .pipe(gulp.dest(dir.release + dir.styles.css));
});

//Pre-release compile
gulp.task('prerelease', ['cls'], function(){
    gulp.start('cpy-dependencies');
    gulp.start('CompileHtml');
    gulp.start('cmp-ts-client');
    gulp.start('cmp-ts-admin');
    gulp.start('cpm-scss-release');
});


/*******************************************************************
 ******************* Global Tasks **********************************
 ********************************************************************/

gulp.task('watcher', function () {
    gulp.watch(dir.src + dir.styles.scss + '**/*.scss', ['cpm-scss-debug']);
    gulp.watch(dir.src + dir.scripts.ts + '**/*.ts', ['cmp-ts-client', 'cmp-ts-admin']);
});

gulp.task('debug', ['cls'], function(){
    gulp.start('cpy-dependencies');
    gulp.start('CompileHtml');
    gulp.start('cmp-ts-client');
    gulp.start('cmp-ts-admin');
    gulp.start('cpm-scss-debug');
});

gulp.task('release', ['cpy-dependencies', 'CompileHtml', 'cmp-ts-client', 'cmp-ts-admin', 'cpm-scss-release'], function(){
    gulp.start('cls-maps');
    gulp.start('MinifyJS');
    gulp.start('PostCSS');
});

