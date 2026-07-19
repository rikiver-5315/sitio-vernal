const assert = require('assert');
const { classifyCivilCase } = require('../wizard-civil.js');

const baja = classifyCivilCase({ tipoProceso: 'ejecutivo', pruebaDisponible: 'completa', plazoAudiencia: 'mas-30-dias' });
assert.strictEqual(baja.complejidad, 'baja');

const alta = classifyCivilCase({ tipoProceso: 'ordinario', pruebaDisponible: 'escasa', plazoAudiencia: 'sin-fecha' });
assert.strictEqual(alta.complejidad, 'alta');

const media = classifyCivilCase({ tipoProceso: 'sumario', pruebaDisponible: 'parcial', plazoAudiencia: 'menos-30-dias' });
assert.strictEqual(media.complejidad, 'media');

[baja, media, alta].forEach(function (r) {
  assert.ok(!/%|\d+\s*%/.test(r.mensaje), 'no debe contener porcentajes: ' + r.complejidad);
  assert.ok(!/%/.test(r.cargaProueba));
});

console.log('wizard-civil.js: todos los tests pasaron');
