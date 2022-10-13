import { elements as el } from './elements';
import { saveThemeFavorites } from './favorites';
function setLightTheme() {
  document.documentElement.style.setProperty('--bg-color', '#FCFCFC');
  document.documentElement.style.setProperty('--bg-text', '#202025');
  document.documentElement.style.setProperty('--modal-text-color', '#5f6775');
  saveThemeFavorites('Light');
}
function setDarkTheme() {
  document.documentElement.style.setProperty('--bg-color', '#202025');
  document.documentElement.style.setProperty('--bg-text', '#FCFCFC');
  document.documentElement.style.setProperty('--modal-text-color', '#FCFCFC');
  saveThemeFavorites('Dark');
}

export function setTheme(theme) {
  switch (theme) {
    case 'Light':
      el.toggleSwitch.checked = false;
      setLightTheme();
      break;
    case 'Dark':
      el.toggleSwitch.checked = true;
      setDarkTheme();
      break;
  }
}
