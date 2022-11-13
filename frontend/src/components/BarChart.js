import React from 'react'
import Chart from "react-apexcharts"

function preprocessDates(creationDates) {
    const dateAmounts = {}
    creationDates.sort()

    for (const date of creationDates) {
        const dateObj = new Date(date)
        const dateLabel = 
            `${dateObj.getDate()}/${1 + dateObj.getMonth()}/${dateObj.getFullYear()}`
            + ` ${dateObj.getHours()}:00`
        if (!(dateLabel in dateAmounts)) {
            dateAmounts[dateLabel] = 0;
        }
        dateAmounts[dateLabel] += 1;
    }

    return dateAmounts
}

function BarChart({creationDates}) {
    const processedDates = preprocessDates(creationDates)
    const options = {
        xaxis: {
            categories: Object.keys(processedDates)
        },
        stroke: {
            curve: 'smooth',
        },
        markers: {
            size: 5,
        }
    }
    const series = [{
        data: Object.values(processedDates)
    }]

    return (
        <Chart
            options={options}
            series={series}
            type="line"
        />
    )
}

export default BarChart;