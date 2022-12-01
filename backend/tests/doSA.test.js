/* global describe test expect */
import { doSentiment } from "../utils/doSA.js";
import { querySample } from "./testUtils.js";

describe("Test function doSentiment", () => {
  test("should return two json objects", () => {
    const { tweetSentiment, searchSentiment } = doSentiment(
      querySample.textTweets
    );
    expect(tweetSentiment[0]).toBeDefined();
    expect(searchSentiment.score).toBeDefined();
    expect(searchSentiment.comparative).toBeDefined();
    expect(searchSentiment.positives).toBeDefined();
    expect(searchSentiment.negatives).toBeDefined();
    expect(searchSentiment.neutrals).toBeDefined();
  });
  test("should throw an error if the input tweets are not provided", () => {
    expect(doSentiment).toThrow(
      "Fornire dei tweet su cui fare la sentiment analysis"
    );
  });
});
