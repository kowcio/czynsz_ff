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
import type {
  Dokument,
  Finanse,
  HistoriaRachunku,
  Pozycje,
} from './models/EstateCare/DajDrzewoFinHistoria'
import type { DocumentPozycje } from './models/EstateCare/DajDokSzczegoly'

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
  //add css when mounted
  // document.body.style.border = '5px solid black'
})

const finanse = ref<Finanse[]>([])
const dokumenty = ref<Record<string, any>[]>([]) //DocumentPozycje
const kontaFinansowe = ref<string[]>([])
async function getTheData() {
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

  // 1. pobranie listy finansów wraz z listą dokumentów gdzie są rozpisane szczegóły
  // co i ile kosztuje
  await axios
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

  // 2. Pobranie wszystkich dokumentów wraz z szczegółami
  dokumenty.value = finanse.value.flatMap((finans) => {
    // Use empty array if Pozycje is null or undefined
    const pozycje = finans.Pozycje ?? []
    return pozycje.flatMap((pozycja) => {
      // Use empty array if nested Pozycje is null or undefined
      const nestedPozycje = pozycja.Pozycje ?? []
      // Map nested Pozycje to Dokument, filter out null/undefined Dokuments
      return nestedPozycje
        .map((pozycja2) => pozycja2.Dokument)
        .filter((dokument) => !!dokument && Object.keys(dokument).length > 0)
        .map((dokument) => dokument as Record<string, any>)
    })
  })

  console.log('The number of document ids is ', dokumenty.value.length, dokumenty.value)
  // 4. Zapisanie w storze

  localStorage.setItem('finanse', JSON.stringify(finanse.value))
  localStorage.setItem('dokumenty', JSON.stringify(dokumenty.value))

  //5. Przeiterować dokumenty i a nastepnie pogrupować miesiącem / i tym za co jest zapłata

  //  Szczegoly?: Record<string, string>
  const dokumentISzczegoly = dokumenty.value.map((dokument) => ({
    Ident: dokument.Ident,
    Opis: dokument.Opis,
    Numer: dokument.Numer,
    Kwota: dokument.Kwota,
    SzczegolyPozycje: dokument.Szczegoly?.Pozycje,
  }))

  console.log('Pozycje ; ', dokumentISzczegoly[0].SzczegolyPozycje)
  dokumentISzczegoly.forEach((dokument) => {
    console.log(dokument.Opis, dokument.Numer, dokument.Opis, dokument.Kwota)
    dokument.SzczegolyPozycje?.forEach((pozycja: { SkladnikOpl: any; Brutto: any; Netto: any }) => {
      //return for front test in cnsole
      console.log(pozycja.SkladnikOpl, pozycja.Brutto, pozycja.Netto)
    })
  })
}
</script>

<style>
/* Your styles here */
</style>
