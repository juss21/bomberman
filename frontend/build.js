/* Build script designed to compress framework functionality into a singular js file */
var compressor = require("node-minify");
var replace = require("replace-in-file");

console.log("Building process started.\n\n");

var minify_path_compressed = "./dist/framework.min.js";
var minify_path_no_compress = "./dist/framework.js";
var console_match_REGEX = /console.(log)/g;

var options = {
  files: minify_path_compressed,
  from: console_match_REGEX,
  to: "noop", // no operation
};

var console_log_removal = () => {
  replace(options)
    .then(() => {
      console.log(`finished replacing "console.log" with "noop"\n\n`);
    })
    .catch((err) => {
      console.log(`error replacing "console.log" with "noop":`, err, "\n\n");
    });

  console.log("build finished!");
};

compressor.minify({
  compressor: `no-compress`,
  input: `./framework/**/*.js`,
  output: minify_path_no_compress,
  buffer: 1000 * 1024,
  callback: function (err, compressed_code) {
    if (!err) {
      console.log(`finished mergind js files to "/dist/framework.js"! \n\n`);
    }
  },
});

compressor.minify({
  compressor: `gcc`,
  input: `./framework/**/*.js`,
  output: minify_path_compressed,
  buffer: 1000 * 1024,
  options: {
    compilation_level: "ADVANCED_OPTIMIZATIONS",
    language: "ECMASCRIPT5",
  },
  callback: function (err, min) {
    if (!err) {
      console.log(
        'finished minifying js files to "/dist/framework.js", now replacing "console.log" with "noop" function \n\n'
      );
      console_log_removal();
    }
  },
});
