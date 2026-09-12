import { useLocaleContext } from "@/contexts/LocaleContext";
import { SpanishLegacyAcademy } from "@/lib/spanishLegacyAcademy";
import { SpanishLegacyAnespaBeaute } from "@/lib/spanishLegacyAnespaBeaute";
import { SpanishLegacyBusiness } from "@/lib/spanishLegacyBusiness";
import { SpanishLegacyCore } from "@/lib/spanishLegacyCore";
import { SpanishLegacyWagyuJr4 } from "@/lib/spanishLegacyWagyuJr4";
import { useLayoutEffect } from "react";

const spanishCopy: Readonly<Record<string, string>> = Object.freeze({
  ...SpanishLegacyCore,
  ...SpanishLegacyAnespaBeaute,
  ...SpanishLegacyWagyuJr4,
  ...SpanishLegacyBusiness,
  ...SpanishLegacyAcademy,
});

const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const translatedTitleToOriginal = new Map<string, string>();
const translatableAttributes = ["placeholder", "aria-label", "title"] as const;

function protectBrandNames(value: string) {
  return value
    .replace(/academia verdadera de la legia/gi, "Academia True Legacy")
    .replace(/el verdadero mundo de la legación/gi, "True Legacy World")
    .replace(/legación verdadera/gi, "True Legacy")
    .replace(/verdadera legia/gi, "True Legacy")
    .replace(/legia verdadera/gi, "True Legacy")
    .replace(/el verdadero mundo del legado/gi, "True Legacy World")
    .replace(/mundo legado verdadero/gi, "True Legacy World")
    .replace(/verdadero legado/gi, "True Legacy")
    .replace(/legado verdadero/gi, "True Legacy")
    .replace(/verdadera academia del legado/gi, "Academia True Legacy")
    .replace(/academia (?:del )?True Legacy/gi, "Academia True Legacy")
    .replace(/verdadero líder del legado/gi, "líder de True Legacy")
    .replace(/verdadero líder legado/gi, "líder de True Legacy")
    .replace(/Enágic(?:o|a|os|as)?/gi, "Enagic")
    .replace(/\b(emGuarde(?: GO)?)TM\b/gi, "$1™");
}

function replacePreservingWhitespace(value: string, translated: string) {
  const start = value.match(/^\s*/)?.[0] ?? "";
  const end = value.match(/\s*$/)?.[0] ?? "";
  return `${start}${translated}${end}`;
}

function translateDocument() {
  const title = document.title.trim();
  const translatedTitle = spanishCopy[title] ? protectBrandNames(spanishCopy[title]) : undefined;
  if (translatedTitle) {
    translatedTitleToOriginal.set(translatedTitle, title);
    document.title = translatedTitle;
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    const value = textNode.nodeValue ?? "";
    const key = value.trim();
    const translated = spanishCopy[key] ? protectBrandNames(spanishCopy[key]) : undefined;
    if (!translated) continue;
    if (!originalText.has(textNode)) originalText.set(textNode, value);
    textNode.nodeValue = replacePreservingWhitespace(value, translated);
  }

  document.body
    .querySelectorAll<Element>("[placeholder], [aria-label], [title]")
    .forEach((element) => {
      for (const attribute of translatableAttributes) {
        const value = element.getAttribute(attribute);
        if (!value) continue;
        const translated = spanishCopy[value.trim()] ? protectBrandNames(spanishCopy[value.trim()]) : undefined;
        if (!translated) continue;
        let originals = originalAttributes.get(element);
        if (!originals) {
          originals = new Map();
          originalAttributes.set(element, originals);
        }
        if (!originals.has(attribute)) originals.set(attribute, value);
        element.setAttribute(attribute, replacePreservingWhitespace(value, translated));
      }
    });
}

function restoreDocument() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textNode = node as Text;
    const original = originalText.get(textNode);
    if (!original) continue;
    const translated = spanishCopy[original.trim()] ? protectBrandNames(spanishCopy[original.trim()]) : undefined;
    if (translated && textNode.nodeValue?.trim() === translated) textNode.nodeValue = original;
  }

  document.body
    .querySelectorAll<Element>("[placeholder], [aria-label], [title]")
    .forEach((element) => {
      const originals = originalAttributes.get(element);
      if (!originals) return;
      originals.forEach((original, attribute) => {
        const translated = spanishCopy[original.trim()] ? protectBrandNames(spanishCopy[original.trim()]) : undefined;
        if (translated && element.getAttribute(attribute)?.trim() === translated) {
          element.setAttribute(attribute, original);
        }
      });
    });

  const originalTitle = translatedTitleToOriginal.get(document.title);
  if (originalTitle) document.title = originalTitle;
}

/**
 * Transitional coverage for legacy landing pages whose copy predates the locale
 * dictionaries. New and edited components should continue using page-level
 * dictionaries; this bridge only fills exact English strings in Spanish mode.
 */
export function LegacySpanishTranslationBridge() {
  const { locale } = useLocaleContext();

  useLayoutEffect(() => {
    if (locale !== "es") {
      restoreDocument();
      return;
    }

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        observer.disconnect();
        translateDocument();
        observer.observe(document.documentElement, {
          subtree: true,
          childList: true,
          characterData: true,
          attributes: true,
          attributeFilter: [...translatableAttributes],
        });
      });
    });

    translateDocument();
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...translatableAttributes],
    });

    return () => observer.disconnect();
  }, [locale]);

  return null;
}
