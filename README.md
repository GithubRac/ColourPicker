<img width="180" alt="Screenshot_2" src="https://github.com/user-attachments/assets/38d1df1b-222f-496d-9e91-4e24a9cf1a9d">

# Web Color Picker v0.1.0

A Chrome extension that allows you to pick colors from any webpage. Simply hover over any element to preview its color, press SPACE to capture it, and the color will be automatically copied to your clipboard and saved to your history.

## Features

- Pick colors from any webpage element
- Real-time color preview while hovering
- Automatically copies colors to clipboard
- Saves up to 10 recently picked colors
- Works on most websites (except browser-restricted pages)
- Keyboard shortcuts for better control

## Installation
Packed version:
1. For easy installation drag the .crx file to your browser and click add extension.

Unpacked installation:
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## How to Use
1. Click the extension icon in your browser toolbar
2. Click "Start Color Picker" to activate
3. Hover over any element to preview its color
4. Press SPACE to capture the color (it will be copied to your clipboard)
5. Press ESC to cancel color picking
6. Click "Show Saved Colors" to view your color history

## Keyboard Shortcuts

- `SPACE`: Capture the current color
- `ESC`: Cancel color picking

## Files Structure

All the files are in the same directory, except the images are in the images folder within the directory.


## Permissions Required

- `activeTab`: To access the current tab's content
- `storage`: To save color history
- `scripting`: To inject the color picker
- `clipboardWrite`: To copy colors to clipboard

## Browser Compatibility

- Chrome/Chromium-based browsers
- Microsoft Edge

## Limitations

- Cannot pick colors from browser-restricted pages (chrome://, edge://, about:)
- Cannot pick colors from cross-origin iframes
- Maximum of 10 colors in history

## Development

To modify the extension:
1. Make your changes to the source files
2. Reload the extension in `chrome://extensions/`
3. Test the changes on various websites

## License

MIT License - feel free to modify and use as needed.
