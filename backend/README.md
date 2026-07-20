# Backend - Análisis de Casos Penales

API Node.js/Express que procesa análisis de casos penales usando Claude.

## Instalación Local

```bash
cd backend
npm install
```

## Configuración

1. Copiar `.env.example` a `.env`
2. Agregar tu `ANTHROPIC_API_KEY` de Anthropic
3. (Opcional) Agregar Redis URL para rate limiting

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

## Desarrollo Local

```bash
npm run dev
```

Server corre en `http://localhost:3001`

## Deploy en Render

### 1. Push a GitHub

```bash
git add backend/
git commit -m "Add backend API"
git push origin master
```

### 2. Crear Web Service en Render

1. Ir a https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Conectar repositorio GitHub
4. Configurar:
   - **Name:** `vernal-penal-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free tier está bien para comenzar

### 3. Agregar Variables de Entorno

En Render dashboard, ir a Web Service → "Environment":

```
ANTHROPIC_API_KEY=sk-ant-XXX
NODE_ENV=production
FRONTEND_URL=https://rikiver-5315.github.io/sitio-vernal
PORT=3001
```

### 4. Deploy

Render automáticamente detecta cambios en GitHub y redeploya.

URL del backend: `https://vernal-penal-backend.onrender.com`

## Endpoints

### POST `/api/analyze-case`

Analiza hechos de un caso penal.

**Request:**
```json
{
  "facts": "El 15 de julio fue detenido sospechoso de robo agravado..."
}
```

**Response:**
```json
{
  "success": true,
  "html": "<div>análisis HTML</div>",
  "data": {
    "delito": "robo agravado",
    "articulos": ["art. 163", "art. 166"],
    "fortaleza": 55,
    ...
  }
}
```

### GET `/api/check-analysis-status`

Verifica si el usuario ya usó su análisis diario.

**Response:**
```json
{
  "alreadyUsed": false
}
```

### GET `/health`

Chequea estado del servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-07-19T18:30:00.000Z"
}
```

## Rate Limiting

- 1 análisis por usuario por 24 horas
- Fingerprint basado en: IP + User-Agent + Accept-Language + fecha
- Sin Redis: rate limiting deshabilitado (desarrollo local)
- Con Redis: persiste en caché de 24 horas

## Troubleshooting

### Error: "Anthropic API key not found"
Verificar que `ANTHROPIC_API_KEY` esté en `.env` o variables de entorno de Render.

### Error: "Rate limit exceeded"
Usuario ya usó su análisis diario. Intenta mañana.

### Error: "Analysis failed"
Revisar logs de Render: https://render.com/dashboard (Web Service → Logs)

## Stack

- **Express** - Web framework
- **Anthropic API** - Claude para análisis
- **Redis** - Rate limiting (opcional)
- **CORS** - Cross-origin requests desde frontend

---

**Mantener seguro:** Nunca hacer commit de `.env` con credenciales reales.
