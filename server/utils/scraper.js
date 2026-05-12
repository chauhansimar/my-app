import axios from "axios";
import cheerio from "cheerio";

export const scrapeWebsite = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  let text = "";

  $("h1, h2, h3, p").each((i, el) => {
    text += $(el).text() + " ";
  });

  return text;
};