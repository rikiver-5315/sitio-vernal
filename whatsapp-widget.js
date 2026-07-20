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
      background: linear-gradient(135deg, #25d366 0%, #20ba5a 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      transition: all 0.3s ease;
      position: relative;
    }

    .wa-widget-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(37, 211, 102, 0.6);
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
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      min-width: 280px;
      max-width: 320px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px) scale(0.95);
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .wa-widget-menu.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .wa-widget-header {
      background: linear-gradient(135deg, #25d366 0%, #20ba5a 100%);
      padding: 1rem;
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
    }

    .wa-widget-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
      background: #f3f4f6;
    }

    .wa-widget-shortcuts {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .wa-shortcut {
      padding: 10px 12px;
      background: #f3f4f6;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: #1f2937;
      text-align: left;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .wa-shortcut:hover {
      background: #e5e7eb;
      border-color: #25d366;
    }

    .wa-shortcut:active {
      transform: scale(0.98);
    }

    .wa-shortcut-icon {
      margin-right: 8px;
    }

    .wa-widget-footer {
      padding: 12px;
      text-align: center;
      background: #f9fafb;
      border-top: 1px solid #f3f4f6;
      font-size: 12px;
      color: #6b7280;
    }

    .wa-widget-footer a {
      color: #25d366;
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
        <div class="wa-widget-avatar">
          <img src="assets/ricardo-vernal-hero.jpg" alt="Ricardo Vernal" onerror="this.style.display='none'">
        </div>
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
      <span>💬</span>
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
