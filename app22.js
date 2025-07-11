import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'

// SHARED CONSTANTS
const sharedPiniaStoreAcrossTheApps = createPinia()

// APP 1  - POP up app used in "default_popup": "popup.html"

const app = createApp(App)
app.use(sharedPiniaStoreAcrossTheApps)
const el = document.getElementById('app')

if (el) {
  app.mount(el)
} else {
  console.error('Error: #app element not found')
}

// APP 2 - the same but mounted on the main browser page instead of the popup on extention

if (!document.getElementById('my-vue-header')) {
  const headerDiv = document.createElement('div')
  headerDiv.id = 'my-vue-header'
  document.body.insertBefore(headerDiv, document.body.firstChild)
}
const style = document.createElement('style')
style.textContent = `
  #my-vue-header {
    top: 2%; left: 10%; width: 80%;
    margin:2%;
    z-index: 9999;
  background-color: rgba(255, 166, 0, 0.12);
    padding: 10px 0; text-align: center;

  }

`
document.head.appendChild(style)
app.mount('#my-vue-header')
