import {
  getListOfPoliticians,
  validRow,
  addPoliticians,
  getValidRows,
  getPointsfromText,
  getSummedPoints,
  getFullNames,
} from "../controllers/fantacitorio.js";

describe("getFullNames", () => {
  it("should return an array of objects with the politicians and their summed points with full names", () => {
    const list = [
      { politic: "John Doe", points: 10 },
      { politic: "Jane Smith", points: 10 },
      { politic: "Doe", points: 5 },
      { politic: "Smith", points: 5 },
    ];
    const expectedResult = [
      { politic: "John Doe", points: 10 },
      { politic: "Jane Smith", points: 10 },
      { politic: "John Doe", points: 5 },
      { politic: "Jane Smith", points: 5 },
    ];

    expect(getFullNames(list)).toEqual(expectedResult);
  });
});

describe("getSummedPoints", () => {
  it("should return an array of objects with the politicians and their summed points", () => {
    const list = [
      { politic: "John Doe", points: 5 },
      { politic: "Jane Smith", points: 5 },
      { politic: "John Doe", points: 5 },
      { politic: "Jane Smith", points: 5 },
    ];
    const expectedResult = [
      { politic: "John Doe", points: 10 },
      { politic: "Jane Smith", points: 10 },
    ];

    expect(getSummedPoints(list)).toEqual(expectedResult);
  });
});

describe("getPointsfromText", () => {
  it("should return an object with the list of politicians and points and the best single score", () => {
    const rows = [
      "5 punti - John Doe",
      "5 punti - Jane Smith",
      "5 punti PER John Doe",
      "5 punti A Jane Smith",
    ];
    const expectedResult = {
      list: [
        { politic: "John Doe", points: 5 },
        { politic: "Jane Smith", points: 5 },
        { politic: "John Doe", points: 5 },
        { politic: "Jane Smith", points: 5 },
      ],
      bestSingleScore: { politic: "John Doe", points: 5 },
    };

    expect(getPointsfromText(rows)).toEqual(expectedResult);
  });

  it("should throw an error if no rows are provided", () => {
    expect(() => {
      getPointsfromText();
    }).toThrowError("Righe mancanti");
  });
});

describe("getValidRows", () => {
  it("should return an array of valid rows", () => {
    const tweets = [
      { text: "5 punti - John Doe\n5 punti - Jane Smith\n" },
      { text: "5 punti PER John Doe\n5 punti A Jane Smith\n" },
    ];
    const expectedResult = [
      "5 punti - John Doe",
      "5 punti - Jane Smith",
      "5 punti PER John Doe",
      "5 punti A Jane Smith",
    ];

    expect(getValidRows(tweets)).toEqual(expectedResult);
  });

  it("should throw an error if no tweets are provided", () => {
    expect(() => {
      getValidRows();
    }).toThrowError("Tweets mancanti");
  });
});

describe("addPoliticians", () => {
  it("should return a list of rows with the politicians added", () => {
    const list = ["5 punti"];
    const row = "500 punti a:";
    const politicians = ["John Doe", "Jane Smith"];
    const expectedResult = [
      "5 punti",
      "500 punti a John Doe",
      "500 punti a Jane Smith",
    ];

    expect(addPoliticians(list, row, politicians)).toEqual(expectedResult);
  });
});

describe("validRow", () => {
  it("should return true if the row is valid", () => {
    expect(validRow("5 punti")).toBe(true);
    expect(validRow("10 punti")).toBe(true);
    expect(validRow("5 PUNTI")).toBe(true);
    expect(validRow("10 PUNTI")).toBe(true);
  });

  it("should return false if the row is not valid", () => {
    expect(validRow("5")).toBe(false);
    expect(validRow("10")).toBe(false);
    expect(validRow("punti")).toBe(false);
    expect(validRow("PUNTI")).toBe(false);
    expect(validRow("5 punt")).toBe(false);
  });
});

describe("getListOfPoliticians", () => {
  it("should return an array of politicians", () => {
    const tweetRows = [
      "#Politicians",
      "John Doe",
      "Jane Smith",
      "",
      "#OtherHashtag",
    ];
    const expectedResult = ["John Doe", "Jane Smith"];

    expect(getListOfPoliticians(tweetRows, 0)).toEqual(expectedResult);
  });

  it("should throw an error if the index is -1", () => {
    const tweetRows = [
      "#Politicians",
      "John Doe",
      "Jane Smith",
      "",
      "#OtherHashtag",
    ];

    expect(() => {
      getListOfPoliticians(tweetRows, -1);
    }).toThrowError("Indice non esistente");
  });
});
