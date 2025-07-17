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

const props = withDefaults(
  defineProps<{
    title?: string
    chartData?: ChartData<'bar', number[], string>
  }>(),
  {
    title: '',
    chartData: () => ({
      type: 'bar',
      labels: [],
      datasets: [],
    }),
  },
)

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
