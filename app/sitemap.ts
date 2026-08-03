import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: "https://giordano.us",
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://giordano.us/privacy-policy",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://giordano.us/llms.txt",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]
}
