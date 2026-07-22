// Análisis de casos penales con Groq (Llama de Meta, plan gratuito).
// Sin SDK: usa fetch nativo de Node 18+ contra la API compatible con OpenAI de Groq.
// La API key va en process.env.GROQ_API_KEY (se saca gratis en console.groq.com).
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function analyzeCase(facts) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY no configurada en el entorno');
  }

  const prompt = `Eres un abogado penalista argentino especializado en análisis de casos.
Analiza los siguientes hechos descritos por un cliente y proporciona un análisis tripartito (fiscal, juez, defensa).

HECHOS:
${facts}

Proporciona un análisis en formato JSON (SIN markdown, JSON puro) con la siguiente estructura:
{
  "delito": "descripción del delito probable",
  "articulos": ["art. XXX", "art. YYY"],
  "jurisdiccion": "Federal" o "Provincial",
  "pruebas_documentales": ["elemento 1", "elemento 2"],
  "pruebas_testimoniales": ["testimonio 1", "testimonio 2"],
  "pruebas_periciales": ["pericia 1", "pericia 2"],
  "fortaleza": 45,
  "estrategia": "estrategia defensiva recomendada",
  "fiscal": "imputación fiscal en formato titular de diario, máximo 12 palabras",
  "juez": "decisión judicial en formato titular de diario, máximo 12 palabras",
  "defensa": "argumento defensivo en formato titular de diario, máximo 12 palabras"
}

IMPORTANTE:
- fortaleza debe ser un número 0-100 (donde 0 es defensa muy débil, 100 es defensa muy fuerte)
- jurisdiccion debe ser EXACTAMENTE la palabra "Federal" o "Provincial" (sin otra variante)
- fiscal, juez y defensa: ESTRICTAMENTE máximo 12 palabras cada uno. Escribilos como un TITULAR de diario, no como una oración con subordinadas. Sin "porque", sin explicar el razonamiento, solo el hecho concreto.
  Ejemplos del largo y estilo esperado (para un caso distinto, solo de referencia):
  "fiscal": "Imputa hurto simple, pide prisión preventiva por riesgo de fuga"
  "juez": "Ordena excarcelación bajo caución, rechaza pedido fiscal"
  "defensa": "Cuestiona cadena de custodia, pide sobreseimiento"
- fiscal = la imputación concreta que haría el fiscal en este caso, en ese formato de titular
- juez = la decisión o postura que tomaría el juez ante estos hechos, en ese formato de titular
- defensa = la respuesta o argumento concreto que plantearía la defensa, en ese formato de titular
- No uses markdown en el JSON
- Sé preciso y técnico
- Siempre incluye las tres perspectivas (fiscal, juez, defensa)`;

  let response;
  try {
    response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
    });
  } catch (err) {
    console.error('Groq network error:', err);
    throw new Error('No se pudo contactar el servicio de IA');
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('Groq API error:', response.status, detail);
    throw new Error('Failed to analyze case with Groq API');
  }

  const payload = await response.json();
  const responseText = payload?.choices?.[0]?.message?.content || '';

  // Parseo del JSON devuelto por el modelo
  let analysisData;
  try {
    analysisData = JSON.parse(responseText);
  } catch (e) {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON in Groq response');
    analysisData = JSON.parse(jsonMatch[0]);
  }

  const html = generateAnalysisHTML(analysisData);
  return { html, data: analysisData };
}

function generateAnalysisHTML(data) {
  const fortalezaColor = data.fortaleza >= 70 ? '#10b981' : data.fortaleza >= 40 ? '#f59e0b' : '#ef4444';
  const fortalezaLabel = data.fortaleza >= 70 ? 'Fuerte' : data.fortaleza >= 40 ? 'Moderada' : 'Débil';

  return `
    <div style="font-family: 'Playfair Display', Georgia, serif; color: #003366; line-height: 1.6;">
      <div style="background: #f8fafc; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid #0284c7;">
        <h3 style="margin-top: 0; color: #003366;">Tipificación</h3>
        <p style="margin-bottom: 0.75rem;"><strong>Delito probable:</strong> ${data.delito}</p>
        <p style="margin: 0;"><strong>Artículos aplicables:</strong> ${Array.isArray(data.articulos) ? data.articulos.join(', ') : data.articulos}</p>
      </div>
      <div style="background: #f8fafc; padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem; border-left: 4px solid ${fortalezaColor};">
        <h3 style="margin-top: 0; color: #003366;">Fortaleza Defensiva</h3>
        <div style="font-size: 2.5rem; font-weight: bold; color: ${fortalezaColor};">${data.fortaleza}/100</div>
        <p style="margin: 0; color: #444;"><strong>${fortalezaLabel}.</strong> ${getFortalezaInterpretation(data.fortaleza)}</p>
      </div>
      <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 1rem 1.25rem; border-radius: 6px; margin-top: 2rem;">
        <p style="margin: 0; color: #92400e; font-size: 0.9rem;">
          <strong>Representación ficticia:</strong> análisis orientativo, no asesoramiento legal profesional.
          Requiere consulta integral con un defensor y firma de contrato de patrocinio.
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
