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
      background: linear-gradient(135deg, #003366 0%, #001a4d 100%);
      border: 2px solid #0052a3;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0, 51, 102, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      transition: all 0.3s ease;
      position: relative;
    }

    .wa-widget-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 51, 102, 0.5);
      background: linear-gradient(135deg, #0052a3 0%, #003366 100%);
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
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.159-.173.193-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.052 0-2.082.354-2.915.992l-.104.066-4.332-.641L3.71 5.429l.067-.108A4.692 4.692 0 018.051 3.5h.005c2.577 0 4.957 1.067 6.659 2.766 1.702 1.699 2.768 4.076 2.768 6.653 0 5.159-4.213 9.372-9.372 9.372h-.005a9.36 9.36 0 01-4.455-1.107l-.107-.057-4.332.641.641-4.332-.058-.107A9.358 9.358 0 013.5 12.051c0-5.159 4.213-9.372 9.372-9.372m7.926 13.129A11.852 11.852 0 0112.051 22c-3.282 0-6.362-1.363-8.514-3.553A11.856 11.856 0 011 12.051c0-3.282 1.363-6.362 3.553-8.514A11.852 11.852 0 0112.051 1c3.282 0 6.362 1.363 8.514 3.553A11.856 11.856 0 0123 12.051c0 3.282-1.363 6.362-3.553 8.514" style="fill:white;"/>
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
