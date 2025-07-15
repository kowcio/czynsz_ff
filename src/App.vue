<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div>Hello VUE 33 plugin</div>
  <!-- Empty template: nothing rendered by Vue -->
  <!-- <button @click="addTopLevelSticker">Add sticker</button> -->
  <!-- <button @click="getTabs">List Tabs</button> -->
  <button @click="getTheData">Ile hajsu ?!</button>
  <li v-for="wpis in finanse" :key="wpis.RejIdent">
    {{ wpis.McStanu }} - {{ wpis.Opis }} - {{ wpis.DoZaplaty }} -{{ wpis.Obciazenia }} -
    {{ wpis.Uznania }}
  </li>
  <ul>
    <!-- <li v-for="tab in tabs1" :key="tab.id">{{ tab }} - {{ tab.title }} - {{ tab.url }}</li> -->
    <!-- <li v-for="tab in tabs2" :key="tab.tab.id"> -->
    <!-- {{ tab.creationTime }} - {{ tab.tab.title }} - {{ tab.tab.url }} -->
    <!-- </li> -->
  </ul>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import dayjs from 'dayjs'
import axios from 'axios'
import { ref } from 'vue'
// import browser from 'webextension-polyfill'
// import type { Tabs } from 'webextension-polyfill'
import type { Dokument, Finanse } from './models/EstateCare/DajDrzewoFinHistoria'

onMounted(() => {
  console.log('Component mounted!')
})

// interface TabCreationProperties {
//   tab: Tabs.Tab
//   creationTime: string
// }

// const tabs1 = ref<Tabs.Tab[]>([]) // Explicitly type the ref
// const tabs2 = ref<TabCreationProperties[]>([]) // Explicitly type the ref

// function getTabs() {
//   browser.tabs.query({ currentWindow: true }).then((tabs) => {
//     tabs1.value = tabs

//     tabs2.value = tabs.map((tab) => ({
//       tab,
//       creationTime: dayjs().format('DDMMYYYY:HH:mm'),
//     })) as TabCreationProperties[]
//   })
// }
// onMounted(() => {
//   // document.body.style.border = '5px solid black'
// })

const kontaFinansowe = ref<string[]>([])
const finanse = ref<Finanse[]>([])
const dokumenty = ref<Dokument[]>([])

async function getTheData() {
  const numerRachunku = 113986
  const numerRachunku2 = 122557

  const data_od = '2024-01-01'
  const data_do = dayjs().format('YYYY-MM-DD') //'2025-08-11'
  const url = `https://rozliczenia.estatecare.pl/iokRozr/DajDrzewoFinHistoria?Rozr=${numerRachunku}&DataOd=${data_od}}&DataDo=${data_do}`

  const elements = document.querySelectorAll('.app-konto-finansowe')
  elements.forEach((element) => {
    const adresDoRachunkuFinansowego = element.getAttribute('href') || ''
    const regex = /\/content\/InetObsKontr\/finanse\/(\d+)/
    const match = adresDoRachunkuFinansowego.match(regex)
    if (match) {
      kontaFinansowe.value.push(match[1])
    }
  })
  console.log('Znaleziono konta finansowe:', kontaFinansowe.value.toString())
  // 1. pobranie listy finansów wraz z listą dokumentów gdzie są rozpisane szczegóły co i ile kosztuje

  finanse.value = await getHistoriaRachunku(url)
  console.log('The number of finanse is ', finanse.value)

  // 2. Zczytanie wszystkich dokumentów wraz z szczegółami
  dokumenty.value = await getDokumentsWithIdentsToFetchDetails(finanse.value)

  /**
   * Zrobić 2 mapy gdzie kluczem będzie Ident dokumetu i wtedy bede mogl
   * pobrać miesiac i do tego odpowiedni dokument.
   */

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
    SzczegolyPozycje: dokument.Szczegoly?.Pozycje, //to jest puste daczegos
  }))
  console.log('dokumentISzczegoly', dokumentISzczegoly)
  dokumentISzczegoly.forEach((dokument) => {
    console.log(dokument.Opis, dokument.Numer, dokument.Opis, dokument.Kwota)
    dokument.SzczegolyPozycje?.forEach(
      (pozycja: { SkladnikOpl: string; Brutto: number; Netto: number }) => {
        //return for front test in cnsole
        console.log('Pozycja kosztów ', pozycja.SkladnikOpl, pozycja.Brutto, pozycja.Netto)
      },
    )
  })

  // 6. Proboa połączenia jednego z drugim uzywajac miesiace
  const linkedData = finanse.value.reduce((acc: { [key: string]: any }, finans) => {
    const entry = dokumenty.value.find((entry) => entry.Opis === finans.Opis)
    if (entry) {
      acc[finans.Opis] = { ...finans, entry }
    }
    return acc
  }, {})
  console.log(linkedData)
  ////////////////////////////////////////////////////////////////////////////////////////
}

function getDokumentsWithIdentsToFetchDetails(finanse: Finanse[]) {
  return finanse.flatMap((finans) => {
    // Use empty array if Pozycje is null or undefined
    const pozycje = finans.Pozycje ?? []
    return pozycje.flatMap((pozycja) => {
      console.log('pozycja.McStanu', pozycja.McStanu)
      const wewnetrzenePozycjeZDokumentem = pozycja.Pozycje ?? []
      return wewnetrzenePozycjeZDokumentem
        .map((pozycjaZDokumentem) => pozycjaZDokumentem.Dokument)
        .filter((dokument) => !!dokument && Object.keys(dokument).length > 0)
        .map((dokument) => dokument as Dokument)
    })
  })
}

function getHistoriaRachunku(url: string): Promise<Finanse[]> {
  const POMSessionId = localStorage.getItem('POMSessionId')
  const at = localStorage.getItem('at')
  return axios
    .get(url, {
      headers: {
        Cookie: `POMSessionId=${POMSessionId}; at=${at}`,
      },
    })
    .then((response) => response.data.data.Finanse as Finanse[])
}
</script>

<style>
/* Your styles here */
</style>
