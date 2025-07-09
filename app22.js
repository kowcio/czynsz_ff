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
    top: 0; left: 0; width: 100%;
    z-index: 9999;
    background: #333; color: #fff;
    padding: 10px 0; text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  body { padding-top: 60px; }
`
document.head.appendChild(style)
app.mount('#my-vue-header')
