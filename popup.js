async function injectContentScriptAndActivate() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Check if we can inject into this tab
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      alert('Color picker cannot be used on this page due to browser restrictions.');
      return;
    }

    // First inject the content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['contentScript.js']
    });

    // Then inject the styles
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['styles.css']
    });

    // Now we can safely send the message
    await chrome.tabs.sendMessage(tab.id, { action: 'activate_picker' });
    window.close();
  } catch (err) {
    console.error('Failed to inject content script:', err);
    alert('Unable to activate color picker on this page.');
  }
}

// Toggle history visibility
function toggleHistory() {
  const historyDiv = document.getElementById('colorHistory');
  const button = document.getElementById('toggleHistory');
  
  if (historyDiv.classList.contains('show')) {
    historyDiv.classList.remove('show');
    button.textContent = 'Show Saved Colors';
  } else {
    historyDiv.classList.add('show');
    button.textContent = 'Hide Saved Colors';
  }
}

document.getElementById('activatePicker').addEventListener('click', injectContentScriptAndActivate);
document.getElementById('toggleHistory').addEventListener('click', toggleHistory);

// Load and display color history
chrome.storage.local.get(['colorHistory'], function(result) {
  const history = result.colorHistory || [];
  const historyDiv = document.getElementById('colorHistory');
  
  if (history.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.textContent = 'No colors saved yet';
    historyDiv.appendChild(emptyMessage);
    return;
  }
  
  history.forEach(color => {
    const item = document.createElement('div');
    item.className = 'color-item';
    
    const preview = document.createElement('div');
    preview.className = 'color-preview';
    preview.style.backgroundColor = color;
    
    const text = document.createElement('span');
    text.textContent = color;
    
    item.appendChild(preview);
    item.appendChild(text);
    historyDiv.appendChild(item);
  });
});