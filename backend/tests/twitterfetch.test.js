/* global describe test expect */
import { app } from "../index.js";
import request from "supertest";
import { oneWeekTimestamp } from "../utils/constants.js";
import { previusISODate } from "./testUtils.js";

describe("GET /api/search", () => {
  describe("given a query", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).get("/api/search?query=test");
      expect(response.statusCode).toBe(200);
    });
    test("should respond with a json object containing textTweets, creationDates, users, types, places, sentimentAnalysis", async () => {
      const response = await request(app).get("/api/search?query=test");
      expect(response.body.textTweets).toBeDefined();
      expect(response.body.creationDates).toBeDefined();
      expect(response.body.users).toBeDefined();
      expect(response.body.types).toBeDefined();
      expect(response.body.places).toBeDefined();
      expect(response.body.sentimentAnalysis).toBeDefined();
    });
    test("should respond a json object with ten elements without a max parameter", async () => {
      const response = await request(app).get("/api/search?query=test");
      expect(response.body.textTweets.length).toBeLessThanOrEqual(10);
    });
    test("should respond with json object with up to max_results element when max_results is set", async () => {
      const max_results = 11;
      const response = await request(app).get(
        `/api/search?query=test&max_results=${max_results}`
      );
      expect(response.body.textTweets.length).toBeLessThanOrEqual(max_results);
    });
    test("should support search with a valid start time", async () => {
      const response = await request(app).get(
        `/api/search?query=test&start_time=${previusISODate(2)}`
      );
      expect(response.statusCode).toBe(200);
    });
    test("should support search with a valid end time", async () => {
      const response = await request(app).get(
        `/api/search?query=test&end_time=${previusISODate(2)}`
      );
      expect(response.statusCode).toBe(200);
    });
    test("should support search with a valid start time and end time", async () => {
      const response = await request(app).get(
        `/api/search?query=test&start_time=${previusISODate(
          4
        )}&end_time=${previusISODate(2)}`
      );
      expect(response.statusCode).toBe(200);
    });

    test("should support search by hashtag", async () => {
      const response = await request(app).get(`/api/search?query=%23newyork`);
      expect(response.status).toBe(200);
    });
    test("should support search by quotation of user", async () => {
      const response = await request(app).get(`/api/search?query=%40elonmusk`);
      expect(response.status).toBe(200);
    });
    test("should respond with json object of tweets in the last week", async () => {
      const response = await request(app).get(`/api/search?query=%40elonmusk`);
      const now = Date.now();
      const oneWeekAgo = now - oneWeekTimestamp;
      // Per ogni data che si trova in creationDates, bisogna verificare che si trovi nell'arco dell'ultima settimana
      for (const date of response.body.creationDates) {
        const dateTimestamp = new Date(date).getTime();
        expect(dateTimestamp).toBeLessThanOrEqual(now);
        expect(dateTimestamp).toBeGreaterThanOrEqual(oneWeekAgo);
      }
    });
  });

  describe("without a query param", () => {
    test("should respond with a 400 status code", async () => {
      const response = await request(app).get("/api/search");
      expect(response.statusCode).toBe(400);
    });
    test("should respond with a json object containg error", async () => {
      const response = await request(app).get("/api/search?query=test");
      expect(response.error).toBeDefined();
    });
  });
  describe("with a wrong start_time param", () => {
    test("should respond with a 400 status code", async () => {
      const response = await request(app).get(
        "/api/search?query=test&start_time=foo"
      );
      expect(response.statusCode).toBe(400);
    });
    test("should respond with a json object containg error", async () => {
      const response = await request(app).get(
        "/api/search?query=test&start_time=foo"
      );
      expect(response.error).toBeDefined();
    });
  });
  describe("with a wrong end_time param", () => {
    test("should respond with a 400 status code", async () => {
      const response = await request(app).get(
        "/api/search?query=test&end_time=foo"
      );
      expect(response.statusCode).toBe(400);
    });
    test("should respond with a json object containg error", async () => {
      const response = await request(app).get(
        "/api/search?query=test&end_time=foo"
      );
      expect(response.error).toBeDefined();
    });
  });
  describe("with a start_time > end_time", () => {
    test("should respond with a 400 status code", async () => {
      const response = await request(app).get(
        `/api/search?query=test&start_time=${previusISODate(
          1
        )}&end_time=${previusISODate(3)}`
      );
      expect(response.statusCode).toBe(400);
    });
    test("should respond with a json object containg error", async () => {
      const response = await request(app).get(
        `/api/search?query=test&start_time=${previusISODate(
          1
        )}&end_time=${previusISODate(3)}`
      );
      expect(response.error).toBeDefined();
    });
  });
});
