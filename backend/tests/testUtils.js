/* Prende in input il numero di giorni da sottrarre
 * Ritorna una stringa di una data in formato ISO*/
export function previusISODate(days) {
  const date = new Date();
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - days);
  return previous.toISOString();
}

/* Un esempio di quello che ritorna una ricerca */
export const querySample = {
  textTweets: [
    {
      text: 'Seriously,  the border is secure, inflation is under control,  gas prices are low again.   Everything is fine.  \nTalk about gaslighting.  Oh, don\'t forget, our "Biden is not senile" after forcing Trump to take the test.    One think your side is king of.   GASLIGHTING https://t.co/FfEVR4njzs',
      lang: "en",
      conversationId: "1598319256189419520",
    },
    {
      text: "Natalia’s first screen test for season 1 of Stranger Things 🥺 https://t.co/XAWkSaZvmw",
      lang: "en",
    },
    {
      text: "ICC should ban test cricket in Pakistan if we produce pitches like this🤦‍♂️\n\n#PAKvENG",
      lang: "en",
    },
    {
      text: "test pickaw • dana 5k\n\n- rt ajj yh\n\nend malem 🍄 \n#zonauang",
      lang: "in",
    },
    {
      text: "@BenDuckett1 Well played Ben, I watched u in your first test....\n\nThere is a day and night difference between 2016/17 and now.\n\nKeep up the good work....",
      lang: "en",
      conversationId: "1598311205705244672",
    },
    {
      text: "Client in Berlin is looking for a Quality Assurance Test Management expert - #remoteworking\n\n5+years in #QA - #QualityAssurance / #testing\n\n6-month project: https://t.co/l1HXjnhrwN",
      lang: "en",
      conversationId: "1598319254398328832",
    },
    {
      text: "Prepare for Closed Beta Test #2 for #StreetFighter6 from December 16-19 on PS5, Xbox Series X|S, and Steam!\n\n👤 8 Characters\n🌐 Online Matches\n🕹️ Crossplay\n🔌 Input Delay Reduction Feature\n...and some tweaks!\n\nDetails - https://t.co/TXHWSxCKrz https://t.co/9zRseTDmdM",
      lang: "en",
    },
    {
      text: "@noorisahag i heard they test things on rats u should test it on urself&lt;3",
      lang: "en",
      conversationId: "1596958016364216320",
    },
    {
      text: "@mehtanishit21 @markminervini This pattern don't fullfil many criteria's of VCP pattern, it's just a test.",
      lang: "en",
      conversationId: "1598285985259089920",
    },
    {
      text: "if you're worried about failing a drug test just study really hard and believe in urself",
      lang: "en",
      conversationId: "1598319251068182531",
    },
  ],
  creationDates: [
    "2022-12-01T14:13:00.000Z",
    "2022-12-01T14:13:00.000Z",
    "2022-12-01T14:13:00.000Z",
    "2022-12-01T14:13:00.000Z",
    "2022-12-01T14:13:00.000Z",
    "2022-12-01T14:13:00.000Z",
    "2022-12-01T14:13:00.000Z",
    "2022-12-01T14:12:59.000Z",
    "2022-12-01T14:12:59.000Z",
    "2022-12-01T14:12:59.000Z",
  ],
  users: [
    {
      name: "AmericaFirst",
      username: "America54657023",
      id: "1275903589651791872",
      pfpUrl:
        "https://pbs.twimg.com/profile_images/1275908612930580482/SNyiHLmE_normal.jpg",
    },
    {
      name: "ash | 51 Days 🎸",
      username: "wheelerstrange",
      id: "1146465233428537344",
      pfpUrl:
        "https://pbs.twimg.com/profile_images/1587956388587663360/qbwQ4-7m_normal.png",
    },
    {
      name: "Prabhat Shekhar 🇮🇳",
      username: "imPrabhatS",
      id: "2779274000",
      pfpUrl:
        "https://pbs.twimg.com/profile_images/1598215100879339520/ee_Td4pt_normal.jpg",
    },
    {
      name: "Mahchan",
      username: "Mahchan64674571",
      id: "1591297059575197697",
      pfpUrl:
        "https://pbs.twimg.com/profile_images/1591297609695916040/EwrM7qEh_normal.jpg",
    },
    {
      name: "Prakash Mahtani",
      username: "PrakashMahtani1",
      id: "1468889029",
      pfpUrl:
        "https://pbs.twimg.com/profile_images/3730309288/7dd6de4d434c575b6a9cd2fdb9238870_normal.jpeg",
    },
    {
      name: "freelancermap.com",
      username: "freelancer_INT",
      id: "1251675529",
      pfpUrl:
        "https://pbs.twimg.com/profile_images/1575389071928709120/_geP_SYK_normal.jpg",
    },
    {
      name: "Lory",
      username: "_Lory_",
      id: "20462439",
      pfpUrl:
        "https://pbs.twimg.com/profile_images/1021952572347895808/tj1xOagq_normal.jpg",
    },
    {
      name: "sni",
      username: "evernauring",
      id: "1507775375450914817",
      pfpUrl:
        "https://pbs.twimg.com/profile_images/1580967548375674888/zADOwJlR_normal.jpg",
    },
    {
      name: "TheBull",
      username: "paintingcharts",
      id: "946786775657095168",
      pfpUrl:
        "https://pbs.twimg.com/profile_images/1465635513382027267/DcdBd5gO_normal.jpg",
    },
    {
      name: "d",
      username: "prisonhusband",
      id: "1205902866336157703",
      pfpUrl:
        "https://pbs.twimg.com/profile_images/1597964903054180355/iqQZaQ7I_normal.jpg",
    },
  ],
  types: [
    "QUOTED",
    "RETWEET",
    "RETWEET",
    "RETWEET",
    "REPLYTO",
    "TWEET",
    "RETWEET",
    "REPLYTO",
    "REPLYTO",
    "TWEET",
  ],
  places: [],
  sentimentAnalysis: [
    {
      score: 5,
      comparative: 5.11,
      sentiment: "POSITIVE_SENTIMENT",
      positiveWords: ["secure", "fine", "forget"],
      negativeWords: [],
    },
    {
      score: 0,
      comparative: 0,
      sentiment: "NEUTRAL_SENTIMENT",
      positiveWords: [],
      negativeWords: [],
    },
    {
      score: 0,
      comparative: 0,
      sentiment: "NEUTRAL_SENTIMENT",
      positiveWords: ["like"],
      negativeWords: ["ban"],
    },
    {
      score: 0,
      comparative: 0,
      sentiment: "NEUTRAL_SENTIMENT",
      positiveWords: [],
      negativeWords: [],
    },
    {
      score: 3,
      comparative: 3.11,
      sentiment: "POSITIVE_SENTIMENT",
      positiveWords: ["good"],
      negativeWords: [],
    },
    {
      score: 2,
      comparative: 2.08,
      sentiment: "POSITIVE_SENTIMENT",
      positiveWords: ["quality"],
      negativeWords: [],
    },
    {
      score: 3,
      comparative: -1.68,
      sentiment: "POSITIVE_SENTIMENT",
      positiveWords: ["👤", "🌐"],
      negativeWords: ["steal", "🔌", "delay"],
    },
    {
      score: 0,
      comparative: 0,
      sentiment: "NEUTRAL_SENTIMENT",
      positiveWords: [],
      negativeWords: [],
    },
    {
      score: 0,
      comparative: 0,
      sentiment: "NEUTRAL_SENTIMENT",
      positiveWords: [],
      negativeWords: [],
    },
    {
      score: -6,
      comparative: -6.38,
      sentiment: "NEGATIVE_SENTIMENT",
      positiveWords: [],
      negativeWords: ["worried", "failing", "hard"],
    },
  ],
  searchSentimentAnalysis: {
    score: 0.7,
    comparative: 0.22400000000000012,
    positives: 8,
    negatives: 7,
    neutrals: 148,
  },
  wordcloudInfo: [
    { text: "test", value: 11 },
    { text: "gaslighting", value: 2 },
    { text: "things", value: 2 },
    { text: "pattern", value: 2 },
    { text: "border", value: 1 },
    { text: "secure", value: 1 },
    { text: "inflation", value: 1 },
    { text: "control", value: 1 },
    { text: "gas", value: 1 },
    { text: "prices", value: 1 },
    { text: "low", value: 1 },
    { text: "fine", value: 1 },
    { text: "talk", value: 1 },
    { text: "forget", value: 1 },
    { text: "biden", value: 1 },
    { text: "senile", value: 1 },
    { text: "forcing", value: 1 },
    { text: "trump", value: 1 },
    { text: "side", value: 1 },
    { text: "king", value: 1 },
    { text: "https://t.co/FfEVR4njzs", value: 1 },
    { text: "natalias", value: 1 },
    { text: "screen", value: 1 },
    { text: "season", value: 1 },
    { text: "stranger", value: 1 },
    { text: "🥺", value: 1 },
    { text: "https://t.co/XAWkSaZvmw", value: 1 },
    { text: "icc", value: 1 },
    { text: "ban", value: 1 },
    { text: "cricket", value: 1 },
    { text: "pakistan", value: 1 },
    { text: "produce", value: 1 },
    { text: "pitches", value: 1 },
    { text: "this🤦‍♂️", value: 1 },
    { text: "#pakveng", value: 1 },
    { text: "pickaw", value: 1 },
    { text: "dana", value: 1 },
    { text: "5k", value: 1 },
    { text: "rt", value: 1 },
    { text: "ajj", value: 1 },
  ],
  nextToken: "b26v89c19zqg8o3fpzhml1tdle0p96ifzl58km7b4ng59",
};
