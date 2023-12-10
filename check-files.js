const fs = require('fs');
const { execSync } = require('child_process');

const existsFilePath = 'dist/sprites/abra.gif'; // Update with your destination file path
const sourceFilePath = 'src/sprites/'; // Update with your source file path
const destinationFilePath = 'dist/sprites'; // Update with your destination file path

function copyFile(source, destination) {
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    // Use appropriate Windows copy command
    const copyCommand = `xcopy "${source}" "${destination}" /E /I /H /Y`;
    execSync(copyCommand);
  } else {
    // Assume Unix-like environment (Linux, macOS)
    const copyCommand = `cp -r "${source}" "${destination}"`;
    execSync(copyCommand);
  }
}

if (!fs.existsSync(existsFilePath)) {
  console.log('Missing sprite files in initial prepare. Copying...');
  copyFile(sourceFilePath, destinationFilePath);
  console.log('Sprite files copied.');
} else {
  // Sprite files already exist. No need to copy.
}