import {
  searchFail,
  getGeo,
  searchSuccess,
  getAuthours,
  getRetweetText,
  getType,
  getMedias,
} from "../utils/customResponse";

describe("getMedias", () => {
  it("should return an array of media information objects", () => {
    const mediaKeys = ["media1", "media2", "media3"];
    const allMedias = [
      {
        media_key: "media1",
        height: 100,
        width: 100,
        preview_image_url: "http://example.com/media1.jpg",
      },
      {
        media_key: "media2",
        height: 200,
        width: 200,
        preview_image_url: "http://example.com/media2.jpg",
      },
      {
        media_key: "media3",
        height: 300,
        width: 300,
        preview_image_url: "http://example.com/media3.jpg",
      },
    ];
    const expected = [
      {
        media_key: "media1",
        height: 100,
        width: 100,
        preview_image_url: "http://example.com/media1.jpg",
        index: 0,
      },
      {
        media_key: "media2",
        height: 200,
        width: 200,
        preview_image_url: "http://example.com/media2.jpg",
        index: 1,
      },
      {
        media_key: "media3",
        height: 300,
        width: 300,
        preview_image_url: "http://example.com/media3.jpg",
        index: 2,
      },
    ];
    const result = getMedias(mediaKeys, allMedias);
    expect(result).toEqual(expected);
  });
});

describe("getType", () => {
  it("should return the correct tweet type", () => {
    const tweet1 = {
      referenced_tweets: [
        {
          type: "replied_to",
        },
      ],
    };
    const tweet2 = {
      referenced_tweets: [
        {
          type: "retweeted",
        },
      ],
    };
    const tweet3 = {
      referenced_tweets: [
        {
          type: "quoted",
        },
      ],
    };
    const tweet4 = {
      referenced_tweets: [
        {
          type: "something_else",
        },
      ],
    };
    expect(getType(tweet1)).toEqual("REPLYTO");
    expect(getType(tweet2)).toEqual("RETWEET");
    expect(getType(tweet3)).toEqual("QUOTED");
    expect(getType(tweet4)).toEqual("NOTYPE");
  });
});

describe("getRetweetText", () => {
  it("should return an object with the retweet text and language", () => {
    const retweetId = "retweet1";
    const allRetweets = [
      {
        id: "retweet1",
        text: "Retweet 1 text",
        lang: "en",
        attachments: {
          media_keys: ["media1"],
        },
      },
      {
        id: "retweet2",
        text: "Retweet 2 text",
        lang: "fr",
      },
    ];
    const expected = {
      text: "Retweet 1 text",
      lang: "en",
      mediaKey: "media1",
    };
    const result = getRetweetText(retweetId, allRetweets);
    expect(result).toEqual(expected);
  });

  it("should throw an error if the retweet ID is not found", () => {
    const retweetId = "retweet1";
    const allRetweets = [
      {
        id: "retweet2",
        text: "Retweet 2 text",
        lang: "fr",
      },
    ];
    expect(() => {
      getRetweetText(retweetId, allRetweets);
    }).toThrow("Retweet text not found");
  });
});

describe("getAuthours", () => {
  it("should return an array of author information objects", () => {
    const authorsId = ["author1", "author2", "author3"];
    const allAuthors = [
      {
        id: "author1",
        name: "Author 1",
        screen_name: "author1_screenname",
        profile_image_url: "http://example.com/author1.jpg",
      },
      {
        id: "author2",
        name: "Author 2",
        screen_name: "author2_screenname",
        profile_image_url: "http://example.com/author2.jpg",
      },
      {
        id: "author3",
        name: "Author 3",
        screen_name: "author3_screenname",
        profile_image_url: "http://example.com/author3.jpg",
      },
    ];
    const expected = [
      {
        id: "author1",
        name: "Author 1",
        screen_name: "author1_screenname",
        pfpUrl: "http://example.com/author1.jpg",
      },
      {
        id: "author2",
        name: "Author 2",
        screen_name: "author2_screenname",
        pfpUrl: "http://example.com/author2.jpg",
      },
      {
        id: "author3",
        name: "Author 3",
        screen_name: "author3_screenname",
        pfpUrl: "http://example.com/author3.jpg",
      },
    ];
    const result = getAuthours(authorsId, allAuthors);
    expect(result).toEqual(expected);
  });
});

describe("searchSuccess", () => {
  it('should return an object with the type "SEARCH_SUCCESS" and the search data as the payload', () => {
    const textTweets = ["Tweet 1", "Tweet 2", "Tweet 3"];
    const creationDates = ["2020-01-01", "2020-02-01", "2020-03-01"];
    const users = ["user1", "user2", "user3"];
    const types = ["type1", "type2", "type3"];
    const places = ["place1", "place2", "place3"];
    const medias = ["media1", "media2", "media3"];
    const expected = {
      type: "SEARCH_SUCCESS",
      payload: {
        textTweets,
        creationDates,
        users,
        types,
        places,
        medias,
      },
    };
    const result = searchSuccess(
      textTweets,
      creationDates,
      users,
      types,
      places,
      medias
    );
    expect(result).toEqual(expected);
  });
});

describe("getGeo", () => {
  it("should return an array of place coordinates and names", () => {
    const placesID = ["place1", "place2", "place3"];
    const allPlaces = [
      { id: "place1", geo: { bbox: [1, 2, 3, 4] }, name: "Place 1" },
      {
        id: "place2",
        geo: {
          bbox: [5, 6, 7, 8],
        },
        name: "Place 2",
      },
      {
        id: "place3",
        geo: {
          bbox: [9, 10, 11, 12],
        },
        name: "Place 3",
      },
    ];
    const expected = [
      { position: [3, 2], name: "Place 1", index: 0 },
      {
        position: [7, 6],
        name: "Place 2",
        index: 1,
      },
      {
        position: [11, 10],
        name: "Place 3",
        index: 2,
      },
    ];
    const result = getGeo(placesID, allPlaces);
    expect(result).toEqual(expected);
  });
});

describe("searchFail", () => {
  it('should return an object with the type "SEARCH_FAIL"', () => {
    const result = searchFail();
    expect(result).toEqual({
      type: "SEARCH_FAIL",
    });
  });
});
