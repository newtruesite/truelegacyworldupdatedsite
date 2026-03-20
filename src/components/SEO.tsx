import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}

export function SEO({ title, description, image, canonical }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const canonicalHost = "https://truelegacyworld.com";
    const host = typeof window !== "undefined" ? window.location.host : "truelegacyworld.com";
    const protocol = typeof window !== "undefined" ? window.location.protocol : "https:";
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
    const siteUrl = `${protocol}//${host}${currentPath}`;

    const defaultImage = `${canonicalHost}/logos/tl-square-white.png`;
    const resolvedImage = image ? new URL(image, canonicalHost).toString() : defaultImage;
    const effectiveCanonical = canonical || `${canonicalHost}${currentPath}`;

    const setMeta = (selector: string, attr: string, value: string) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        const elementName = selector.startsWith("link") ? "link" : "meta";
        tag = document.createElement(elementName);
        const attrParts = selector.match(/\[(.*)\]/);
        if (attrParts && attrParts[1]) {
          const [attrName, attrValue] = attrParts[1].split("=");
          if (attrName && attrValue) {
            tag.setAttribute(attrName, attrValue.replace(/"/g, ""));
          }
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute(attr, value);
    };

    setMeta('meta[name="title"]', "content", title);
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:site_name"]', "content", "True Legacy World");
    setMeta('meta[property="og:url"]', "content", siteUrl);
    setMeta('meta[property="og:image"]', "content", resolvedImage);
    setMeta('meta[property="og:image:alt"]', "content", "True Legacy World brand logo and landscape");

    setMeta('meta[property="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[property="twitter:url"]', "content", siteUrl);
    setMeta('meta[property="twitter:title"]', "content", title);
    setMeta('meta[property="twitter:description"]', "content", description);
    setMeta('meta[property="twitter:image"]', "content", resolvedImage);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", effectiveCanonical);
  }, [title, description, image, canonical]);

  return null;
}
