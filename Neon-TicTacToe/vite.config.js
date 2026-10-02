const { defineConfig } = require('vite');

module.exports = defineConfig({
  root: 'www',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
