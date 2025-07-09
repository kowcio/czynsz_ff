import { defineStore } from 'pinia'
import type { Cost } from '../models/Cost.ts'

export interface MyStoreState {
  counter: number
  name: string
  items: Cost[]
}

export const useMyStore = defineStore('myStore', {
  state: () =>
    ({
      // initial state
      counter: 0,
      name: 'John Doe',
      items: [] as Cost[],
    }) as MyStoreState,
  getters: {
    // getters
    doubleCounter: (state) => state.counter * 2,
    getItemById: (state) => (name: string) => state.items.find((item: Cost) => item.name === name),
  },
  actions: {
    // actions
    increment() {
      this.counter++
    },
    decrement() {
      this.counter--
    },
    addItem(item: Cost) {
      this.items.push(item)
    },
    removeItem(name: string) {
      this.items = this.items.filter((item: Cost) => item.name !== name)
    },
  },
})
