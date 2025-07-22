<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div>Hello VUE 33 plugin</div>
  <!-- Empty template: nothing rendered by Vue -->
  <!-- <button @click="addTopLevelSticker">Add sticker</button> -->
  <!-- <button @click="getTabs">List Tabs</button> -->
  Chart
  <div class="charts-row">
    <ChartComposite :chartData="chartData" class="chart-container" />
    <ChartComposite :chartData="chartData2" class="chart-container" />
  </div>
  <button @click="getTheData">Ile hajsu ?!</button>
  <!-- <li v-for="wpis in finanse" :key="wpis.RejIdent">
    {{ wpis.McStanu }} - {{ wpis.Opis }} - {{ wpis.DoZaplaty }} -{{ wpis.Obciazenia }} -
    {{ wpis.Uznania }}
  </li>
  <ul>
    <li v-for="tab in tabs1" :key="tab.id">{{ tab }} - {{ tab.title }} - {{ tab.url }}</li> -->
  <!-- <li v-for="tab in tabs2" :key="tab.tab.id"> -->
  <!-- {{ tab.creationTime }} - {{ tab.tab.title }} - {{ tab.tab.url }} -->
  <!-- </li> -->
  <!-- </ul> -->
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import dayjs from 'dayjs'
import { ref } from 'vue'
// import browser from 'webextension-polyfill'
// import type { Tabs } from 'webextension-polyfill'
import type { Dokument, Finanse, HistoriaRachunku } from './models/EstateCare/DajDrzewoFinHistoria'
import { useFinanseStore } from './stores/FinanseStore'
import ChartComposite from './components/charts/Miesiecznie.vue'
import type { ChartData, Dataset } from './models/Charts'

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

const finStore = useFinanseStore()
const kontaFinansowe = ref<string[]>([])
const historiaRachunku = ref<HistoriaRachunku>()
const finanse = ref<Finanse[]>([])
const dokumenty = ref<Dokument[]>([])

const chartData = ref<ChartData>({
  type: 'bar',
  labels: [],
  datasets: [
    {
      label: 'Miesieczne obciazenia',
      backgroundColor: '#f87979',
      data: [],
      borderWidth: 1,
      borderColor: '#f87979',
    },
  ],
})

const chartDataTemp = ref<ChartData>({
  type: 'line',
  labels: [],
  datasets: [
    {
      label: 'Miesieczne obciazenia',
      backgroundColor: '#f87979',
      data: [],
      borderWidth: 1,
      borderColor: '#f87979',
    },
  ],
})
const chartData2 = ref<ChartData>({
  type: 'line',
  labels: [], //daty
  datasets: [], //label + data - dane
})

const data_x_chart: string[] = []
const data_y_datasets_label_data = new Map<string, number[]>()

async function getTheData() {
  const numerRachunku = 113986
  const numerRachunku2 = 122557
  const finStore = useFinanseStore()
  const data_od = '2024-01-01'
  const data_do = dayjs().format('YYYY-MM-DD') // '2025-08-11'
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
  let debug_i = 0

  outerloop: for (const numerRachunku of kontaFinansowe.value) {
    finanse.value = await finStore.loadHistoriaRachunku(numerRachunku)
    console.log('Loaded finanse for numerRachunku:', numerRachunku)
    for (const finanseZaMiesiac of finanse.value) {
      if (!finanseZaMiesiac.Pozycje) {
        console.log('Brak wpisów w miesiącu ', finanseZaMiesiac.McStanu, finanseZaMiesiac.Opis)
        continue
      }
      console.log('Finanse za miesiac', finanseZaMiesiac.McStanu, finanseZaMiesiac.Opis)

      for (const finans_pozycje of finanseZaMiesiac.Pozycje ?? []) {
        console.log(
          'Całkowity koszt (suma z dokumentów) : ',
          finanseZaMiesiac.McStanu,
          finans_pozycje.Opis,
          finans_pozycje.Obciazenia,
        )
        //CHARTS
        chartDataTemp.value.labels.push(dayjs(finanseZaMiesiac.McStanu).format('YYYY-MM-DD'))
        chartDataTemp.value.datasets[0].data.push(finans_pozycje.Obciazenia)
        data_x_chart.push(dayjs(finanseZaMiesiac.McStanu).format('YYYY-MM-DD'))

        const dokumentIds = finans_pozycje.Pozycje?.map(
          (pozycja) =>
            pozycja.Dokument?.Ident?.concat('-' + pozycja.Dokument?.Opis) ?? 'Brak opisu',
        ).join(', ')

        console.log(
          'Pozycja z ',
          finans_pozycje.Pozycje?.length,
          ' dokumentami. ',
          dokumentIds,
          finans_pozycje.Pozycje,
        )

        for (const pozycjaZDokumentem of finans_pozycje.Pozycje ?? []) {
          if (!pozycjaZDokumentem.Dokument) {
            console.log('Dokument pusty', pozycjaZDokumentem.Dokument)
            continue
          }
          // console.log('pozycjaZDokumentem', pozycjaZDokumentem.Opis)

          const values = ['Nalicz', 'Naleznosc', 'Naliczenie', 'nalicz', 'korekta']
          const regex = new RegExp(values.join('|'), 'i')
          if (!regex.test(pozycjaZDokumentem.Dokument?.Opis ?? '')) {
            // console.log(
            //   'Pomijam ',
            //   pozycjaZDokumentem.Dokument?.Ident,
            //   pozycjaZDokumentem.Dokument?.Opis,
            // )
            continue
          }

          const identToGet = pozycjaZDokumentem.Dokument?.Ident
          if (identToGet) {
            console.log('debug_i:', debug_i)
            if (debug_i++ == 5) break outerloop //return
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const dokumentZListaOplat = await finStore.loadDokument(identToGet)
            console.log(
              'Opis dokumentu z opłatami :',
              dokumentZListaOplat?.Ident,
              dokumentZListaOplat?.Opis,
            )
            //NAJWAZNIEJSZE !!
            for (const szczegoly of dokumentZListaOplat?.Szczegoly?.Pozycje ?? []) {
              console.log(
                'miesiac;' + dayjs(finanseZaMiesiac.McStanu).format('YYYY-MM-DD'),
                ';dokumentIdent;' + dokumentZListaOplat?.Ident,
                ';sumaOplatZaMiesiac;' + dokumentZListaOplat?.Kwota,
                ';oplata' + szczegoly.SkladnikOpl,
                ';kwotaBrutto;' + szczegoly.Brutto,
              )

              //  chartDataTemp.value.labels.push(dayjs(finanseZaMiesiac.McStanu).format('YYYY-MM-DD'))
              // chartDataTemp.value.datasets[0].data.push(finans_pozycje.Obciazenia)
              const label = szczegoly.SkladnikOpl
              const values = data_y_datasets_label_data.get(label) || []
              values.push(szczegoly.Brutto)
              data_y_datasets_label_data.set(label, values)
            }
          } else {
            console.log('Brak dokumentów', pozycjaZDokumentem)
          }
        }
      }
    }
  }

  // Assign aggregated data to chartData2
  console.log('data_x_chart', data_x_chart)
  console.log('data_y_datasets_label_data', data_y_datasets_label_data)

  chartData2.value = {
    ...chartData2.value,
    labels: data_x_chart,
    datasets: Array.from(data_y_datasets_label_data.entries()).map(([key, value]) => ({
      label: key,
      data: value,
      normalized: true,
      backgroundColor: getRandomColor(),
    })),
  }

  finStore.saveChartDate(chartDataTemp.value)
  chartData.value = chartDataTemp.value
  console.log('Chart data', chartData.value)
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
</script>

<style>
/* Your styles here */
.charts-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: flex-start;
}
.chart-container {
  width: 2000px;
  height: 500px;
}
</style>
