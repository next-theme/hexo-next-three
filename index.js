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

  const scripts = [];
  ['lines', 'sphere', 'waves'].forEach(name => {
    if (config[name].enable) scripts.push(config[name].cdn || `lib/${name}.js`);
  });

  const html = `<script type="module">import * as THREE from "${config.cdn || '{{ url_for("lib/three.js") }}'}"; window.THREE = THREE;</script>` + scripts.map(script => {
    return `<script defer src="{{ url_for("${script}") }}"></script>`;
  }).join('');
  injects.footer.raw('three', html);
});

hexo.extend.generator.register('three', async () => {
  // Bypass ERR_PACKAGE_PATH_NOT_EXPORTED
  const files = [{ data: utils.getFileContent(path.join(path.dirname(require.resolve('three')), 'three.module.min.js')), path: 'lib/three.js' }];
  ['lines', 'sphere', 'waves'].forEach(name => {
    files.push(generator({ src: path.join(__dirname, `src/${name}.js`), dest: `lib/${name}.js` }));
  });
  return files;
});
