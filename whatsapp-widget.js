// WhatsApp Widget - Botón flotante interactivo
(function() {
  const WHATSAPP_NUMBER = '5493816321536';
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

  // Determinar horario
  function getStatus() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Lunes-Viernes (1-5), 9-18
    if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
      return {
        online: true,
        message: '🟢 En línea - Responde en menos de 15 min',
        color: '#10b981'
      };
    }

    // Urgencias 24/7
    return {
      online: false,
      message: '🟠 Fuera de horario - Responde a primera hora',
      color: '#f59e0b'
    };
  }

  // Crear estilos
  const style = document.createElement('style');
  style.textContent = `
    .wa-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      z-index: 9999;
    }

    .wa-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(18, 140, 126, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      transition: all 0.3s ease;
      position: relative;
    }

    .wa-widget-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(18, 140, 126, 0.55);
      background: linear-gradient(135deg, #2fe373 0%, #159c8c 100%);
    }

    .wa-widget-button:active {
      transform: scale(0.95);
    }

    .wa-notification-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #dc2626;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(220, 38, 38, 0.4);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }

    .wa-widget-menu {
      position: absolute;
      bottom: 80px;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 51, 102, 0.15);
      min-width: 280px;
      max-width: 320px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px) scale(0.95);
      transition: all 0.3s ease;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }

    .wa-widget-menu.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .wa-widget-header {
      background: linear-gradient(135deg, #003366 0%, #001a4d 100%);
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
    }

    .wa-widget-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: white;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: #003366;
    }

    .wa-widget-info {
      flex: 1;
      font-size: 13px;
      line-height: 1.4;
    }

    .wa-widget-info-name {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .wa-widget-info-status {
      opacity: 0.9;
      font-size: 12px;
    }

    .wa-widget-divider {
      height: 1px;
      background: #e5e7eb;
    }

    .wa-widget-shortcuts {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .wa-shortcut {
      padding: 12px 14px;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: #003366;
      text-align: left;
      transition: all 0.2s ease;
    }

    .wa-shortcut:hover {
      background: #e0f2fe;
      border-color: #0284c7;
      color: #003366;
      transform: translateX(2px);
    }

    .wa-shortcut:active {
      transform: scale(0.98);
    }

    .wa-shortcut-icon {
      margin-right: 8px;
      font-size: 14px;
    }

    .wa-widget-footer {
      padding: 12px;
      text-align: center;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }

    .wa-widget-footer a {
      color: #003366;
      text-decoration: none;
      font-weight: 600;
    }

    @media (max-width: 480px) {
      .wa-widget-container {
        bottom: 16px;
        right: 16px;
      }

      .wa-widget-button {
        width: 56px;
        height: 56px;
        font-size: 26px;
      }

      .wa-widget-menu {
        min-width: 260px;
        max-width: 90vw;
        right: -50%;
        transform: translateX(50%) translateY(10px) scale(0.95);
      }

      .wa-widget-menu.open {
        transform: translateX(50%) translateY(0) scale(1);
      }
    }
  `;
  document.head.appendChild(style);

  // Crear HTML del widget
  const status = getStatus();

  const container = document.createElement('div');
  container.className = 'wa-widget-container';
  container.innerHTML = `
    <div class="wa-widget-menu" id="waMenu">
      <div class="wa-widget-header">
        <div class="wa-widget-avatar" aria-hidden="true">⚖</div>
        <div class="wa-widget-info">
          <div class="wa-widget-info-name">Ricardo Vernal</div>
          <div class="wa-widget-info-status">${status.message}</div>
        </div>
      </div>
      <div class="wa-widget-divider"></div>
      <div class="wa-widget-shortcuts">
        <button class="wa-shortcut" data-action="urgencia">
          <span class="wa-shortcut-icon">🚨</span>
          Tengo una urgencia
        </button>
        <button class="wa-shortcut" data-action="documentos">
          <span class="wa-shortcut-icon">📄</span>
          Enviar fotos/PDFs
        </button>
        <button class="wa-shortcut" data-action="consulta">
          <span class="wa-shortcut-icon">💬</span>
          Hacer una consulta
        </button>
      </div>
      <div class="wa-widget-footer">
        Responde en horario laboral
      </div>
    </div>
    <button class="wa-widget-button" id="waButton" title="Enviar mensaje por WhatsApp">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.669.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" style="fill:white;"/>
      </svg>
      <span class="wa-notification-badge">1</span>
    </button>
  `;

  document.body.appendChild(container);

  // Comportamiento del widget
  const button = document.getElementById('waButton');
  const menu = document.getElementById('waMenu');

  button.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Cerrar menu al hacer clic afuera
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      menu.classList.remove('open');
    }
  });

  // Mensajes predeterminados por acción
  const messages = {
    urgencia: encodeURIComponent('🚨 Tengo una urgencia. Me detuvieron/allanan. Necesito defensa inmediata.'),
    documentos: encodeURIComponent('Quiero enviar fotos y documentos de mi caso para análisis.'),
    consulta: encodeURIComponent('Hola Ricardo, me gustaría hacer una consulta sobre mi situación legal.')
  };

  // Eventos de los atajos
  document.querySelectorAll('.wa-shortcut').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      const msg = messages[action];
      window.open(`${WHATSAPP_URL}?text=${msg}`, '_blank');
      menu.classList.remove('open');
    });
  });
})();
