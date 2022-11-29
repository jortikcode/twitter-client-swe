import { rwClient } from "./twitterClient.js";

/* funzione per far rispettare la struttura di un tweet */
const createMsg = (text) => {
  const msg = {
    text: text,
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
export const chessTweet = async (username = "anonimo") => {
  try {
    const tweetText = createMsg(
      `Partita iniziata da ${username}, se vuoi sfidarlo rispondi a questo tweet con la mossa che vuoi fare, sarà fatta la mossa scelta di più`
    );
    const { data: createdTweet } = await rwClient.v2.tweet(tweetText);
    return createdTweet.id;
  } catch (error) {
    console.log(error);
  }
};

/* Probabilmente : in_reply_to_tweet_id:{id-del-tweet-fatto-in-precedenza} */
/* tweet-specifico-generato-da-me forse: conversation_id:{id-del-tweet-fatto-in-precedenza} is:reply */
