// Inject container if not already present
if (!document.getElementById('my-vue-header')) {
  const headerDiv = document.createElement('div')
  headerDiv.id = 'my-vue-header'
  document.body.insertBefore(headerDiv, document.body.firstChild)
}

// Inject styles for sticky header
const style = document.createElement('style')
style.textContent = `
  #my-vue-header {
    position: fixed;
    top: 0; left: 0; width: 100%;
    z-index: 9999;
    background: #333; color: #fff;
    padding: 10px 0; text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  body { padding-top: 60px; }
`
document.head.appendChild(style)

// Mount Vue app
import { createApp } from 'vue'
import App from './@/App.vue' // Adjust path as needed

const app = createApp(App)
app.use(createPinia())
app.mount('#my-vue-header')
