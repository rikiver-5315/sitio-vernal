function classifyUrgency(input) {
  let nivel;
  if (input.detencionEnCurso || input.allanamiento) nivel = 'urgente';
  else if (input.notificacionFormal) nivel = 'alto';
  else nivel = 'preventiva';

  const pesoDelito = { 'contravencional-menor': 0, 'delito-comun': 1, 'delito-complejo': 2 };
  let complejidad = ['baja', 'media', 'alta'][pesoDelito[input.tipoDelito]];
  if (nivel === 'urgente' && complejidad === 'baja') complejidad = 'media';

  const recomendacionesPorNivel = {
    urgente: [
      'Comunicate de inmediato por WhatsApp o teléfono: la actuación en las primeras horas es clave.',
      'No firmes ni declares nada sin asistencia letrada presente.',
      'Anotá horarios, lugar y nombres de los funcionarios intervinientes.',
    ],
    alto: [
      'Reuní toda la documentación de la notificación o citación recibida.',
      'Agendá la consulta antes de la fecha de audiencia indicada.',
      'No respondas requerimientos del MPF sin asesoramiento previo.',
    ],
    preventiva: [
      'Programá una consulta para evaluar tu situación con anticipación.',
      'Reuní antecedentes y documentación relevante antes de la reunión.',
      'Definí junto al abogado una estrategia preventiva.',
    ],
  };

  const tripartito = {
    fiscal: 'El Ministerio Público evalúa la calificación legal de los hechos y la necesidad de medidas cautelares.',
    juez: 'El juez controla la legalidad de lo actuado y resuelve sobre la libertad y las medidas solicitadas.',
    defensa: 'La defensa puede cuestionar la calificación, aportar prueba propia y plantear alternativas a la prisión preventiva.',
  };

  return {
    nivel: nivel,
    complejidad: complejidad,
    recomendaciones: recomendacionesPorNivel[nivel],
    tripartito: tripartito,
    disclaimer: 'Este análisis es orientativo: no predice resultados judiciales, no genera relación abogado-cliente y no reemplaza una entrevista profesional.',
  };
}

if (typeof window !== 'undefined') {
  window.classifyUrgency = classifyUrgency;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { classifyUrgency };
}
