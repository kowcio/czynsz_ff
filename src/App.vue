<template>
  <div>Hello VUE 33 plugin</div>
  <!-- Empty template: nothing rendered by Vue -->
  <!-- <button @click="addTopLevelSticker">Add sticker</button> -->
  <button @click="getTabs">List Tabs</button>

  <ul>
    <li v-for="tab in tabs" :key="tab.id">{{ tab.title }} - {{ tab.url }}</li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { ref } from 'vue'
import browser from 'webextension-polyfill'
import type { Tabs } from 'webextension-polyfill'

onMounted(() => {
  console.log('Component mounted!')
})

const tabs = ref<Tabs.Tab[]>([]) // Explicitly type the ref

function getTabs() {
  browser.tabs.query({ currentWindow: true }).then((result) => {
    tabs.value = result
  })
}
onMounted(() => {
  document.body.style.border = '5px solid green'
})
</script>

<style>
/* Your styles here */
</style>
