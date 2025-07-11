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
    top: 2%; left: 10%; width: 80%;
    margin:2%;
    z-index: 9999;
  background-color: rgba(255, 166, 0, 0.12);
    padding: 10px 0; text-align: center;

  }

`
document.head.appendChild(style)

// Mount Vue app
import { createApp } from 'vue'
import App from './@/App.vue' // Adjust path as needed

const app = createApp(App)
app.use(createPinia())
app.mount('#my-vue-header')
