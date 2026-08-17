/** Elastic-ish search: accent- and case-insensitive, multi-term, order-independent,
 *  cross-script (Latin input finds Cyrillic and Georgian names), with a subsequence
 *  fallback so partial words and small typos still match. */

const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh",
  щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya", і: "i", ї: "i", є: "e",
};

const GEORGIAN: Record<string, string> = {
  ა: "a", ბ: "b", გ: "g", დ: "d", ე: "e", ვ: "v", ზ: "z", თ: "t", ი: "i",
  კ: "k", ლ: "l", მ: "m", ნ: "n", ო: "o", პ: "p", ჟ: "zh", რ: "r", ს: "s",
  ტ: "t", უ: "u", ფ: "p", ქ: "k", ღ: "gh", ყ: "q", შ: "sh", ჩ: "ch", ც: "ts",
  ძ: "dz", წ: "ts", ჭ: "ch", ხ: "kh", ჯ: "j", ჰ: "h",
};

/** Letters NFD can't decompose — Turkish ı, Nordic ø/å, Polish ł, German ß … */
const SPECIAL: Record<string, string> = {
  ı: "i", ø: "o", ł: "l", ß: "ss", æ: "ae", œ: "oe", đ: "d", ð: "d", þ: "th", ħ: "h",
};

function normalize(s: string): string {
  const folded = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip Latin diacritics (ü -> u, é -> e)
    .replace(/\s+/g, " ")
    .trim();

  let out = "";
  for (const ch of folded) out += SPECIAL[ch] ?? ch;
  return out;
}

/** Latin rendering of Cyrillic/Georgian text so "petrov" can match "Петров". */
function latinize(s: string): string {
  let out = "";
  for (const ch of s) out += CYRILLIC[ch] ?? GEORGIAN[ch] ?? ch;
  return out;
}

/** Characters of `term` appear in `text` in order, allowing gaps. */
function subsequence(term: string, text: string): boolean {
  let i = 0;
  for (const ch of text) {
    if (ch === term[i]) i++;
    if (i === term.length) return true;
  }
  return false;
}

/**
 * Every whitespace-separated term in `query` must hit at least one field.
 * Each term is tried as typed and transliterated. An empty query matches everything.
 */
export function matches(query: string, fields: (string | number | undefined | null)[]): boolean {
  const q = normalize(query);
  if (!q) return true;

  // Index each field twice: as written, and latinized.
  const haystack: string[] = [];
  for (const f of fields) {
    if (f === undefined || f === null) continue;
    const n = normalize(String(f));
    haystack.push(n);
    const l = latinize(n);
    if (l !== n) haystack.push(l);
  }
  const joined = haystack.join(" ");

  return q.split(" ").every((term) => {
    const forms = term === latinize(term) ? [term] : [term, latinize(term)];
    return forms.some((t) => {
      if (joined.includes(t)) return true;
      // Typo tolerance only for terms long enough that a loose match stays meaningful.
      return t.length >= 3 && haystack.some((f) => subsequence(t, f));
    });
  });
}
