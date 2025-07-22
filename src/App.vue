<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div>Hello VUE 33 plugin</div>
  <!-- Empty template: nothing rendered by Vue -->
  <!-- <button @click="addTopLevelSticker">Add sticker</button> -->
  <!-- <button @click="getTabs">List Tabs</button> -->
  Chart
  <div class="charts-row">
    <ChartComposite :chartData="monthlyChart" class="chart-container" />
    <ChartComposite :chartData="everyItemChart" class="chart-container" />
  </div>
  <button @click="getTheData">Pokaz wykresy</button>
  <button @click="getCsvData">Pobierz csv</button>

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
import type { ChartData } from './models/Charts'
import type { DocumentSzczegoly, Pozycja } from './models/EstateCare/DajDokSzczegoly'

onMounted(() => {
  console.log('Component mounted!')
})

const finStore = useFinanseStore()
const kontaFinansowe = ref<string[]>([])
const historiaRachunku = ref<HistoriaRachunku>()
const finanse = ref<Finanse[]>([])
const dokumenty = ref<Dokument[]>([])

const monthlyChart = ref<ChartData>({
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

const everyItemChart = ref<ChartData>({
  type: 'line',
  labels: [], //daty
  datasets: [], //label + data - dane
})

const datesForChart: string[] = []
const monthlyValues: number[] = []
const everyItemMapValuesPerMonth = new Map<string, number[]>()

async function getTheData() {
  const values = ['Nalicz', 'Naleznosc', 'Naliczenie', 'nalicz', 'korekta']

  let debug_i = 0
  kontaFinansowe.value = await finStore.loadKontaFinansowe()

  outerloop: for (const numerRachunku of kontaFinansowe.value) {
    finanse.value = await finStore.loadHistoriaRachunku(numerRachunku)
    for (const finanseZaMiesiac of finanse.value) {
      if (!finanseZaMiesiac.Pozycje) {
        // console.log('Brak wpisów w miesiącu ', finanseZaMiesiac.McStanu, finanseZaMiesiac.Opis)
        continue
      }
      datesForChart.push(dayjs(finanseZaMiesiac.McStanu).format('YYYY-MM-DD'))

      // console.log('Finanse za miesiac', finanseZaMiesiac.McStanu, finanseZaMiesiac.Opis)
      for (const finans_pozycje of finanseZaMiesiac.Pozycje ?? []) {
        // console.log(
        //   'Całkowity koszt (suma z dokumentów) : ',
        //   finanseZaMiesiac.McStanu,
        //   finans_pozycje.Opis,
        //   finans_pozycje.Obciazenia,
        // )
        //CHARTS
        monthlyValues.push(finans_pozycje.Obciazenia)
        // monthlyChart.value.datasets[0].data.push(finans_pozycje.Obciazenia)

        // const dokumentIds = finans_pozycje.Pozycje?.map(
        //   (pozycja) =>
        //     pozycja.Dokument?.Ident?.concat('-' + pozycja.Dokument?.Opis) ?? 'Brak opisu',
        // ).join(', ')

        // console.log(
        //   'Pozycja z ',
        //   finans_pozycje.Pozycje?.length,
        //   ' dokumentami. ',
        //   dokumentIds,
        //   finans_pozycje.Pozycje,
        // )

        for (const pozycjaZDokumentem of finans_pozycje.Pozycje ?? []) {
          const dokumentJestPusty = !pozycjaZDokumentem.Dokument
          if (dokumentJestPusty) {
            // console.log('Dokument pusty', pozycjaZDokumentem.Dokument)
            continue
          }
          const regex = new RegExp(values.join('|'), 'i')
          const dokumentBrakOpisu = !regex.test(pozycjaZDokumentem.Dokument?.Opis ?? '')
          if (dokumentBrakOpisu) {
            // console.log(
            //   'Pomijam ',
            //   pozycjaZDokumentem.Dokument?.Ident,
            //   pozycjaZDokumentem.Dokument?.Opis,
            // )
            continue
          }

          const identToGet = pozycjaZDokumentem.Dokument?.Ident
          if (identToGet) {
            // console.log('debug_i:', debug_i)
            if (debug_i++ == 2) break outerloop //return
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const dokumentZListaOplat = await finStore.loadDokument(identToGet)

            //NAJWAZNIEJSZE !!
            for (const szczegoly of dokumentZListaOplat?.Szczegoly?.Pozycje ?? []) {
              // newFunction(finanseZaMiesiac, dokumentZListaOplat, szczegoly)
              finStore.getLogSzczegolyOplatCsv(finanseZaMiesiac, dokumentZListaOplat!, szczegoly)

              const label = szczegoly.SkladnikOpl
              const values = everyItemMapValuesPerMonth.get(label) || []
              values.push(szczegoly.Brutto)
              everyItemMapValuesPerMonth.set(label, values)
            }
          }
          // else {
          // console.log('Brak dokumentów', pozycjaZDokumentem)
          // }
        }
      }
    }
  }

  //make csv
  const csvData = finStore.getCsvData
  localStorage.setItem('csvData', JSON.stringify(csvData))

  // Assign aggregated data to chartData2
  monthlyChart.value = {
    type: 'line',
    labels: datesForChart,
    datasets: [{ ...monthlyChart.value.datasets[0], data: monthlyValues }],
  }

  everyItemChart.value = {
    type: 'line',
    labels: datesForChart,
    datasets: Array.from(everyItemMapValuesPerMonth.entries()).map(([key, value]) => ({
      label: key,
      data: value,
      normalized: true,
      backgroundColor: getRandomColor(),
    })),
  }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function getCsvData() {
  const csvData = JSON.parse(localStorage.getItem('csvData') ?? '') ?? [] ?? finStore.getCsvData
  console.log('csvData', csvData)
  const csvDataArr = csvData.map((row: string) => row.split(';')) // split each row into an array of columns

  if (csvDataArr.length > 0) {
    const txtContent = csvDataArr.map((row: string[]) => row.join(',')).join('\n')
    const txtBlob = new Blob([txtContent], { type: 'text/plain' })
    const txtUrl = URL.createObjectURL(txtBlob)
    const txtLink = document.createElement('a')
    txtLink.href = txtUrl
    txtLink.download = 'data.csv'
    txtLink.click()
  } else {
    console.log('Error: csvData is empty')
  }
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
