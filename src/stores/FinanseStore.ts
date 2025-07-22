import { defineStore } from 'pinia'
import type { Finanse, HistoriaRachunku } from '@/models/EstateCare/DajDrzewoFinHistoria.ts'
import ApiUrlsService from './ApiUrlsService'
import type { DocumentSzczegoly, Pozycja } from '@/models/EstateCare/DajDokSzczegoly'
import type { ChartData } from '@/models/Charts'
import axios from 'axios'
import dayjs from 'dayjs'

export interface MyFinanseStoreState {
  kontaFinansowe: string[]
  historiaRachunku?: Partial<HistoriaRachunku>
  finanse: Finanse[]
  dokumenty: DocumentSzczegoly[]
  loading: boolean
  error: unknown
  chartData: ChartData
  csvData: string[]
}

export const useFinanseStore = defineStore('myFinanse', {
  state: () =>
    ({
      kontaFinansowe: [],
      historiaRachunku: {},
      finanse: [],
      dokumenty: [],
      loading: false,
      error: null,
      chartData: {
        type: 'line',
        labels: [],
        datasets: [],
      },
      csvData: [],
    }) as MyFinanseStoreState,
  getters: {
    // getters
    getKontaFinansowe: (state) => state.kontaFinansowe,
    getDokumenty: (state) => state.dokumenty,
    getFinanse: (state) => state.finanse,
    getHistoriaRachunku: (state) => state.historiaRachunku,
    getCsvData: (state) => state.csvData,

    getLogSzczegolyOplatCsv: (state) => {
      return (
        finanseZaMiesiac: Finanse,
        dokumentZListaOplat: DocumentSzczegoly,
        szczegoly: Pozycja,
      ) => {
        const csvDataEntry =
          `miesiac;${dayjs(finanseZaMiesiac.McStanu ?? '-').format('YYYY-MM-DD')};` +
          `dokumentIdent;${dokumentZListaOplat.Ident ?? '-'};` +
          `sumaOplatZaMiesiac;${dokumentZListaOplat.Kwota ?? '-'};` +
          `oplata;${szczegoly.SkladnikOpl ?? '-'};` +
          `kwotaBrutto;${szczegoly.Brutto ?? '-'}`.replace(/\s+/g, '_')
        console.log(csvDataEntry)
        state.csvData.push(csvDataEntry)
      }
    },
  },

  actions: {
    async loadKontaFinansowe(): Promise<string[]> {
      this.loading = true
      this.error = null
      const kontaFinansowe: string[] = []
      try {
        const url = 'https://rozliczenia.estatecare.pl/content/InetObsKontr/finanse'
        if (!window.location.href.includes(url)) {
          await window.open(url, 'self')
        }
        const elements = document.querySelectorAll('.app-konto-finansowe')
        elements.forEach((element) => {
          const adresDoRachunkuFinansowego = element.getAttribute('href') || ''
          const regex = /\/content\/InetObsKontr\/finanse\/(\d+)/
          const match = adresDoRachunkuFinansowego.match(regex)
          if (match) {
            kontaFinansowe.push(match[1])
          }
        })
        kontaFinansowe.sort((a, b) => b.localeCompare(a))
        console.log('Znaleziono konta finansowe:', kontaFinansowe.toString())
        return kontaFinansowe
      } catch (error: unknown) {
        console.error('Failed to loadDokument:', error)
        this.error = error || 'Unknown error'
        return []
      } finally {
        this.loading = false
      }
    },
    async loadHistoriaRachunku(numerRachunku: string) {
      this.loading = true
      this.error = null
      try {
        const POMSessionId = localStorage.getItem('POMSessionId')
        const at = localStorage.getItem('at')
        const historiaRachunkuUrl = ApiUrlsService.getFinanseUrl(numerRachunku)
        console.log('Loading historia rachunku from: ', historiaRachunkuUrl)
        const response = await axios.get(historiaRachunkuUrl, {
          headers: {
            Cookie: `POMSessionId=${POMSessionId}; at=${at}`,
          },
        })
        this.finanse = response.data.data.Finanse
        return this.finanse ?? []
      } catch (error: unknown) {
        console.error('Failed to load historia rachunku:', error)
        this.error = error || 'Unknown error'
        this.finanse = []
        return []
      } finally {
        this.loading = false
      }
    },
    async loadDokument(ident: string): Promise<DocumentSzczegoly | null> {
      this.loading = true
      this.error = null
      try {
        const POMSessionId = localStorage.getItem('POMSessionId')
        const at = localStorage.getItem('at')
        const loadDokumentURL = ApiUrlsService.getDokumentyUrl(ident)

        const response = await axios.get(loadDokumentURL, {
          headers: {
            Cookie: `POMSessionId=${POMSessionId}; at=${at}`,
          },
        })
        this.dokumenty = response.data.data
        const dokumentZListaOplat = response.data.data
        // console.log(
        //   'Opis dokumentu z opłatami :',
        //   dokumentZListaOplat?.Ident,
        //   dokumentZListaOplat?.Opis,
        // )
        return dokumentZListaOplat
      } catch (error: unknown) {
        console.error('Failed to loadDokument:', error)
        this.error = error || 'Unknown error'
        this.finanse = []
        return null
      } finally {
        this.loading = false
      }
    },

    saveChartDate(chartData: ChartData) {
      this.chartData = chartData
    },
    openStronaZFinansami() {
      const link = 'https://rozliczenia.estatecare.pl/content/InetObsKontr/finanse'
      // this.$router.push({ path: link })
    },
  },
})
