export function addFields(params = {}) {
  params["expansions"] = [
    "attachments.media_keys",
    "entities.mentions.username",
    "geo.place_id",
    "in_reply_to_user_id",
    "referenced_tweets.id",
    "referenced_tweets.id.author_id",
  ];

  params["tweet.fields"] = [
    "attachments",
    "author_id",
    "entities",
    "geo",
    "id",
    "lang",
    "text",
    "created_at",
    "conversation_id"
  ];
  params["media.fields"] = ["preview_image_url", "type", "url"];
  params["place.fields"] = [
    "contained_within",
    "country",
    "country_code",
    "full_name",
    "geo",
    "id",
    "name",
    "place_type",
  ];
  params["user.fields"] = ["profile_image_url"];

  return params;
}

export const teamImagesFields = (params = {}) => {
  params["expansions"] = [
      "attachments.media_keys"
    ];
   
  params["media.fields"] = [
      "preview_image_url",
      "url"
    ];
  return params;
}
