const path = require('path');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const sourceMaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const plumber = require('gulp-plumber');
const cache = require('gulp-cache');
const uglify = require('gulp-uglify');
const nodemon = require('gulp-nodemon');
const skip = require('./gulp_skip');

const ENV = 'development';

let __DEVE__ = false;
let __TEST__ = false;

switch(process.env.NODE_ENV){
    case 'production': break;
    case 'staging': break;
    case 'test': __TEST__ = true;
        break;
    default: __DEVE__ = true;
}



const src = path.resolve('src');
const test = path.resolve('test');
const buildPath = path.resolve('bin');
const srcFiles = `${src}/**/*.*`;
const srcJS = `${src}/**/*.js`;
const testFiles = `${test}/**/*.test.js`;

const task =  {
    clearCache(){
        return cache.clearAll();
    },
    test(){
        return gulp.src(testFiles)
            .pipe(mocha({
                require: [ 'babel-core/register' ],
            }))
    },
    lint(){
        return gulp.src([srcJS,'!node_modules/**'])
            .pipe(eslint())
            .pipe(eslint.format())
    },
    babel(){
        return gulp.src(srcFiles)
            .pipe(sourceMaps.init())
            .pipe(plumber())
            .pipe(doBabel())
            .pipe(doUglify())
            .pipe(sourceMaps.write(__DEVE__ ? null : '.'))
            .pipe(gulp.dest(buildPath))
    },
    build(done){
        runSequence('lint', 'babel', done);
    },
    dev(inspect = false){
        return (done) => {
            runSequence('clear-cache', 'build', () => {

                const nodemonConfig = {
                    tasks: ['build'],
                    script: buildPath,
                    watch: ['./src'],
                    env: { 'NODE_ENV': ENV },
                };

                if(inspect){
                    nodemonConfig.exec = 'node --expose-gc --inspect';
                }

                const stream = nodemon(nodemonConfig);

                stream
                    .on('restart', () => {
                        console.log('Restarted')
                    })
                    .on('crash',() => {
                        console.error('Application has crashed!\n');
                    });

                done();
            });
        }
    },
    testWatch(){
        return gulp.watch([srcJS, testFiles], ['test']);
    },
    default(done){
        runSequence('clear-cache', 'build', 'test', done);
    },
};

module.exports = task;

function doBabel(){
    if(__DEVE__ || __TEST__){
        return cache(babel())
    }
    return babel();
}

function doUglify(){
    console.log('test', __TEST__);
    if(__DEVE__){
        return skip()
    }
    return uglify({
        compress: {
            drop_console: __TEST__,
        },
    })
}
