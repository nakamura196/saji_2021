<!-- Template Tag can not be merged... -->

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
// import Chart from 'chart.js'
import VueChart from 'vue-chartjs'
// 棒グラフの場合は、Barを使う
// eslint-disable-next-line
const Bar = VueChart.Bar

@Component
// mixinsもBarに変更
export default class ChartLine extends mixins(Bar) {
  @Prop({ default: [] }) labels!: any[]

  @Prop({ default: [] }) datasets!: any[]

  @Watch('datasets', { deep: true })
  watchTmp() {
    this.main()
  }

  mounted() {
    this.main()
  }

  main() {
    const labels: string[] = this.labels
    const datasets: number[] = this.datasets

    const chartData: any = {
      labels,
      datasets,
    }

    const chartOption: any = {
      // アスペクト比を固定しないように変更
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        ],
      },
    }

    this.renderChart(chartData, chartOption)
  }
}
</script>
