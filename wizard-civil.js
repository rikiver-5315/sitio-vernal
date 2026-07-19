function classifyCivilCase(input) {
  const pesoProceso = { ejecutivo: 0, sumario: 1, ordinario: 2 };
  const pesoPrueba = { completa: 0, parcial: 1, escasa: 2 };
  const pesoPlazo = { 'mas-30-dias': 0, 'menos-30-dias': 1, 'sin-fecha': 2 };

  const score = pesoProceso[input.tipoProceso] + pesoPrueba[input.pruebaDisponible] + pesoPlazo[input.plazoAudiencia];
  const complejidad = score <= 1 ? 'baja' : score <= 3 ? 'media' : 'alta';

  const cargaProuebaTexto = {
    completa: 'Contás con elementos de prueba sólidos para sostener tu posición procesal.',
    parcial: 'Tenés parte de la prueba necesaria; conviene reforzar los puntos débiles antes de la audiencia.',
    escasa: 'La prueba disponible es limitada; es prioritario definir una estrategia de producción probatoria cuanto antes.',
  }[input.pruebaDisponible];

  const mensajePorComplejidad = {
    baja: 'El proceso presenta una complejidad procesal baja: los plazos y el tipo de trámite son manejables con una preparación estándar.',
    media: 'El proceso presenta una complejidad procesal media: conviene planificar la estrategia probatoria con margen de tiempo.',
    alta: 'El proceso presenta una complejidad procesal alta: se recomienda asesoramiento inmediato para no perder plazos ni prueba clave.',
  }[complejidad];

  return { complejidad: complejidad, cargaProueba: cargaProuebaTexto, mensaje: mensajePorComplejidad };
}

if (typeof window !== 'undefined') {
  window.classifyCivilCase = classifyCivilCase;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { classifyCivilCase };
}
