const request = require("request-promise");
const cheerio = require("cheerio");
const { json, errorJson } = require("../utils/response");

exports.index = (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  return json(res, {
    maintainer: "Azhari Muhammad M <azhari.marzan@gmail.com>",
    source: "https://github.com/azharimm/kbbi-api",
    search: {
      endpoint: "/search?q={query}",
      example: fullUrl + "search?q=apel",
    },
  });
};

exports.search = async (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  const { q } = req.query;

  if (!q) {
    return errorJson(res, "Mohon isi query pencarian!");
  }

  const htmlResult = await request.get(
    `https://kbbi.kemdikbud.go.id/entri/${q}`
  );

  const $ = await cheerio.load(htmlResult);
  const resultLists = [];
  const total = $("h2").length;

  for (let i = 0; i < total; i++) {
    let kata = $("h2").eq(i).text();
    let arti = [];
    $("h2")
      .eq(i)
      .next()
      .next()
      .children("li")
      .each((index, el) => {
        let list = $(el).text().split("  ");
        // console.log(list.length);
        let num = list.length - 1;
        let artinya = list[num].split(":");
        arti.push(artinya[0].replaceAll(";", " atau"));
      });

    resultLists.push({
      kata,
      arti,
    });
  }

  return json(res, { total, resultLists });
};
