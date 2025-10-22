import crypto from "crypto";

export const hash_string = (string) =>
  crypto.createHash("sha256").update(string).digest("hex");

export const compute_string_occurance = (string) => {
  const map = {};
  const cleaned = string.replace(/\s+/g, "").toLowerCase();
  for (const char of cleaned) {
    map[char] = (map[char] || 0) + 1;
  }
  return map;
};

export const compute_number_of_words = (string) => {
  const words = string.trim().split(/\s+/);
  return string.trim() === "" ? 0 : words.length;
};

export const char_in_string = (char, string) =>
  string.toLowerCase().includes(char.toLowerCase());

export const is_string_palindrome = (string) => {
  const cleaned = string.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const reversed = cleaned.split("").reverse().join("");
  return cleaned === reversed;
};

export const count_string_characters = (string) =>
  string.replace(/\s+/g, "").length;

export const count_unique_characters = (string) => {
  const cleaned = string.replace(/\s+/g, "").toLowerCase();
  return new Set(cleaned).size;
};
