import React from 'react'
import Chart from "react-apexcharts"
import { useSelector } from 'react-redux'

function preprocessDates(creationDates) {
    const dateAmounts = {}
    const creationDatesCopy = [...creationDates]
    creationDatesCopy.sort()

    for (const date of creationDatesCopy) {
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
    const { darkMode } = useSelector(state => state.theme)

    const processedDates = preprocessDates(creationDates);
    const series = [{
        name: "Tweets",
        data: Object.values(processedDates)
    }]
    const options = {
        xaxis: {
            categories: Object.keys(processedDates),
            labels: {
                style: {
                    colors: darkMode ? 'white' : undefined
                }
            }
        },
        stroke: {
            curve: 'smooth',
        },
        markers: {
            size: 5,
        },
        labels: series
    }
    

    return (
    <div className="w-80 md:w-[32rem]">
        <Chart
            options={options}
            series={series}
            type="bar"
        />
    </div>
    )
}

export default BarChart;