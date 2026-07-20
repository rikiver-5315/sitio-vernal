import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function analyzeCase(facts) {
  const prompt = `Eres un abogado penalista argentino especializado en análisis de casos.
Analiza los siguientes hechos descritos por un cliente y proporciona un análisis tripartito (fiscal, juez, defensa).

HECHOS:
${facts}

Proporciona un análisis en formato JSON (SIN markdown, JSON puro) con la siguiente estructura:
{
  "delito": "descripción del delito probable",
  "articulos": ["art. XXX", "art. YYY"],
  "pruebas_documentales": ["elemento 1", "elemento 2"],
  "pruebas_testimoniales": ["testimonio 1", "testimonio 2"],
  "pruebas_periciales": ["pericia 1", "pericia 2"],
  "fortaleza": 45,
  "estrategia": "estrategia defensiva recomendada",
  "fiscal": "análisis fiscal: qué buscaría el fiscal",
  "juez": "perspectiva judicial: preocupaciones del juez",
  "defensa": "argumentación defensiva recomendada"
}

IMPORTANTE:
- fortaleza debe ser un número 0-100 (donde 0 es defensa muy débil, 100 es defensa muy fuerte)
- No uses markdown en el JSON
- Sé preciso y técnico
- Siempre incluye las tres perspectivas (fiscal, juez, defensa)`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON from response
    let analysisData;
    try {
      analysisData = JSON.parse(responseText);
    } catch (e) {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No valid JSON in response');
      analysisData = JSON.parse(jsonMatch[0]);
    }

    // Generate HTML
    const html = generateAnalysisHTML(analysisData);

    return { html, data: analysisData };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to analyze case with Claude API');
  }
}

function generateAnalysisHTML(data) {
  const fortalezaColor = data.fortaleza >= 70 ? '#10b981' : data.fortaleza >= 40 ? '#f59e0b' : '#ef4444';
  const fortalezaLabel = data.fortaleza >= 70 ? 'Fuerte' : data.fortaleza >= 40 ? 'Moderada' : 'Débil';

  return `
    <div style="font-family: 'Playfair Display', Georgia, serif; color: #003366; line-height: 1.6;">

      <div style="background: #f8fafc; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid #0284c7;">
        <h3 style="margin-top: 0; color: #003366;">📋 Tipificación</h3>
        <p style="margin-bottom: 0.75rem;"><strong>Delito probable:</strong> ${data.delito}</p>
        <p style="margin: 0;"><strong>Artículos aplicables:</strong> ${data.articulos.join(', ')}</p>
      </div>

      <div style="background: #f8fafc; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid #f59e0b;">
        <h3 style="margin-top: 0; color: #003366;">📁 Pruebas Identificadas</h3>
        <p><strong>Documentales:</strong> ${data.pruebas_documentales?.length > 0 ? data.pruebas_documentales.join(', ') : 'No identificadas'}</p>
        <p><strong>Testimoniales:</strong> ${data.pruebas_testimoniales?.length > 0 ? data.pruebas_testimoniales.join(', ') : 'No identificadas'}</p>
        <p style="margin: 0;"><strong>Periciales:</strong> ${data.pruebas_periciales?.length > 0 ? data.pruebas_periciales.join(', ') : 'No identificadas'}</p>
      </div>

      <div style="background: #f8fafc; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid ${fortalezaColor};">
        <h3 style="margin-top: 0; color: #003366;">⚖️ Fortaleza Defensiva</h3>
        <div style="font-size: 2.5rem; font-weight: bold; color: ${fortalezaColor}; margin-bottom: 0.5rem;">${data.fortaleza}/100</div>
        <p style="margin: 0; color: #444; font-size: 0.95rem;"><strong>${fortalezaLabel}.</strong> ${getFortalezaInterpretation(data.fortaleza)}</p>
      </div>

      <div style="background: #f8fafc; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid #0284c7;">
        <h3 style="margin-top: 0; color: #003366;">🎯 Estrategia Defensiva Recomendada</h3>
        <p style="margin: 0; color: #444;">${data.estrategia}</p>
      </div>

      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid #0284c7;">
        <h3 style="margin-top: 0; color: #003366;">⚖️ Análisis Tripartito</h3>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="color: #d97706; margin-bottom: 0.5rem;">👨‍⚖️ Perspectiva Fiscal</h4>
          <p style="margin: 0; color: #444; font-size: 0.95rem;">${data.fiscal}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="color: #059669; margin-bottom: 0.5rem;">👨‍🏫 Perspectiva Judicial</h4>
          <p style="margin: 0; color: #444; font-size: 0.95rem;">${data.juez}</p>
        </div>

        <div>
          <h4 style="color: #0284c7; margin-bottom: 0.5rem;">🛡️ Argumentación Defensiva</h4>
          <p style="margin: 0; color: #444; font-size: 0.95rem;">${data.defensa}</p>
        </div>
      </div>

      <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 1rem 1.25rem; border-radius: 6px; margin-top: 2rem;">
        <p style="margin: 0; color: #92400e; font-size: 0.9rem;">
          <strong>⚠️ Representación Ficticia:</strong> Este análisis es orientativo y basado en teoría del caso penal.
          <strong>No es asesoramiento legal profesional</strong>, no predice resultados judiciales reales.
          Siempre requiere consulta integral con un defensor y firma de contrato de patrocinio.
        </p>
      </div>
    </div>
  `;
}

function getFortalezaInterpretation(score) {
  if (score >= 75) return 'Posición defensiva sólida con argumentos firmes.';
  if (score >= 60) return 'Defensa consistente, pero con elementos por reforzar.';
  if (score >= 45) return 'Posición defensiva equilibrada, requiere trabajo estratégico.';
  if (score >= 30) return 'Defensa con desafíos probatorios significativos.';
  return 'Posición defensiva crítica, requiere estrategia sofisticada.';
}
