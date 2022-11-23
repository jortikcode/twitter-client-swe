import React from "react";
import WordCloud from "react-d3-cloud";
import { useSelector } from "react-redux";

function Wordcloud() {
    const [wordcloudInfo] = useSelector(state => state.tweets)
    //dati di prova
    /* const data = [
         { text: "Hey", value: 1000 },
         { text: "lol", value: 200 },
         { text: "first impression", value: 1000 },
         { text: "very cool", value: 1000000 },
         { text: "duck", value: 10 },
         { text: "very cool", value: 1000 },
         { text: "very cool", value: 1000 },
         { text: "very cool", value: 1000 },
         { text: "very cool", value: 1000 },
         { text: "very cool", value: 1000 },
         { text: "very cool", value: 1000 },
     ];*/

    const data = wordcloudInfo


    //TODO: cambiare fontsize per adattarla ai valori dei dati ritornati da backend
    const fontSizeMapper = (word) => Math.log2(word.value) * 5;


    return (
        <div style={{ margin: "250px" }}>
            <WordCloud
                data={data}
                fontSizeMapper={fontSizeMapper}
                width={500}
                height={500}
                padding={3}
                font="impact"
            />
        </div>
    )
}


export default Wordcloud