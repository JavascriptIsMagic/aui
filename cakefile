require 'cake-gulp'
uglify = require 'gulp-uglify'

option '-w', '--watch', 'Watch files for changes.'

option '-p', '--port [port]', 'Static File Server port.'
task 'build:staticserver', 'Hosts a static server to test examples', (options) ->
  send = try require 'send'
  if send?
    require 'http'
      .createServer (request, response) ->
        log "--> #{request.url}"
        response.setHeader 'Cache-Control', 'max-age=0, no-cache, no-store'
        # response.setHeader 'Cache-Control', 'private, no-cache, no-store, must-revalidate'
        # response.setHeader 'Expires', '-1'
        # response.setHeader 'Pragma', 'no-cache'
        send request, request.url, root: __dirname
          .pipe response
        request.on 'end', ->
          log "#{(if response.statusCode < 400 then green else red) "<-- [#{response.statusCode}] #{request.url}"}"
      .listen options.port, ->
        console.log "http://localhost:#{options.port}"

coffeeFiles = ["#{__dirname}/src/**/*.coffee"]
task 'build:coffee', 'Builds CoffeScript files from src/*.coffee to dist/*.js', (options, callback) ->
  src coffeeFiles
    .pipe sourcemaps.init()
      .pipe (
        coffee bare: no
          .on 'error', log)
    .pipe sourcemaps.write()
    .pipe debug title: 'coffee:'
    .pipe dest "#{__dirname}/dist"
  callback()
task 'build:coffee:minify', 'Builds CoffeScript files from src/*.coffee to dist/*.js', (options, callback) ->
  src coffeeFiles
    .pipe sourcemaps.init()
      .pipe (
        coffee bare: no
          .on 'error', log)
      .pipe rename extname: '.min.js'
      .pipe uglify()
    .pipe sourcemaps.write "."
    .pipe debug title: 'minify coffee:'
    .pipe dest "#{__dirname}/dist"
  callback()

task 'build', 'Builds all the files for this project, -w to watch for file changes.', ['build:coffee', 'build:coffee:minify'], (options) ->
  if options.port
    invoke 'build:staticserver', options
  if options.watch
    log "[#{green 'Watching'}] /lib/**/*.coffee files"
    watch coffeeFiles, ['build:coffee', 'build:coffee:minify']
