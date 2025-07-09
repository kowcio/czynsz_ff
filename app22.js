/**
 *
 * THS IS PURE JS PART
 *
 */

// const btn = document.querySelector('#button')
// if (btn) btn.addEventListener('click', loadTabs)
// function loadTabs() {
//   // This is the request to obtain an array of active tabs. It returns a promise.
//   // It accepts a config object (see docs)
//   browser.tabs.query({ currentWindow: true }).then((tabs) => {
//     const results = document.querySelector('#results'),
//       parts = []
//     for (let tab of tabs) {
//       parts.push(`<li>${tab.title}: ${tab.url}</li>`)
//     }
//     results.innerHTML = parts.join('')
//   })
// }

/**
 *
 * * THS IS PURE VUE PART !!
 *
 */

// import Vue from 'vue'
// import Vue from 'vue.esm-bundler.js'
// import Vue from 'vue/dist/vue.esm-bundler.js'
// import * as Vue from 'vue/dist/vue.esm-bundler.js'
// import { createApp } from 'vue';
import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
// import router from 'router'
const app = createApp(App)
app.use(createPinia())
// app.use(router)
const el = document.getElementById('app')

if (el) {
  app.mount(el)
} else {
  console.error('Error: #app element not found')
}
