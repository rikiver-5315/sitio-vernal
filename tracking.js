// Eventos de conversión de Google Analytics 4
// GA4 ya se inicializa en el <head> de cada página; acá solo se registran eventos.

// 1. Click en "Consulta Urgente 24/7" (botón rojo hero)
document.addEventListener('DOMContentLoaded', () => {
  const urgentBtn = document.querySelector('a[href*="wa.me"][class*="btn-urgencia"]');
  if (urgentBtn) {
    urgentBtn.addEventListener('click', () => {
      gtag('event', 'conversion', {
        'event_category': 'engagement',
        'event_label': 'urgent_cta_click',
        'value': 1
      });
    });
  }

  // 2. Click en "Enviar mi consulta"
  const consultaBtn = document.querySelector('a[href="mi-consulta.html"]');
  if (consultaBtn) {
    consultaBtn.addEventListener('click', () => {
      gtag('event', 'conversion', {
        'event_category': 'engagement',
        'event_label': 'consultation_form_click',
        'value': 1
      });
    });
  }

  // 3. Click en banner mobile urgencia
  const bannerLink = document.querySelector('.urgencia-banner-mobile a');
  if (bannerLink) {
    bannerLink.addEventListener('click', () => {
      gtag('event', 'conversion', {
        'event_category': 'mobile_engagement',
        'event_label': 'mobile_banner_urgencia_click',
        'value': 1
      });
    });
  }

  // 4. Scroll profundo (25%, 50%, 75%, 100%)
  let scrollTracked = { '25': false, '50': false, '75': false, '100': false };
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

    if (scrollPercent >= 25 && !scrollTracked['25']) {
      gtag('event', 'scroll', { 'value': 25 });
      scrollTracked['25'] = true;
    }
    if (scrollPercent >= 50 && !scrollTracked['50']) {
      gtag('event', 'scroll', { 'value': 50 });
      scrollTracked['50'] = true;
    }
    if (scrollPercent >= 75 && !scrollTracked['75']) {
      gtag('event', 'scroll', { 'value': 75 });
      scrollTracked['75'] = true;
    }
    if (scrollPercent >= 100 && !scrollTracked['100']) {
      gtag('event', 'scroll', { 'value': 100 });
      scrollTracked['100'] = true;
    }
  });

  // 5. Tiempo en página (15 segundos)
  setTimeout(() => {
    gtag('event', 'engagement_15s', {
      'event_category': 'time_based',
      'event_label': 'user_stayed_15s'
    });
  }, 15000);

  // 6. Form submission en mi-consulta.html
  const consultaForm = document.getElementById('consulta-form');
  if (consultaForm) {
    consultaForm.addEventListener('submit', (e) => {
      if (e.target.id === 'consulta-form') {
        gtag('event', 'conversion', {
          'event_category': 'form',
          'event_label': 'consulta_form_submitted',
          'value': 1
        });
      }
    });
  }

  // 7. Caso analizado (analizar-mi-caso.html)
  const caseForm = document.getElementById('case-form');
  if (caseForm) {
    caseForm.addEventListener('submit', () => {
      gtag('event', 'conversion', {
        'event_category': 'ai_tool',
        'event_label': 'case_analyzed',
        'value': 1
      });
    });
  }

  // 8. Click en enlaces de servicios
  document.querySelectorAll('a[href*="servicios.html"]').forEach(link => {
    link.addEventListener('click', () => {
      const service = link.getAttribute('href').split('#')[1] || 'general';
      gtag('event', 'view_item', {
        'event_category': 'service',
        'event_label': `service_${service}`,
        'value': 1
      });
    });
  });

  // 9. Llamada directa (tel:)
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      gtag('event', 'conversion', {
        'event_category': 'contact',
        'event_label': 'phone_call',
        'value': 1
      });
    });
  });
});
