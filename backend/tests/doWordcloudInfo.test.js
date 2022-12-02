/* global describe test expect */
import { doWordcloudInfo } from "../utils/doWordcloudInfo";
import { querySample } from "./testUtils.js";

describe("Test function doWordcloudInfo", () => {
  test("should return an array if the input tweets are provided", () => {
    const output = doWordcloudInfo(querySample.textTweets);
    expect(output[0]).toBeDefined();
  });
  test("should throw an error if the input tweets are not provided", () => {
    expect(doWordcloudInfo).toThrow("Fornire dei tweet per fare la word cloud");
  });
});
