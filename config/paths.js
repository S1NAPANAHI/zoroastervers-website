const path = require('path');

const srcPath = path.resolve(__dirname, '../src');
const testsPath = path.resolve(__dirname, '../tests');

module.exports = {
  '@': srcPath,
  '@components': `${srcPath}/components`,
  '@lib': `${srcPath}/lib`,
  '@styles': `${srcPath}/styles`,
  '@tests': testsPath,
  '@contexts': `${srcPath}/contexts`,
  '@app': `${srcPath}/app`,
  '@types': `${srcPath}/types`,
  '@data': `${srcPath}/data`,
  '@services': `${srcPath}/services`,
};
