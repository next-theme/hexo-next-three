/* global hexo */

'use strict';

const Util = require('@next-theme/utils');
const utils = new Util(hexo, __dirname);
const path = require('path');
const Terser = require('terser');

function generator(src, dist) {
  let code = utils.getFileContent(src);
  return {
    path: dist,
    data: Terser.minify(code).code
  };
}

hexo.extend.filter.register('theme_inject', injects => {

  let config = utils.defaultConfigFile('three', 'default.yaml');
  if (!config.enable) return;

  let scripts = [config.cdn || 'lib/three.js'];
  ['lines', 'sphere', 'waves'].forEach(name => {
    if (config[name].enable) scripts.push(config[name].cdn || `lib/${name}.js`);
  });

  const html = scripts.map(script => {
    return `<script${config.defer ? ' defer' : ''} src="{{ url_for("${script}") }}"></script>`;
  }).join('');
  injects.footer.raw('three', html);
});

hexo.extend.generator.register('three', () => {
  let files = [generator(require.resolve('three'), 'lib/three.js')];
  ['lines', 'sphere', 'waves'].forEach(name => {
    files.push(generator(path.join(__dirname, `src/${name}.js`), `lib/${name}.js`));
  });
  return files;
});
