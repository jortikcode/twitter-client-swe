import React from 'react'
import ReactApexChart from 'react-apexcharts'

class PieChart extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: this.props.sentAnalysis,
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
        },
      
      
      };
    }

  

    render() {
      return (
        

  <div className="chart">
<ReactApexChart options={this.state.options} series={this.state.series} type="pie" width={580} />
</div>
      );
    }
  }

  
export default PieChart
