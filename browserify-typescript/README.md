# Browserify TypeScript Task
Use Browserify to transpile and bundle your TypeScript source files.

## API

### browserifyBuild([options])

Returns a [stream](http://nodejs.org/api/stream.html) of [Vinyl files](https://github.com/wearefractal/vinyl-fs)
that can be [piped](http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options).

#### Available options:
- **watch** (boolean) Whether to watch for changes or not. Default: `false`.
- **src** (string|File|Array) String, file object, or array of those types (they may be mixed) specifying Browserify entry file(s). Default: `['./app/app.ts', './typings/main.d.ts']`.
- **outputPath** (string) Output path for the bundle and sourcemaps. Default: `'www/build/js/'`.
- **outputFile** (string) Name for the bundle. Default: `'app.bundle.js'`.
- **browserifyOptions** (Object) [Browserify options](https://github.com/substack/node-browserify#browserifyfiles--opts). Default:
```
{
  cache: {},
  packageCache: {},
  debug: true
}
```
- **watchifyOptions** (Object) [Watchify options](https://github.com/substack/watchify#watchifyb-opts) if `watch` is true. Default: `{}`.
- **tsifyOptions** (Object) [Tsify options](https://github.com/TypeStrong/tsify#options). Default: `{}`.


## Example

```
var browserifyBuild = require('ionic-gulp-browserify-typescript');

gulp.task('build', browserifyBuild);

gulp.task('watch', function(){
  return browserifyBuild({ watch: true });
});
```





