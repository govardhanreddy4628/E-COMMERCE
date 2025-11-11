/**
 * Moderation utilities
 * - Profanity filter
 * - Spam & pattern detection
 * - Works in real-time (for reviews, comments, feedback)
 */

// ✅ Simple escapeRegExp (replacement for lodash.escapeRegExp)
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Base profanity list
 * You can extend this as needed or load from DB / JSON in production.
 */
export const PROFANITY_WORDS: string[] = [
  "fuck", "shit", "bitch", "bastard", "asshole", "dick", "cunt", "fag", "slut",
  "whore", "damn", "crap", "jerk", "idiot", "stupid", "retard", "moron",
  "loser", "suck", "boobs", "balls", "nigger", "pussy", "cock", "tits", "douche",
  "bollocks", "bugger", "arse", "wanker", "twat", "prick"
];

/**
 * Detects profanity safely (handles Unicode + l33t speak)
 */
export function containsProfanity(text?: string): boolean {
  if (!text) return false;

  const normalized = text
    .normalize("NFKC")
    .replace(/[@#$%^&*0-9]+/g, "")
    .toLowerCase();

  const deobfuscated = normalized
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b");

  return PROFANITY_WORDS.some((word) => {
    const safeWord = escapeRegExp(word);
    const re = new RegExp(`\\b${safeWord}\\b`, "i");
    return re.test(deobfuscated);
  });
}

/**
 * Spam and abuse detection
 */
export interface SpamCheckOptions {
  userPreviousCount?: number;
  maxLinks?: number;
  maxMentions?: number;
  maxLength?: number;
  minLength?: number;
}

export function basicSpamCheck(
  comment?: string,
  opts: SpamCheckOptions = {}
): boolean {
  if (!comment) return false;

  const {
    userPreviousCount = 0,
    maxLinks = 2,
    maxMentions = 3,
    maxLength = 2000,
    minLength = 3,
  } = opts;

  const text = comment.trim();

  // Empty or too short
  if (text.length < minLength) return true;

  // Overly long (copy-paste spam)
  if (text.length > maxLength) return true;

  // Too many links
  const linkCount = (text.match(/https?:\/\//gi) || []).length;
  if (linkCount > maxLinks) return true;

  // Too many @mentions
  const mentionCount = (text.match(/@\w+/g) || []).length;
  if (mentionCount > maxMentions) return true;

  // Repeated letters (like looooveeee)
  if (/([a-zA-Z])\1{6,}/.test(text)) return true;

  // Excessive emojis/symbols
  if ((text.match(/\p{Emoji}/gu) || []).length > 10) return true;

  // Repeated phrases
  const words = text.split(/\s+/);
  const uniqueRatio = new Set(words).size / words.length;
  if (uniqueRatio < 0.4) return true;

  // Too many reviews from user
  if (userPreviousCount > 5) return true;

  // Shouting (ALL CAPS)
  if (text.length > 10 && text === text.toUpperCase()) return true;

  return false;
}

/**
 * Combined moderation helper
 */
export function moderateComment(
  comment: string,
  opts?: SpamCheckOptions
): { ok: boolean; reason?: string } {
  if (containsProfanity(comment))
    return { ok: false, reason: "contains_profanity" };
  if (basicSpamCheck(comment, opts))
    return { ok: false, reason: "possible_spam" };
  return { ok: true };
}
