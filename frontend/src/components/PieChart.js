import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useSelector } from 'react-redux';
import { NEGATIVE_SENTIMENT, 
         NEUTRAL_SENTIMENT, 
         POSITIVE_SENTIMENT,
         NO_SENTIMENT } from '../utils/constants'
import TweetList from './TweetList'

const getSelectedSentiment = (label) => {
  switch (label){
    case "Positivi":
      return POSITIVE_SENTIMENT;
    case "Negativi":
      return NEGATIVE_SENTIMENT;
    case "Neutri":
      return NEUTRAL_SENTIMENT;
    default:
      return "error";
  }
}

const sentimentsArrayCalculator = (sentAnalysis) => {
  let sentArray = [0, 0, 0]
  for (let x of sentAnalysis)
    if (x.sentiment === NEGATIVE_SENTIMENT)
      sentArray[0] += 1;
    else if (x.sentiment === POSITIVE_SENTIMENT)
      sentArray[1] += 1;
    else if (x.sentiment === NEUTRAL_SENTIMENT)
      sentArray[2] += 1;
  return sentArray
}

const PieChart = (props) => {
  const [ selectedSentiment, setSelectedSentiment ] = useState(NO_SENTIMENT);
  const { textTweets,
          types,
          creationDates,
          users,
          places } = useSelector(state => state.tweets);
  let selectedTweets = {};
  let selectedIndexes = [];
  
  if (props.sentAnalysis && (selectedSentiment !== NO_SENTIMENT)){
    // Array che contiene soltanto i tweet che hanno sentimento uguale a quello selezionato
    selectedTweets.sentiments = textTweets.flatMap((tweet, index) => {
      if (props.sentAnalysis[index].sentiment === selectedSentiment && selectedSentiment !== NO_SENTIMENT){
        selectedIndexes.push(index);
        return [{
          ...props.sentAnalysis[index]
        }];
      }else 
        return [];
    });
    selectedTweets.textTweets = selectedIndexes.map(index => textTweets[index]);
    selectedTweets.creationDates = selectedIndexes.map(index => creationDates[index]);
    selectedTweets.types = selectedIndexes.map(index => types[index]);
    selectedTweets.users = selectedIndexes.map(index => users[index]);
    selectedTweets.places = selectedIndexes.flatMap(index => {
      if (places.length > 0 && places[index])
        return places[index]
      return [];
    });
  }

  const series = props.sentiments || sentimentsArrayCalculator(props.sentAnalysis);
  const options = {
    chart: {
      width: "100%",
      type: 'pie',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          selectedTweets = {};
          selectedIndexes = [];
          if (selectedSentiment !== NO_SENTIMENT){
            setSelectedSentiment(NO_SENTIMENT);
          }else{  
            setSelectedSentiment(getSelectedSentiment(config.w.config.labels[config.dataPointIndex]));
          }
        }
      }
    },
    labels: ['Negativi', 'Positivi', 'Neutri'],
    legend: {
      labels: {
        useSeriesColors: true
      }
    },
    colors: ["#ff7373", "#bada55", "#333333"],
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
    <>
      <div className="w-80 md:w-[32rem] dark:border-r-indigo-50">
        <span className="font-bold dark:text-white text-lg">
          {props.title}
        </span>
        <ReactApexChart 
        options={options} 
        series={series} 
        type="pie" 
        className="rounded-lg p-3" />
      </div>
      <div className="flex w-full flex-col dark:bg-gray-900 items-center gap-y-8 mb-3">
        {selectedTweets.textTweets?.length > 0 && (
            <TweetList 
            sentiments={selectedTweets.sentiments}
            textTweets={selectedTweets.textTweets}
            creationDates={selectedTweets.creationDates}
            types={selectedTweets.types}
            users={selectedTweets.users}
            places={selectedTweets.places}
            /> )}
      </div>
    </>
  );
  }
  
export default PieChart
