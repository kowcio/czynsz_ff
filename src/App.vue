<template>
  <div>Hello VUE 33 plugin</div>
  <!-- Empty template: nothing rendered by Vue -->
  <!-- <button @click="addTopLevelSticker">Add sticker</button> -->
  <button @click="getTabs">List Tabs</button>

  <ul>
    <!-- <li v-for="tab in tabs1" :key="tab.id">{{ tab }} - {{ tab.title }} - {{ tab.url }}</li> -->
    <li v-for="tab in tabs2" :key="tab.id">
      {{ tab.creationTime }} - {{ tab.tab.title }} - {{ tab.tab.url }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import dayjs from 'dayjs'

import { ref } from 'vue'
import browser from 'webextension-polyfill'
import type { Tabs } from 'webextension-polyfill'

onMounted(() => {
  console.log('Component mounted!')
})

interface TabCreationProperties {
  tab: Tabs.Tab
  creationTime: string
}

const tabs1 = ref<Tabs.Tab[]>([]) // Explicitly type the ref
const tabs2 = ref<TabCreationProperties[]>([]) // Explicitly type the ref

function getTabs() {
  browser.tabs.query({ currentWindow: true }).then((tabs) => {
    tabs1.value = tabs

    tabs2.value = tabs.map((tab) => ({
      tab,
      creationTime: dayjs().format('DDMMYYYY:HH:mm'),
    })) as TabCreationProperties[]
  })
}
onMounted(() => {
  document.body.style.border = '5px solid orange'
})
</script>

<style>
/* Your styles here */
</style>
