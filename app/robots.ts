import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/the-science"],
        disallow: ["/checkout"],
      },
    ],
    sitemap: "https://goodstim.pl/sitemap.xml",
  };
}
