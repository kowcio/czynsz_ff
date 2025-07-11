<template>
  <div>Hello VUE 33 plugin</div>
  <!-- Empty template: nothing rendered by Vue -->
  <!-- <button @click="addTopLevelSticker">Add sticker</button> -->
  <button @click="getTabs">List Tabs</button>
  <button @click="getTheData">Ile hajsu ?!</button>
  <li v-for="wpis in finanse" :key="wpis.RejIdent">
    {{ wpis.McStanu }} - {{ wpis.Opis }} - {{ wpis.DoZaplaty }} -{{ wpis.Obciazenia }} -
    {{ wpis.Uznania }}
  </li>
  <ul>
    <!-- <li v-for="tab in tabs1" :key="tab.id">{{ tab }} - {{ tab.title }} - {{ tab.url }}</li> -->
    <li v-for="tab in tabs2" :key="tab.tab.id">
      {{ tab.creationTime }} - {{ tab.tab.title }} - {{ tab.tab.url }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import dayjs from 'dayjs'
import axios from 'axios'
import { ref } from 'vue'
import browser from 'webextension-polyfill'
import type { Tabs } from 'webextension-polyfill'
import type { Finanse, HistoriaRachunku } from './models/EstateCareModels'
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

const finanse = ref<Finanse[]>([])
const kontaFinansowe = ref<string[]>([])
function getTheData() {
  const numerRachunku = 113986
  const data_od = '2024-01-01'
  const data_do = dayjs().format('YYYY-MM-DD') //'2025-08-11'
  const url = `https://rozliczenia.estatecare.pl/iokRozr/DajDrzewoFinHistoria?Rozr=${numerRachunku}&DataOd=${data_od}}&DataDo=${data_do}`

  const POMSessionId = localStorage.getItem('POMSessionId')
  const at = localStorage.getItem('at')

  const elements = document.querySelectorAll('.app-konto-finansowe')
  elements.forEach((element) => {
    kontaFinansowe.value.push(element.getAttribute('href') || 'Brak konta finansowego')
    // do something with the href
  })
  console.log(kontaFinansowe.value)
  axios
    .get(url, {
      headers: {
        Cookie: `POMSessionId=${POMSessionId}; at=${at}`,
      },
    })
    .then((response) => {
      const historiaRachunku: HistoriaRachunku = response.data.data

      finanse.value = historiaRachunku.Finanse
      console.log(response.data)
      console.log(response.data.data)

      console.log(finanse.value)
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>

<style>
/* Your styles here */
</style>
