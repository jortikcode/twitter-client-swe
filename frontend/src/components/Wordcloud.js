import React from "react";
import WordCloud from "react-d3-cloud";
import { useSelector } from "react-redux";


function Wordcloud({ title }) {
    const { wordcloudInfo } = useSelector(state => state.tweets)

    // Fattore di scala per il valore delle parole da passare alla wordcloud
    const WORDCLOUD_SCALE_FACTOR = 300;

    // Copia dell'array delle informazioni per la wordcloud 
    let wordcloudInfoCopy = JSON.parse(JSON.stringify(wordcloudInfo));
    // Riscaliamo i valori dell'array delle info
    wordcloudInfoCopy = wordcloudInfoCopy.map(singleWordInfo => {
    singleWordInfo.value *= WORDCLOUD_SCALE_FACTOR;
    return singleWordInfo;
    })

    const fontSizeMapper = (word) => Math.log2(word.value) * 5;
    return (
        <div className="w-80 md:w-[32rem]">
            <span className="font-bold dark:text-white text-lg">
                {title}
            </span>
            <WordCloud
                data={wordcloudInfoCopy}
                fontSizeMapper={fontSizeMapper}
                spiral="archimedean"
                padding={3}
                fontWeight="bold"
                font="impact"
            />
        </div>
    )
}


export default Wordcloud