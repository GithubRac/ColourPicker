// contentScript.js
let isPickerActive = false;
let pickerElement = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'activate_picker') {
    activateColorPicker();
  }
});

function activateColorPicker() {
  if (isPickerActive) return;
  isPickerActive = true;
  
  // Create picker element
  pickerElement = document.createElement('div');
  pickerElement.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid #000;
    border-radius: 50%;
    pointer-events: none;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  // Add instruction tooltip
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 999999;
  `;
  tooltip.textContent = 'Press SPACE to capture color, ESC to cancel';
  document.body.appendChild(tooltip);
  
  const colorPreview = document.createElement('div');
  colorPreview.style.cssText = `
    width: 10px;
    height: 10px;
    border-radius: 50%;
  `;
  pickerElement.appendChild(colorPreview);
  document.body.appendChild(pickerElement);
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('keydown', handleKeyPress);
  
  document.body.style.cursor = 'crosshair';
}

function getElementColor(element) {
  const computedStyle = window.getComputedStyle(element);
  let color = computedStyle.backgroundColor;
  
  // If background is transparent, try getting color
  if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
    color = computedStyle.color;
  }
  
  return color;
}

function handleMouseMove(e) {
  if (!isPickerActive) return;
  
  pickerElement.style.left = `${e.clientX - 10}px`;
  pickerElement.style.top = `${e.clientY - 10}px`;
  
  const element = document.elementFromPoint(e.clientX, e.clientY);
  if (element) {
    const color = getElementColor(element);
    const hexColor = rgbToHex(color);
    pickerElement.querySelector('div').style.backgroundColor = hexColor;
    pickerElement.style.borderColor = hexColor;
  }
}

function handleKeyPress(e) {
  if (!isPickerActive) return;
  
  if (e.code === 'Space') {
    e.preventDefault();
    
    const x = parseInt(pickerElement.style.left) + 10;
    const y = parseInt(pickerElement.style.top) + 10;
    const element = document.elementFromPoint(x, y);
    
    if (element) {
      const color = getElementColor(element);
      const hexColor = rgbToHex(color);
      
      // Show feedback tooltip
      showFeedbackTooltip(hexColor);
      
      // Save and copy color
      saveColorAndCopy(hexColor);
    }
  } else if (e.key === 'Escape') {
    deactivateColorPicker();
  }
}

function showFeedbackTooltip(hexColor) {
  // Remove any existing feedback
  const existingFeedback = document.querySelector('.color-picker-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }

  const feedback = document.createElement('div');
  feedback.className = 'color-picker-feedback';
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 999999;
  `;
  feedback.textContent = `Color ${hexColor} copied!`;
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.remove();
    }
  }, 2000);
}

function saveColorAndCopy(hexColor) {
  // Save to storage
  chrome.storage.local.get(['colorHistory'], function(result) {
    const history = result.colorHistory || [];
    if (!history.includes(hexColor)) {
      history.unshift(hexColor);
      if (history.length > 10) history.pop();
      chrome.storage.local.set({ colorHistory: history }, () => {
        console.log('Color saved:', hexColor);
      });
    }
  });

  // Copy to clipboard
  navigator.clipboard.writeText(hexColor)
    .then(() => {
      console.log('Color copied to clipboard:', hexColor);
    })
    .catch(err => {
      console.error('Failed to copy color:', err);
    });
}

function deactivateColorPicker() {
  isPickerActive = false;
  document.body.style.cursor = 'default';
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('keydown', handleKeyPress);
  
  // Remove all elements
  const elements = document.querySelectorAll('div[style*="z-index: 999999"]');
  elements.forEach(el => el.remove());
  
  pickerElement = null;
}

function rgbToHex(rgb) {
  const values = rgb.match(/\d+/g);
  if (!values) return '#000000';
  
  const r = parseInt(values[0]);
  const g = parseInt(values[1]);
  const b = parseInt(values[2]);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}