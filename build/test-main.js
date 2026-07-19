const assert = require('assert');
const { filterContent, extractNumber } = require('../main.js');

// extractNumber
assert.strictEqual(extractNumber('20+'), 20);
assert.strictEqual(extractNumber('24/7'), 24);
assert.strictEqual(extractNumber('100%'), 100);
assert.strictEqual(extractNumber('NOA'), null);

// filterContent
const data = [
  { titulo: 'Excarcelaciones', texto: 'Pedidos de libertad y morigeración de prisión preventiva', url: 'servicios.html#excarcelaciones' },
  { titulo: '¿Puedo negarme a declarar?', texto: 'Sí, es un derecho constitucional', url: 'faq.html#declarar' },
];
assert.strictEqual(filterContent('excarce', data).length, 1);
assert.strictEqual(filterContent('declarar', data).length, 1);
assert.strictEqual(filterContent('inexistente', data).length, 0);
assert.strictEqual(filterContent('', data).length, 0);

console.log('main.js: todos los tests pasaron');
