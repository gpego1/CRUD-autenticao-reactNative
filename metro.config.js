// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Solução para o erro <anonymous>
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => (req, res, next) => {
    if (req.url.includes('<anonymous>') || req.url.includes('\\temp\\')) {
      return res.end();
    }
    return middleware(req, res, next);
  },
  useGlobalWatchman: false
};

// Otimização para Windows
config.watchFolders = [__dirname];
config.resolver = {
  ...config.resolver,
  blockList: [/\/__tests__\/.*/]
};

module.exports = config;