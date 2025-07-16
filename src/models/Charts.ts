export interface ChartData {
  type: string
  labels: string[]
  datasets: Dataset[]
}

export interface Dataset {
  label: string
  data: number[]
  backgroundColor: string
  borderColor: string
  borderWidth: number
}
