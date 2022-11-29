const maxWordsPerWordcloud = 40;

export const joinWordcloudInfo = (info1, info2) => {
    const wordcloudInfo = new Map();
    info1.forEach(element => wordcloudInfo.set(element.text, element));
    info2.forEach(element => {
        const existingValue = wordcloudInfo.get(element.text)?.value;
        if (existingValue)
            wordcloudInfo.set(element.text,{
                ...element,
                value: existingValue + element.value
            });
        else
            wordcloudInfo.set(element.text, element);
    });
    const newInfos = [...wordcloudInfo.values()].sort((a,b) => b.value - a.value).slice(0, maxWordsPerWordcloud);
    return newInfos || [];
}

export const joinSearchSentimentAnalysis = (sent1, sent2) => {
    if (JSON.stringify(sent1) === JSON.stringify({}))
        return sent2;
    return ({
        score: sent1.score + sent2.score,
        comparative: sent1.comparative + sent2.comparative,
        positives: sent1.positives + sent2.positives,
        negatives: sent1.negatives + sent2.negatives,
        neutrals: sent1.neutrals + sent2.neutrals
    })
}