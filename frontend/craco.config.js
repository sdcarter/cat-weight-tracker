module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Enable caching
      webpackConfig.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
      
      // Disable source maps in production
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.devtool = false;
      }
      
      // Optimize Plotly.js bundle size
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'plotly.js': 'plotly.js-basic-dist',
      };
      
      return webpackConfig;
    },
  },
};