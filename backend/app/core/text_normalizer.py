"""Arabic text normalization for search.

Handles:
- Diacritics removal (Tashkeel)
- Alef variants (أ إ آ ٱ → ا)
- Yaa variants (ى → ي)
- Taa Marbuta (ة → ه)
- Hamza on waw/yaa (ؤ ئ → و ي)
- Punctuation and extra spaces
- Latin lowercase
"""
import re
import unicodedata

# Arabic diacritics (Tashkeel)
_DIACRITICS = re.compile(
    "["
    "\u0610-\u061A"  # Arabic signs
    "\u064B-\u065F"  # Arabic diacritics
    "\u0670"          # Arabic letter superscript alef
    "\u06D6-\u06DC"  # Quranic annotations
    "\u06DF-\u06E4"
    "\u06E7\u06E8"
    "\u06EA-\u06ED"
    "]"
)

# Tatweel (kashida)
_TATWEEL = "\u0640"

# Punctuation
_PUNCT = re.compile(r"[^\w\s\u0600-\u06FF]", re.UNICODE)

# Multiple spaces
_SPACES = re.compile(r"\s+")

# Character maps
_CHAR_MAP = {
    # Alef variants → ا
    "\u0622": "\u0627",  # آ
    "\u0623": "\u0627",  # أ
    "\u0625": "\u0627",  # إ
    "\u0671": "\u0627",  # ٱ
    # Yaa variants → ي
    "\u0649": "\u064A",  # ى
    "\u0626": "\u064A",  # ئ
    # Waw variants → و
    "\u0624": "\u0648",  # ؤ
    # Taa Marbuta → ه
    "\u0629": "\u0647",  # ة
    # Haa variants
    "\u06BE": "\u0647",
    "\u06C1": "\u0647",
}


def normalize_arabic(text: str) -> str:
    """Normalize Arabic text for search matching."""
    if not text:
        return ""
    text = text.strip()
    # Remove diacritics
    text = _DIACRITICS.sub("", text)
    # Remove tatweel
    text = text.replace(_TATWEEL, "")
    # Normalize unicode (NFKC handles some cases)
    text = unicodedata.normalize("NFKC", text)
    # Apply character map
    for src, dst in _CHAR_MAP.items():
        text = text.replace(src, dst)
    # Lowercase (for latin)
    text = text.lower()
    # Remove punctuation
    text = _PUNCT.sub(" ", text)
    # Collapse spaces
    text = _SPACES.sub(" ", text).strip()
    return text


def extract_keywords(text: str) -> list[str]:
    """Extract meaningful keywords from a normalized query.

    Removes common filler words like عايز, اريد, ممكن, ازاي, etc.
    """
    normalized = normalize_arabic(text)
    if not normalized:
        return []
    # Filler words to ignore
    stopwords = {
        "عايز", "عاوز", "عايزه", "اريد", "أريد", "محتاج", "محتاجه",
        "ممكن", "من", "في", "على", "الى", "إلى", "عن",
        "ازاي", "إزاي", "كيف", "اعمل", "أعمل", "اطلع", "أطلع",
        "استخرج", "استخراج", "اجدد", "أجدد", "جدد",
        "واحد", "واحده", "هو", "هي", "انا", "أنا",
        "لو", "بس", "بعد", "قبل", "مع", "او", "أو",
    }
    words = [w for w in normalized.split() if w and w not in stopwords]
    return words


def score_alias_match(query_norm: str, alias_norm: str) -> int:
    """Score how well a query matches an alias.

    Returns 0 if no match, higher = better.
    """
    if not query_norm or not alias_norm:
        return 0
    # Exact match
    if query_norm == alias_norm:
        return 1000
    # Query is substring of alias
    if query_norm in alias_norm:
        return 500 + len(query_norm)
    # Alias is substring of query
    if alias_norm in query_norm:
        return 400 + len(alias_norm)
    # Word-level overlap
    q_words = set(query_norm.split())
    a_words = set(alias_norm.split())
    overlap = q_words & a_words
    if overlap:
        return 100 * len(overlap)
    return 0