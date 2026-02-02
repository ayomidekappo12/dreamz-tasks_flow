module.exports = {
  siteUrl: "https://www.taskflow.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",

  exclude: ["*"],

  additionalPaths: async (config) => [
    {
      loc: "",
      lastmod: new Date().toISOString(),
      priority: 0.8,
    },
    { loc: "/contact-us", lastmod: new Date().toISOString(), priority: 0.6 },
  ],
};
