<template>
  <div class="chart-composite">
    <h3>Chart</h3>
    <Line id="my-chart-id" :options="chartOptions" :data="props.chartData" />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  type ChartData,
} from 'chart.js'

const props = withDefaults(
  defineProps<{
    title?: string
    width?: string
    chartData?: ChartData<'line', number[], string>
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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
)

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
    text: 'Chart 333 Title',
  },
  legend: {
    display: true,
    position: 'left',
  },
  tooltips: {
    enabled: true,
  },
}
</script>

<style scoped></style>
