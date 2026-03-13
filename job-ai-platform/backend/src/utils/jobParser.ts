import axios from "axios";
import { load } from "cheerio";

const descriptionSelectors = [
  "[class*='job-description']",
  "[id*='job-description']",
  "[class*='description']",
  "[id*='description']",
  "main",
  "article",
  "section"
];

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").replace(/\n{2,}/g, "\n").trim();
}

function truncateForPrompt(value: string, maxChars = 12000): string {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, maxChars)}...`;
}

export interface ParsedJobPosting {
  sourceUrl: string;
  pageTitle: string;
  description: string;
}

export async function parseJobPosting(jobUrl: string): Promise<ParsedJobPosting> {
  const validatedUrl = new URL(jobUrl);
  const response = await axios.get<string>(validatedUrl.toString(), {
    timeout: 12000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36"
    }
  });

  const html = response.data;
  const $ = load(html);

  $("script, style, noscript, svg, iframe, nav, footer").remove();

  const extractedCandidates = descriptionSelectors
    .map((selector) => normalizeWhitespace($(selector).text()))
    .filter((text) => text.length > 80);

  const bestCandidate = extractedCandidates.sort((a, b) => b.length - a.length)[0];
  const bodyText = normalizeWhitespace($("body").text());
  const rawDescription = bestCandidate || bodyText;

  if (!rawDescription || rawDescription.length < 80) {
    throw new Error("Unable to extract meaningful job description text from the provided URL.");
  }

  return {
    sourceUrl: validatedUrl.toString(),
    pageTitle: normalizeWhitespace($("title").text()) || "Unknown Title",
    description: truncateForPrompt(rawDescription)
  };
}

