const path = require('path');

module.exports = {
  root: path.resolve(__dirname, '../'),
  entryPath: path.resolve(__dirname, '../app/main'),
  outputPath: path.resolve(__dirname, '../public'),
  commonAppImagesPath: path.resolve(__dirname, '../app/common-ui/images'),
  appImagesPath: path.resolve(__dirname, '../app/images'),
  scriptPath: path.resolve(__dirname, '../app'),
  testPath: path.resolve(__dirname, '../test'),
  indexPath: path.resolve(__dirname, '../index.html'),
  loginHtmlPath: path.resolve(__dirname, '../login.html'),
  imagesFolder: 'static/images',
  fontsFolder: 'styles/fonts',
  cssFolder: 'static/styles/css',
  jsFolder: 'static/js',
  host: '0.0.0.0', //'localhost',
  port: process.env.PORT || 9090,
  accountId: '',
  target: 'http://127.0.0.1:4545',
  auth: 'user:password',
  cookie: 'PRIVACERAPAIGSESSION=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTczOTUyOTQwMX0.zVCQInPFy-L1Om93pfDUSwnXgBSXh_Zt9yUbd0ywjzI'
};