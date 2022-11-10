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
    series: series,
    options: {
      chart: {
        width: 350,
        type: 'pie',
        foreColor: '#000'
      },
      colors: ['#F80000', '#B9B6B6', '#40E802'],
      labels: ['Negativo', 'Neutro', 'Positivo'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          
          },
          legend: {
            position: 'bottom'
          },
        }
      }]
    }
  };
  return (
    <div className="chart">
      <ReactApexChart options={options} series={series} type="pie" />
    </div>
  );
}
  
export default PieChart
