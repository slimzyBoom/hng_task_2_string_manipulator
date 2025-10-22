import crypto from "crypto";

const hash_string = (string) => {
  return crypto.createHash("sha256").update(string).digest("hex");
};

const compute_string_occurance = (strings) => {
  const character_frequency_map = {};

  const serilized_string = strings.replace(/\s+/g, "").toLowerCase();

  for (let char of serilized_string) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }

  return character_frequency_map;
};

const compute_number_of_words = (strings) => {
  const words = strings.trim().split(/\s+/);
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

const count_unique_strings = (strings) => {
  const cleaned_strings = strings.trim().split(/\s+/);
  const unique_strings = new Set(cleaned_strings);
  return unique_strings.size;
};

export {
  hash_string,
  compute_string_occurance,
  count_unique_strings,
  compute_number_of_words,
  char_in_string,
  is_string_palindrome,
  count_string_characters,
};
