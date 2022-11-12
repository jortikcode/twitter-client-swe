import React from 'react'
import ReactApexChart from 'react-apexcharts'

const PieChart = (props) => {
  const sentimentsArrayCalculator = () => {
    let sentArray = [0, 0, 0]
    for (let x of props.sentAnalysis) {

      if (x.score < 0)
        sentArray[0] = sentArray[0] + 1
      else if (x.score == 0)
        sentArray[1] = sentArray[1] + 1
      else if (x.score > 0)
        sentArray[2] = sentArray[2] + 1
    }
    return sentArray
  }
  const series = sentimentsArrayCalculator();
  const options = {
    chart: {
      width: "100%",
      type: 'pie',
    },
    labels: ['Negativi', 'Positivi', 'Neutri'],
    legend: {
      labels: {
        useSeriesColors: true
      }
    },
    colors: ["#ff7373", "#bada55", "#f0f8ff"],
    responsive: [{
      breakpoint: 768,
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
  
  return (
    <div className="w-80 md:w-[32rem] dark:border-r-indigo-50 dark:border-8">
      <ReactApexChart options={options} series={series} type="pie" className="bg-gray-900 rounded-lg p-3" />
    </div>
  );
  }
  
export default PieChart
