import { teamImagesFields, addFields } from "../utils/queryFields.js";

describe("addFields", () => {
  it("should return an object with the specified fields added", () => {
    const params = {};
    const expectedResult = {
      expansions: [
        "attachments.media_keys",
        "entities.mentions.username",
        "geo.place_id",
        "in_reply_to_user_id",
        "referenced_tweets.id",
        "referenced_tweets.id.author_id",
      ],
      "tweet.fields": [
        "attachments",
        "author_id",
        "entities",
        "geo",
        "id",
        "lang",
        "text",
        "created_at",
        "conversation_id",
      ],
      "media.fields": ["preview_image_url", "type", "url"],
      "place.fields": [
        "contained_within",
        "country",
        "country_code",
        "full_name",
        "geo",
        "id",
        "name",
        "place_type",
      ],
      "user.fields": ["profile_image_url"],
    };

    expect(addFields(params)).toEqual(expectedResult);
  });
});

describe("teamImagesFields", () => {
  it("should return an object with the specified fields for the team images", () => {
    const params = {};
    const expectedResult = {
      "tweet.fields": ["created_at", "author_id"],
      expansions: ["attachments.media_keys", "referenced_tweets.id.author_id"],
      "media.fields": ["preview_image_url", "url"],
      "user.fields": ["profile_image_url"],
    };

    expect(teamImagesFields(params)).toEqual(expectedResult);
  });
});
