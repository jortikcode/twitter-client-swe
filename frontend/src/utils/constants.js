/* Costanti per redux */
export const TWEET = "TWEET";
export const REPLY = "REPLYTO";
export const RETWEET = "RETWEET";
export const QUOTED = "QUOTED";
export const NOTYPE = "NOTYPE";

/* Sentimenti dei tweet */
export const POSITIVE_SENTIMENT = "POSITIVE_SENTIMENT";
export const NEGATIVE_SENTIMENT = "NEGATIVE_SENTIMENT";
export const NEUTRAL_SENTIMENT = "NEUTRAL_SENTIMENT";
export const NO_SENTIMENT = "NO_SENTIMENT";

/* Costanti per le date */
// Millisecondi di una settimana: 6 * 24 * 60 * 60 * 1000
export const ONE_WEEK_MILLISECONDS = 6 * 24 * 60 * 60 * 1000;
// Millisecondi di un giorno: 24 * 60 * 60 * 1000
export const ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
// Millisecondi di un'ora
export const ONE_HOUR_MILLISECONDS = 60 * 60 * 1000;