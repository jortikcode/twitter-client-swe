import app from "../index.js";
import request from "supertest";

describe("GET /api/search", () => {
  describe("given a query", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).get("/api/search?query=test");
      expect(response.statusCode).toBe(200);
    });
    test("should respond with a json object containg textTweets, creationDates, users, types, places, sentimentAnalysis", async () => {
      const response = await request(app).get("/api/search?query=test");
      expect(response.body.textTweets).toBeDefined();
      expect(response.body.creationDates).toBeDefined();
      expect(response.body.users).toBeDefined();
      expect(response.body.types).toBeDefined();
      expect(response.body.places).toBeDefined();
      expect(response.body.sentimentAnalysis).toBeDefined();
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
});
