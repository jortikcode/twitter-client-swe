import React, { useState } from 'react'
import Chart from "react-apexcharts"
import { useSelector } from 'react-redux'

export const BARCHART_VARIANTS = {
    MINUTES: 'Count by minutes',
    DAYS: 'Count by days',
}


function makeTimeString(date) {
    let hours = `${date.getHours()}`
    if (hours.length < 2) {
        hours = `0${hours}`
    }
    let minutes = `${date.getMinutes()}`
    if (minutes.length < 2) {
        minutes = `0${minutes}`
    }
    return `${hours}:${minutes}`
}

function preprocessDates(creationDates, byMinute = false) {
    const dateAmounts = {}
    const creationDatesCopy = [...creationDates]
    creationDatesCopy.sort()

    for (const date of creationDatesCopy) {
        const dateObj = new Date(date)
        const dateTime = makeTimeString(dateObj)
        let dateLabel = `${dateObj.getDate()}/${1 + dateObj.getMonth()}/${dateObj.getFullYear()}`
        if (byMinute) {
            dateLabel += ` ${dateTime}`
        }
        if (!(dateLabel in dateAmounts)) {
            dateAmounts[dateLabel] = 0;
        }
        dateAmounts[dateLabel] += 1;
    }
    console.log(dateAmounts)

    return dateAmounts
}

function BarChart({creationDates, title, variant = BARCHART_VARIANTS.DEFAULT}) {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState(BARCHART_VARIANTS.DAYS)
    const { darkMode } = useSelector(state => state.theme)

    const processedDates = preprocessDates(creationDates, mode === BARCHART_VARIANTS.MINUTES);
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
            <span className="font-bold dark:text-white text-lg">
                {title}
            </span>
            <Chart
                options={options}
                series={series}
                type="bar"
            />

            <div className="w-72 font-medium">
                <div
                    onClick={() => setOpen(!open)}
                    className={`bg-white w-full p-2 flex items-center justify-between rounded`}
                >
                    Unità di tempo
                    {open? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    )}
                </div>
                <ul
                    className={
                        `bg-white mt-2 overflow-y-auto 
                        ${open ? "max-h-60" : "max-h-0"}`
                    }
                >
                    {Object.values(BARCHART_VARIANTS).map((variant) => (
                        <li
                            key={variant}
                            className={
                                `p-2 text-sm hover:bg-sky-600 hover:text-white
                                ${mode === variant && "bg-sky-600 text-white"}`
                            }
                            onClick={() => {
                                setMode(variant)
                            }}
                        >
                            {variant}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default BarChart;