<template>
  <div class="chart-composite">
    <h3>Chart</h3>
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
} from 'chart.js'

defineProps<{
  title?: string
  chartData: ChartData
  data?: unknown
}>()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartOptions = {
  responsive: true,
  title: {
    display: true,
    text: 'Chart Title',
  },
  legend: {
    display: true,
    position: 'bottom',
  },
  tooltips: {
    enabled: true,
  },
}
</script>

<style scoped></style>
