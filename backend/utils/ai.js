// Análisis de casos penales con Google Gemini (plan gratuito).
// Sin SDK: usa fetch nativo de Node 18+. La API key va en process.env.GEMINI_API_KEY.
// Si el modelo diera 404, probá 'gemini-2.5-flash' o 'gemini-1.5-flash'.
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function analyzeCase(facts) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no configurada en el entorno');
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
  "fiscal": "análisis fiscal: qué buscaría el fiscal",
  "juez": "perspectiva judicial: preocupaciones del juez",
  "defensa": "argumentación defensiva recomendada"
}

IMPORTANTE:
- fortaleza debe ser un número 0-100 (donde 0 es defensa muy débil, 100 es defensa muy fuerte)
- jurisdiccion debe ser EXACTAMENTE la palabra "Federal" o "Provincial" (sin otra variante)
- No uses markdown en el JSON
- Sé preciso y técnico
- Siempre incluye las tres perspectivas (fiscal, juez, defensa)`;

  let response;
  try {
    response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1500,
          responseMimeType: 'application/json'
        }
      })
    });
  } catch (err) {
    console.error('Gemini network error:', err);
    throw new Error('No se pudo contactar el servicio de IA');
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('Gemini API error:', response.status, detail);
    throw new Error('Failed to analyze case with Gemini API');
  }

  const payload = await response.json();
  const responseText =
    payload?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Parseo del JSON devuelto por el modelo
  let analysisData;
  try {
    analysisData = JSON.parse(responseText);
  } catch (e) {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON in Gemini response');
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
