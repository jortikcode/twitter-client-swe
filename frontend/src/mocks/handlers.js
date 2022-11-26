import { rest } from 'msw'
import { mockQueryNoParams } from './api_responses/mockQueryNoParams'; 
import { mockUserNoParams } from './api_responses/mockUserNoParams'; 

const baseUrl = process.env.REACT_APP_BASE_API_URL;
const apiUrl = baseUrl + "/api/";

let url = apiUrl;
/* url += `${data.type === "keyword" ? `search?query=${data.query}` : `tweets?username=${data.username}`}`;
url += `${data.maxResults && data.maxResults < 100 && !data.token ? `&max_results=${data.maxResults}` : ``}`;
url += `${data.startDate ? `&start_time=${data.startDate}&end_time=${data.endDate}` : ``}`;
url += `${data.token ? `&pagination_token=${data.token}` : ``}`; */

// Utilizziamo msw per intercettare la fetch durante il test
export const handlers = [
    // GET /api/search?query=meloni
    rest.get(`${url}search`, (req, res, ctx) => {
        // Dato "/search?query=meloni" 
        // req.url.searchParams.get('query') // "meloni"
        if (req.url.searchParams.get('query') !== "meloni")
            return res(ctx.json("{error: -1}"));
        return res(
            ctx.json(mockQueryNoParams)
        );
    }),
    rest.get(`${url}tweets`, (req, res, ctx) => {
        return res(
            ctx.json(mockUserNoParams)
        );
    })
]