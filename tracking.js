// Google Analytics 4 - Configuración y eventos de conversión
// Inicialización en cada HTML via etiqueta <script>

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX'); // Reemplazar con GA4 ID real

// Eventos de conversión

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

// Google Remarketing Pixel
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('config', 'AW-XXXXXXXXXX'); // Reemplazar con Google Ads Conversion ID

// Meta Pixel
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'XXXXXXXXXX'); // Reemplazar con Meta Pixel ID
fbq('track', 'PageView');

// Meta Pixel - Conversiones personalizadas
document.addEventListener('DOMContentLoaded', () => {
  // Track consulta urgente
  const urgentBtn = document.querySelector('a[href*="wa.me"][class*="btn-urgencia"]');
  if (urgentBtn) {
    urgentBtn.addEventListener('click', () => {
      fbq('track', 'Contact', { value: 1, currency: 'ARS' });
    });
  }

  // Track formulario
  const consultaForm = document.getElementById('consulta-form');
  if (consultaForm) {
    consultaForm.addEventListener('submit', () => {
      fbq('track', 'Lead', { value: 1, currency: 'ARS' });
    });
  }
});
