const assert = require('assert');
const { classifyUrgency } = require('../quiz-urgencia.js');

const urgente = classifyUrgency({ detencionEnCurso: true, allanamiento: false, notificacionFormal: false, tipoDelito: 'delito-comun' });
assert.strictEqual(urgente.nivel, 'urgente');

const urgentePorAllanamiento = classifyUrgency({ detencionEnCurso: false, allanamiento: true, notificacionFormal: false, tipoDelito: 'contravencional-menor' });
assert.strictEqual(urgentePorAllanamiento.nivel, 'urgente');

const alto = classifyUrgency({ detencionEnCurso: false, allanamiento: false, notificacionFormal: true, tipoDelito: 'delito-comun' });
assert.strictEqual(alto.nivel, 'alto');

const preventiva = classifyUrgency({ detencionEnCurso: false, allanamiento: false, notificacionFormal: false, tipoDelito: 'contravencional-menor' });
assert.strictEqual(preventiva.nivel, 'preventiva');

[urgente, urgentePorAllanamiento, alto, preventiva].forEach(function (r) {
  assert.ok(!/%/.test(JSON.stringify(r)), 'no debe contener porcentajes');
  assert.ok(r.disclaimer.length > 0);
  assert.ok(r.tripartito.fiscal && r.tripartito.juez && r.tripartito.defensa);
});

console.log('quiz-urgencia.js: todos los tests pasaron');
