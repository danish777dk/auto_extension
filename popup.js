// Random Card Generation and Autofill Functionality

/**
 * Generate a random card number
 * @param {string} cardType - Type of card (visa, mastercard, amex, discover)
 * @returns {string} Random card number
 */
function generateRandomCardNumber(cardType = 'visa') {
  let cardNumber = '';
  let length = 16;
  let prefix = '4'; // Visa default

  switch (cardType.toLowerCase()) {
    case 'mastercard':
      prefix = '5' + Math.floor(Math.random() * 5 + 1);
      length = 16;
      break;
    case 'amex':
      prefix = '3' + (Math.random() > 0.5 ? '4' : '7');
      length = 15;
      break;
    case 'discover':
      prefix = '6011';
      length = 16;
      break;
    case 'visa':
    default:
      prefix = '4';
      length = 16;
      break;
  }

  cardNumber = prefix;
  for (let i = cardNumber.length; i < length - 1; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }

  // Luhn algorithm for checksum
  cardNumber += calculateLuhnChecksum(cardNumber);
  return cardNumber;
}

/**
 * Calculate Luhn checksum digit
 * @param {string} cardNumber - Card number without checksum
 * @returns {string} Checksum digit
 */
function calculateLuhnChecksum(cardNumber) {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return ((10 - (sum % 10)) % 10).toString();
}

/**
 * Generate a random expiration date
 * @returns {string} Expiration date in MM/YY format
 */
function generateRandomExpirationDate() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Generate expiration 1-10 years in the future
  const futureYears = Math.floor(Math.random() * 10) + 1;
  const expiryYear = currentYear + futureYears;
  const expiryMonth = Math.floor(Math.random() * 12) + 1;

  const monthStr = expiryMonth.toString().padStart(2, '0');
  const yearStr = expiryYear.toString().slice(-2);

  return `${monthStr}/${yearStr}`;
}

/**
 * Generate a random CVV
 * @param {string} cardType - Type of card
 * @returns {string} Random CVV
 */
function generateRandomCVV(cardType = 'visa') {
  const length = cardType.toLowerCase() === 'amex' ? 4 : 3;
  let cvv = '';
  for (let i = 0; i < length; i++) {
    cvv += Math.floor(Math.random() * 10);
  }
  return cvv;
}

/**
 * Generate a random cardholder name
 * @returns {string} Random name
 */
function generateRandomCardholderName() {
  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Olivia',
    'Robert', 'Sophia', 'William', 'Isabella', 'Richard', 'Ava', 'Joseph', 'Mia'
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}

/**
 * Generate complete random card data
 * @param {string} cardType - Type of card
 * @returns {object} Complete card data
 */
function generateRandomCardData(cardType = 'visa') {
  return {
    cardType: cardType,
    cardNumber: generateRandomCardNumber(cardType),
    cardholderName: generateRandomCardholderName(),
    expirationDate: generateRandomExpirationDate(),
    cvv: generateRandomCVV(cardType)
  };
}

/**
 * Format card number with spaces (every 4 digits)
 * @param {string} cardNumber - Unformatted card number
 * @returns {string} Formatted card number
 */
function formatCardNumber(cardNumber) {
  return cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Autofill card form fields
 * @param {object} cardData - Card data to fill
 * @returns {boolean} Success status
 */
function autofillCardForm(cardData) {
  try {
    // Common field selectors for card number
    const cardNumberSelectors = [
      'input[name*="card"], input[placeholder*="card"], input[aria-label*="card"]',
      'input[type="text"][name*="number"]',
      'input[id*="card"], input[class*="card"]'
    ];

    // Common field selectors for cardholder name
    const nameSelectors = [
      'input[name*="name"], input[placeholder*="name"]',
      'input[aria-label*="cardholder"]',
      'input[id*="name"], input[class*="name"]'
    ];

    // Common field selectors for expiration
    const expirationSelectors = [
      'input[name*="expir"], input[placeholder*="expir"]',
      'input[aria-label*="expir"]',
      'input[id*="expir"], input[class*="expir"]'
    ];

    // Common field selectors for CVV
    const cvvSelectors = [
      'input[name*="cvv"], input[name*="cvc"]',
      'input[placeholder*="cvv"], input[placeholder*="cvc"]',
      'input[aria-label*="cvv"], input[aria-label*="cvc"]',
      'input[id*="cvv"], input[id*="cvc"]'
    ];

    // Function to find and fill input field
    function findAndFillField(selectors, value) {
      for (let selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (let element of elements) {
          if (element && !element.disabled && element.offsetParent !== null) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
          }
        }
      }
      return false;
    }

    // Attempt to fill all fields
    let filledCount = 0;

    if (findAndFillField(cardNumberSelectors, formatCardNumber(cardData.cardNumber))) {
      filledCount++;
    }
    if (findAndFillField(nameSelectors, cardData.cardholderName)) {
      filledCount++;
    }
    if (findAndFillField(expirationSelectors, cardData.expirationDate)) {
      filledCount++;
    }
    if (findAndFillField(cvvSelectors, cardData.cvv)) {
      filledCount++;
    }

    return filledCount > 0;
  } catch (error) {
    console.error('Error during autofill:', error);
    return false;
  }
}

/**
 * Initialize popup functionality
 */
function initializePopup() {
  // Generate random card on button click
  const generateButton = document.getElementById('generateBtn');
  if (generateButton) {
    generateButton.addEventListener('click', function() {
      const cardTypeSelect = document.getElementById('cardType');
      const cardType = cardTypeSelect ? cardTypeSelect.value : 'visa';
      const cardData = generateRandomCardData(cardType);
      displayCardData(cardData);
    });
  }

  // Autofill on button click
  const autofillButton = document.getElementById('autofillBtn');
  if (autofillButton) {
    autofillButton.addEventListener('click', function() {
      const cardData = getCurrentCardData();
      if (cardData) {
        const success = autofillCardForm(cardData);
        if (success) {
          showNotification('Card data autofilled successfully!', 'success');
        } else {
          showNotification('No card fields found to autofill', 'warning');
        }
      } else {
        showNotification('Generate a card first!', 'error');
      }
    });
  }

  // Copy to clipboard functionality
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const fieldId = this.getAttribute('data-copy');
      const field = document.getElementById(fieldId);
      if (field) {
        copyToClipboard(field.value);
        showNotification('Copied to clipboard!', 'success');
      }
    });
  });

  // Auto-generate card on load
  generateRandomCard();
}

/**
 * Display card data in popup
 * @param {object} cardData - Card data to display
 */
function displayCardData(cardData) {
  const cardNumberInput = document.getElementById('cardNumber');
  const cardholderInput = document.getElementById('cardholder');
  const expirationInput = document.getElementById('expiration');
  const cvvInput = document.getElementById('cvv');

  if (cardNumberInput) cardNumberInput.value = formatCardNumber(cardData.cardNumber);
  if (cardholderInput) cardholderInput.value = cardData.cardholderName;
  if (expirationInput) expirationInput.value = cardData.expirationDate;
  if (cvvInput) cvvInput.value = cardData.cvv;

  // Store current card data
  sessionStorage.setItem('currentCardData', JSON.stringify(cardData));
}

/**
 * Get current card data from display
 * @returns {object|null} Current card data
 */
function getCurrentCardData() {
  const stored = sessionStorage.getItem('currentCardData');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Generate and display random card
 */
function generateRandomCard() {
  const cardTypeSelect = document.getElementById('cardType');
  const cardType = cardTypeSelect ? cardTypeSelect.value : 'visa';
  const cardData = generateRandomCardData(cardType);
  displayCardData(cardData);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy:', err);
  });
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning)
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 10000;
    animation: slideIn 0.3s ease-in-out;
  `;

  const colors = {
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3'
  };

  notification.style.backgroundColor = colors[type] || colors.info;
  notification.style.color = 'white';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in-out forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePopup);
} else {
  initializePopup();
}

// Export functions for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateRandomCardNumber,
    generateRandomExpirationDate,
    generateRandomCVV,
    generateRandomCardholderName,
    generateRandomCardData,
    formatCardNumber,
    autofillCardForm,
    displayCardData,
    generateRandomCard,
    copyToClipboard,
    showNotification
  };
}