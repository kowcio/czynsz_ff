<template>
  <div class="chart-composite">
    <h3>Chart</h3>
    <Bar id="my-chart-id" :options="chartOptions" :data="props.chartData" />
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
import { reactive } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    width?: string
    chartData?: ChartData<'bar', number[], string>
  }>(),
  {
    title: '',
    width: '1200px',
    chartData: () => ({
      type: 'line',
      labels: [],
      datasets: [],
    }),
  },
)

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartOptions = {
  responsive: true,
  reactive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      borderWidth: 1,
    },
  },
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

<style scoped>
.chart-width {
  width: var(--width);
}
</style>
