
var colors = require('colors');

module.exports = IonicGulp;

function IonicGulp(gulp, config) {
  this.gulp = gulp;
  this.ionicDir = "node_modules/ionic-angular/";

  gulp.task('watch', ['sass', 'copy.fonts', 'copy.html'], function(done){
    var gulpWatch = require('gulp-watch');

    gulpWatch('www/app/**/*.scss', function(){
      this.gulp.start('sass');
    });
    gulpWatch('www/app/**/*.html', function(){
      this.gulp.start('copy.html');
    });

    this.buildWebpack({ watch: true }, done);
  }.bind(this));

  gulp.task('build', ['sass', 'copy.fonts', 'copy.html'], function(done) {
    this.build(opts, done);
  }.bind(this));

  gulp.task('sass', this.buildSass.bind(this));

  gulp.task('copy.fonts', function(){
    return this.copy({
      src: this.ionicDir + 'fonts/fonts/**/*.+(ttf|woff|woff2)',
      dest: 'www/build/fonts'
    });
  }.bind(this));

  gulp.task('copy.html', function(){
    return this.copy({
      src: 'app/**/*.html',
      dest: 'www/build'
    });
  }.bind(this));

  gulp.task('clean', function(done) {
    var del = require('del');
    del(['www/build'], done);
  });
}

IonicGulp.prototype.buildWebpack = function(opts, done) {
  // webpack is huge, so rather than forcing people who may be using browserify
  // to install it, it's a peerDependency
  try {
    var webpack = require('webpack');
  } catch(e) {
    console.log((
      'Uh oh, looks like you\'re trying to build with webpack, but ' +
      'wepback isn\'t installed! Try running:\n'
    ).yellow);
    console.log('   npm install --save-dev webpack\n'.blue);
    return done();
  }

  // prevent gulp calling done callback more than once when watching
  var firstTime = true;
  var config = opts.config || require(process.cwd() + '/webpack.config.js');

  // https://github.com/webpack/docs/wiki/node.js-api#statstojsonoptions
  var defaultStatsOptions = {
    'colors': true,
    'modules': false,
    'chunks': false,
    'exclude': ['node_modules']
  }
  var statsOptions = opts.statsOptions || defaultStatsOptions;

  var compiler = webpack(config);
  if (opts.watch) {
    compiler.watch(null, compileHandler);
  } else {
    compiler.run(compileHandler);
  }

  function compileHandler(err, stats){
    if (firstTime) {
      firstTime = false;
      done();
    }

    // print build stats and errors
    console.log(stats.toString(statsOptions));
  }
}

IonicGulp.prototype.buildSass = function(opts) {
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');

  var autoprefixerOpts = {
    browsers: [
      'last 2 versions',
      'iOS >= 7',
      'Android >= 4',
      'Explorer >= 10',
      'ExplorerMobile >= 11'
    ],
    cascade: false
  };

  return this.gulp.src('app/theme/app.+(ios|md).scss')
    .pipe(sass({
      includePaths: [
        this.ionicDir,
        'node_modules/ionicons/dist/scss'
      ]
    }))
    .on('error', function(err){
      console.error(err.message);
      this.emit('end');
    })
    .pipe(autoprefixer(autoprefixerOpts))
    .pipe(this.gulp.dest('www/build/css'))
}

IonicGulp.prototype.copy = function(opts) {
  return this.gulp.src(opts.src)
    .pipe(this.gulp.dest(opts.dest));
}


