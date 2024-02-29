const fs = require("fs");
const path = require("path");

class CopyFilesPlugin {
  constructor(options) {
    // Options can include source and destination paths
    this.options = options || {};
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync("CopyFilesPlugin", (compilation, callback) => {
      function copyFilesSync(source, destination) {
        // Resolve absolute paths
        const absoluteSource = path.resolve(source);
        const absoluteDestination = path.resolve(destination);

        // Check if the destination directory exists, and create it if necessary
        if (!fs.existsSync(absoluteDestination)) {
          fs.mkdirSync(absoluteDestination, { recursive: true });
        }

        // Read the content of the source directory
        const files = fs.readdirSync(absoluteSource);

        // Iterate through the files and copy them to the destination
        files.forEach((file) => {
          const sourceFile = path.join(absoluteSource, file);
          const destinationFile = path.join(absoluteDestination, file);

          // Check if it's a directory, and recursively copy its content
          if (fs.statSync(sourceFile).isDirectory()) {
            fs.mkdirSync(destinationFile, { recursive: true });
            copyFilesSync(sourceFile, destinationFile);
          } else {
            fs.copyFileSync(sourceFile, destinationFile);
          }
        });
      }

      copyFilesSync(this.options.source, this.options.destination);

      callback();
    });
  }
}

module.exports = CopyFilesPlugin;
