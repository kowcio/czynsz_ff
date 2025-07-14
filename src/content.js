// // Inject container if not already present
// if (!document.getElementById('my-vue-header')) {
//   const headerDiv = document.createElement('div')
//   headerDiv.id = 'my-vue-header'
//   document.body.insertBefore(headerDiv, document.body.firstChild)
// }

// // Inject styles for sticky header
// const style = document.createElement('style')
// if (window.location.href === 'https://rozliczenia.estatecare.pl/content/InetObsKontr/finanse') {
//   style.textContent = `
//     #my-vue-header {
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 5vh;
//       margin: 0;
//       z-index: 9999;
//       background-color: rgba(255, 166, 0, 0.12);
//       padding: 10px 0; text-align: center;
//       border: solid green 5px;
//     }
//   `
// }
// document.head.appendChild(style)

// // Mount Vue app
// import { createApp } from 'vue'
// import App from './@/App.vue' // Adjust path as needed

// const app = createApp(App)
// app.use(createPinia())
// app.mount('#my-vue-header')
