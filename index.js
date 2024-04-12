/* global hexo */

'use strict';

const Util = require('@next-theme/utils');
const utils = new Util(hexo, __dirname);
const path = require('path');
const Terser = require('terser');

function generator({ src, dest }) {
  const code = utils.getFileContent(src);
  return Terser.minify(code).then(({ code }) => ({
    path: dest,
    data: code
  }));
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
  // Bypass ERR_PACKAGE_PATH_NOT_EXPORTED
  const files = [{ src: require.resolve('./node_modules/three/build/three.js'), dest: 'lib/three.js' }];
  ['lines', 'sphere', 'waves'].forEach(name => {
    files.push({ src: path.join(__dirname, `src/${name}.js`), dest: `lib/${name}.js` });
  });
  return files.map(generator);
});
