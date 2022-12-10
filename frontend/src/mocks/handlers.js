import { rest } from "msw";
import { mockFantacitorioScores } from "./api_responses/mockFantacitorioScores";
import { mockFantacitorioWeeklyScores } from "./api_responses/mockFantacitorioWeeklyScores";
import { mockQueryNoParams } from "./api_responses/mockQueryNoParams";
import { mockUserNoParams } from "./api_responses/mockUserNoParams";
import { mockFantacitorioTeams } from "./api_responses/mockFantacitorioTeams";
import { mockFantacitorioUserTeams } from "./api_responses/mockFantacitorioUserTeams";
import { mockNoTeamsFound } from "./api_responses/mockNoTeamsFound";

const baseUrl = process.env.REACT_APP_BASE_API_URL;
const apiUrl = baseUrl + "/api/";

let url = apiUrl;
let fantacitorioUrl = baseUrl + "/fantacitorio/"

// Utilizziamo msw per intercettare la fetch durante il test
export const handlers = [
  // GET /api/search?query=meloni
  rest.get(`${url}search`, (req, res, ctx) => {
    // Dato "/search?query=meloni"
    // req.url.searchParams.get('query') // "meloni"
    if (req.url.searchParams.get("query") !== "meloni")
      return res(ctx.json("{error: -1}"));
    return res(ctx.json(mockQueryNoParams));
  }),
  rest.get(`${fantacitorioUrl}teamImages`, (req, res, ctx) => {
    return res(ctx.json(mockFantacitorioTeams));
  }),
  rest.get(`${fantacitorioUrl}teamUser`, (req, res, ctx) => {
    if (req.url.searchParams.get("username") === "fedeborci1")
      return res(ctx.json(mockNoTeamsFound));
    else if (req.url.searchParams.get("username"))
      return res(ctx.json(mockFantacitorioUserTeams));
    else
      return res(ctx.json("{error: -1}"));
  }),
  rest.get(`${fantacitorioUrl}ranking`, (req, res, ctx) => {
    return res(ctx.json(mockFantacitorioScores));
  }),
  rest.get(`${fantacitorioUrl}weeklyPoints`, (req, res, ctx) => {
    return res(ctx.json(mockFantacitorioWeeklyScores));
  }),
  rest.get(`${url}tweets`, (req, res, ctx) => {
    return res(ctx.json(mockUserNoParams));
  }),
];
