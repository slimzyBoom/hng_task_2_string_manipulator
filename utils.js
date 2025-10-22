import crypto from "crypto";

const hash_string = (string) => {
  return crypto.createHash("sha256").update(string).digest("hex");
};

const compute_string_occurance = (string) => {
  const character_frequency_map = {};
  const serialized_string = string.replace(/\s+/g, "").toLowerCase();
  for (let char of serialized_string) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }
  return character_frequency_map;
};

const compute_number_of_words = (string) => {
  const words = string.trim().split(/\s+/);
  return words.length;
};

const char_in_string = (char, string) => {
  return string.includes(char);
};

const is_string_palindrome = (string) => {
  const cleaned_string = string.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const reversed_string = cleaned_string.split("").reverse().join("");
  return cleaned_string === reversed_string;
};

const count_string_characters = (string) => {
  const cleaned_string = string.replace(/\s+/g, "");
  return cleaned_string.length;
};

const count_unique_characters = (string) => {
  const cleaned_string = string.replace(/\s+/g, "").toLowerCase();
  const unique_chars = new Set(cleaned_string);
  return unique_chars.size;
};

export {
  hash_string,
  compute_string_occurance,
  count_unique_characters,
  compute_number_of_words,
  char_in_string,
  is_string_palindrome,
  count_string_characters,
};
