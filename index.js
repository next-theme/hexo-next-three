/* global hexo */

'use strict';

const Util = require('@next-theme/utils');
const utils = new Util(hexo, __dirname);
const path = require('path');
const Terser = require('terser');
const Promise = require('bluebird');

function generator([src, dist]) {
  const code = utils.getFileContent(src);
  return new Promise((resolve, reject) => {
    Terser.minify(code).then(({ code }) => {
      resolve({
        path: dist,
        data: code
      });
    });
  });
}

hexo.extend.filter.register('theme_inject', injects => {

  const config = utils.defaultConfigFile('three', 'default.yaml');
  if (!config.enable) return;

  const scripts = [config.cdn || 'lib/three.js'];
  ['lines', 'sphere', 'waves'].forEach(name => {
    if (config[name].enable) scripts.push(config[name].cdn || `lib/${name}.js`);
  });

  const html = scripts.map(script => {
    return `<script${config.defer ? ' defer' : ''} src="{{ url_for("${script}") }}"></script>`;
  }).join('');
  injects.footer.raw('three', html);
});

hexo.extend.generator.register('three', async () => {
  const files = [[require.resolve('three'), 'lib/three.js']];
  ['lines', 'sphere', 'waves'].forEach(name => {
    files.push([path.join(__dirname, `src/${name}.js`), `lib/${name}.js`]);
  });
  return files.map(generator);
});
