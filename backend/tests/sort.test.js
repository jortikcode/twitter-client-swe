import { sortByPoints, sortByValue } from "../utils/sort";

describe("sortByPoints", () => {
  it("should return a sorted array of objects by points", () => {
    const list = [
      { points: 3 },
      { points: 5 },
      { points: 1 },
      { points: 4 },
      { points: 2 },
    ];
    const expectedResult = [
      { points: 5 },
      { points: 4 },
      { points: 3 },
      { points: 2 },
      { points: 1 },
    ];

    expect(sortByPoints(list)).toEqual(expectedResult);
  });
});

describe("sortByValue", () => {
  it("should return a sorted array of objects by value", () => {
    const list = [
      { value: 3 },
      { value: 5 },
      { value: 1 },
      { value: 4 },
      { value: 2 },
    ];
    const expectedResult = [
      { value: 5 },
      { value: 4 },
      { value: 3 },
      { value: 2 },
      { value: 1 },
    ];

    expect(sortByValue(list)).toEqual(expectedResult);
  });
});
