const path = require('path');
const packageJSON = require('./package.json');

module.exports = function override(config) {
  config.module.rules = [
    // salesforce dependencies
    // this will compile salesforce lightning as src, not as package
    {
      test: /\.jsx?$/,
      include: ['node_modules/@salesforce/design-system-react'].map(someDir =>
        path.resolve(process.cwd(), someDir),
      ),
      loader: require.resolve('babel-loader'),
      options: {
        presets: ['react-app'],
      },
    },
  ].concat(config.module.rules);

  // Move runtime into bundle instead of separate file
  config.optimization.runtimeChunk = false;

  // don't split bundle
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false,
    },
  };

  // load React libraries separately
  config.externals = {
    react: 'React',
    'react-dom': 'ReactDOM',
  };

  // Entry Point for npm run build
  config.entry = path.join(__dirname, 'src', 'index-lightning.js');
  // Global Variable TO call from bundle
  config.output.library = `${packageJSON.name}`;
  // Universal Module Definition
  config.output.libraryTarget = 'umd';
  // JS
  config.output.filename = `${packageJSON.name}.resource.js`;
  // CSS. "5" is MiniCssPlugin
  config.plugins[5].options.filename = `${packageJSON.name}_style.resource.css`;

  return config;
};
