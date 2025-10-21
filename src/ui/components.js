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
