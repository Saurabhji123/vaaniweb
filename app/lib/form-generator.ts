/**
 * Centralized contact form generator with proper slug handling
 * This ensures ALL templates have consistent form submission logic
 */

export function generateContactFormScript(): string {
  return `<script>
async function submitContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector('button[type="submit"]');
  const btnText = btn.textContent;
  
  // Show loading state
  btn.disabled = true;
  btn.textContent = '⏳ Sending...';
  btn.classList.add('opacity-75', 'cursor-not-allowed');
  
  // Collect form data (exclude hidden inputs)
  const formData = {};
  const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
  inputs.forEach(input => {
    const fieldName = input.labels && input.labels[0] ? input.labels[0].textContent : (input.name || input.id || 'Field');
    formData[fieldName] = input.value;
  });
  
  // Get slug from hidden input OR fallback to URL
  const slugInput = form.querySelector('input[name="websiteSlug"]');
  const slug = slugInput ? slugInput.value : window.location.pathname.split('/').filter(Boolean).pop();
  
  console.log('🔍 Form submission:', { slug, formData });
  
  try {
    const res = await fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteSlug: slug, formData })
    });
    
    const data = await res.json();
    console.log('📨 Response:', data);
    
    if (res.ok) {
      form.reset();
      alert('✅ Success! Your message has been sent. We will get back to you soon!');
    } else {
      alert('❌ ' + (data.error || data.message || 'Failed to send message. Please try again.'));
    }
  } catch (err) {
    console.error('💥 Form submission error:', err);
    alert('❌ Network error. Please check your connection and try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = btnText;
    btn.classList.remove('opacity-75', 'cursor-not-allowed');
  }
}
</script><script>
// Ensure every form using submitContactForm has a hidden websiteSlug input
document.addEventListener('DOMContentLoaded', () => {
  try {
    const forms = document.querySelectorAll('form[onsubmit*="submitContactForm"]');
    forms.forEach((form) => {
      if (!form.querySelector('input[name="websiteSlug"]')) {
        const slug = window.location.pathname.split('/').filter(Boolean).pop() || '';
        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'websiteSlug';
        hidden.value = slug;
        form.prepend(hidden);
      }
    });
  } catch (e) {
    console.warn('websiteSlug auto-insert failed:', e);
  }
});
</script>`;
}

export function generateContactFormHTML(fields: string[], themeColor: string = 'purple'): string {
  return `
<section class="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 my-8 sm:my-16">
  <form class="bg-white p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-${themeColor}-200" onsubmit="submitContactForm(event)">
    <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-${themeColor}-900 mb-6 sm:mb-8 text-center">Get in Touch</h2>
    ${fields.map(field => `
    <div class="mb-4 sm:mb-6">
      <label class="block text-base sm:text-lg font-semibold text-${themeColor}-800 mb-2">${field}</label>
      <input 
        type="${field.toLowerCase().includes('email') ? 'email' : field.toLowerCase().includes('phone') ? 'tel' : 'text'}" 
        class="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-${themeColor}-300 rounded-xl sm:rounded-2xl focus:outline-none focus:border-${themeColor}-600 transition text-base sm:text-lg" 
        required
      >
    </div>`).join('')}
    <button type="submit" class="w-full bg-gradient-to-r from-${themeColor}-600 to-${themeColor}-700 text-white py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl hover:from-${themeColor}-700 hover:to-${themeColor}-800 transition font-bold text-lg sm:text-xl shadow-lg transform hover:scale-105">
      Send Message
    </button>
  </form>
</section>`;
}
