import { defineStore } from 'pinia'
import type { Finanse, HistoriaRachunku } from '@/models/EstateCare/DajDrzewoFinHistoria.ts'
import ApiUrlsService from './ApiUrlsService'
import type { DocumentSzczegoly } from '@/models/EstateCare/DajDokSzczegoly'
import type { ChartData } from '@/models/Charts'
import axios from 'axios'

export interface MyFinanseStoreState {
  kontaFinansowe: string[]
  historiaRachunku?: Partial<HistoriaRachunku>
  finanse: Finanse[]
  dokumenty: DocumentSzczegoly[]
  loading: boolean
  error: unknown
  chartData: ChartData
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
    }) as MyFinanseStoreState,
  getters: {
    // getters
    getKontaFinansowe: (state) => state.kontaFinansowe,
    getDokumenty: (state) => state.dokumenty,
    getFinanse: (state) => state.finanse,
    getHistoriaRachunku: (state) => state.historiaRachunku,
  },

  actions: {
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
        return response.data.data
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
