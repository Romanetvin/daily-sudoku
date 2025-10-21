/**
 * UI utility functions and component helpers
 */

/**
 * Create a button element with Tailwind classes
 */
export function createButton(text, className = '', onClick = null) {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = `px-4 py-2 rounded-md font-medium transition-colors ${className}`;
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

/**
 * Create a card container
 */
export function createCard(className = '') {
  const card = document.createElement('div');
  card.className = `bg-card text-card-foreground rounded-lg border shadow-sm ${className}`;
  return card;
}

/**
 * Create difficulty badge
 */
export function createBadge(text, variant = 'default') {
  const badge = document.createElement('span');
  badge.textContent = text;

  const variants = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'border border-input bg-background'
  };

  badge.className = `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]}`;
  return badge;
}

/**
 * Show/hide element with animation
 */
export function toggleElement(element, show) {
  if (show) {
    element.classList.remove('hidden');
    element.classList.add('animate-in', 'fade-in-0');
  } else {
    element.classList.add('hidden');
    element.classList.remove('animate-in', 'fade-in-0');
  }
}

/**
 * Create and show a success popup modal
 */
export function showSuccessPopup(message, onClose = null) {
  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0';

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md mx-4 animate-in zoom-in-95';

  modal.innerHTML = `
    <div class="text-center">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Congratulations!
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        ${message}
      </p>
      <button id="close-popup" class="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
        Close
      </button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Close handlers
  const closePopup = () => {
    backdrop.remove();
    if (onClose) onClose();
  };

  modal.querySelector('#close-popup').addEventListener('click', closePopup);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePopup();
  });

  return backdrop;
}
