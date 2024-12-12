import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";
import { TrafficData } from "./types/trafficDataTypes";
import { $ } from "./utils";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Legend,
  Tooltip,
  Filler
);

export class ChartManager {
  private chartInstance: Chart | null = null;

  createChart(trafficData: TrafficData[]) {
    const chartCanvasEl = $(".chart-canvas") as HTMLCanvasElement;
    const labels = trafficData.map((data) => data.date);
    const viewsData = trafficData.map((data) => data.views);
    const uniqueVisitorsData = trafficData.map((data) => data.unique_visitors);
    const ctx = chartCanvasEl.getContext("2d") as CanvasRenderingContext2D;

    if (this.chartInstance) {
      this.destroyChart();
    }

    // 동적 너비 설정
    chartCanvasEl.width = trafficData.length * 25;

    this.chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Views",
            data: viewsData,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            tension: 0.4,
          },
          {
            label: "Unique Visitors",
            data: uniqueVisitorsData,
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: true,
            position: "top",
            align: "start",
            labels: {
              font: { family: "Inter sans-serif" },
              boxWidth: 20,
              padding: 10,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: false,
              text: "Date",
              align: "start",
              font: { family: "Inter sans-serif" },
            },
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 20,
              padding: 5,
            },
          },
          y: {
            title: {
              display: false,
              text: "Count",
              font: { family: "Inter sans-serif" },
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  destroyChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }
}
