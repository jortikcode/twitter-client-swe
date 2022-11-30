import { rwClient } from "./twitterClient.js";

/* funzione per far rispettare la struttura di un tweet */
const createMsg = (text, validMoves) => {
  const msg = {
    text: text,

    poll: {
      options: validMoves,
      duration_minutes: 1,
    },
  };
  return msg;
};

/*
 * 1. verifico se c'è una regola libera
 * 2. genero un id della partita
 * 3. creo una regola con l'id della partita
 * 4. faccio il post su twitter con l'username di chi ha proposto la sfida
 */

/* funzione per iniziare una partita a scacchi */
export const chessTweet = async (username, gameAscii, validMoves) => {
  try {
    const tweetText = createMsg(
      `${gameAscii}\nPartita iniziata da ${username}, se vuoi sfidarlo vota la prossima mossa:`,
      validMoves
    );
    const { data: createdTweet } = await rwClient.v2.tweet(tweetText);
    return createdTweet.id;
  } catch (error) {
    console.log(error);
  }
};

export const nextMove = async (tweetID) => {
  const tweet = await rwClient.v2.singleTweet(tweetID, {
    "poll.fields": ["voting_status"],
  });
  console.log(JSON.stringify(tweet));
};

/* Probabilmente : in_reply_to_tweet_id:{id-del-tweet-fatto-in-precedenza} */
/* tweet-specifico-generato-da-me forse: conversation_id:{id-del-tweet-fatto-in-precedenza} is:reply */
