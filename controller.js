import { query_prompts } from "./query_prompts.js";
import {
  hash_string,
  compute_string_occurance,
  count_unique_strings,
  compute_number_of_words,
  char_in_string,
  is_string_palindrome,
  count_string_characters,
} from "./utils.js";

const stringDB = [];

/* -------------------- CREATE STRING -------------------- */
const create_string = (req, res) => {
  const { value } = req.body;

  if (value === undefined) {
    return res.status(422).json({ message: "'value' field is required" });
  }

  if (typeof value !== "string") {
    return res.status(422).json({ message: "'value' must be a string" });
  }

  if (value.trim() === "") {
    return res.status(422).json({ message: "String cannot be empty" });
  }

  // Check duplicates
  const existing = stringDB.find((s) => s.value === value);
  if (existing) {
    return res.status(409).json({ message: "String already exists" });
  }

  try {
    const hashedString = hash_string(value);
    const stringStats = {
      id: hashedString,
      value,
      properties: {
        length: count_string_characters(value),
        is_string_palindrome: is_string_palindrome(value),
        unique_characters: count_unique_strings(value),
        word_count: compute_number_of_words(value),
        sha256_hash: hashedString,
        character_frequency_map: compute_string_occurance(value),
      },
      created_at: new Date().toISOString(),
    };

    stringDB.push(stringStats);
    return res.status(201).json(stringStats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- GET STRING BY VALUE -------------------- */
const get_string_by_value = (req, res) => {
  const { string_value } = req.params;

  if (!string_value) {
    return res.status(422).json({ message: "String value is required" });
  }

  const found = stringDB.find((s) => s.value === string_value);
  if (!found) {
    return res.status(404).json({ message: "String not found" });
  }

  return res.status(200).json(found);
};

/* -------------------- GET ALL STRINGS -------------------- */
const get_all_strings = (req, res) => {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;

  // Convert types
  const isPalindrome = is_palindrome === "true";
  const minLength = min_length ? parseInt(min_length) : null;
  const maxLength = max_length ? parseInt(max_length) : null;
  const wordCount = word_count ? parseInt(word_count) : null;
  const containsChar = contains_character || null;

  // If no filters, return all
  if (
    !is_palindrome &&
    !min_length &&
    !max_length &&
    !word_count &&
    !contains_character
  ) {
    return res.json({
      data: stringDB,
      count: stringDB.length,
      message: "All strings returned (no filters applied)",
    });
  }

  const filtered = stringDB.filter(({ value, properties }) => {
    if (isPalindrome && !properties.is_string_palindrome) return false;
    if (minLength && properties.length < minLength) return false;
    if (maxLength && properties.length > maxLength) return false;
    if (wordCount && properties.word_count !== wordCount) return false;
    if (containsChar && !char_in_string(containsChar, value)) return false;
    return true;
  });

  if (!filtered.length) {
    return res
      .status(404)
      .json({ message: "No strings found matching the criteria" });
  }

  return res.status(200).json({
    data: filtered,
    count: filtered.length,
    filters_applied: req.query,
  });
};

/* -------------------- NATURAL LANGUAGE FILTER -------------------- */
const filter_by_natural_language = (req, res) => {
  const { query_prompt } = req.query;
  const normalized_query = query_prompt?.toLowerCase().trim();

  if (!normalized_query || !query_prompts[normalized_query]) {
    return res
      .status(400)
      .json({ message: "Unable to parse natural language query" });
  }

  try {
    const filter_function = query_prompts[normalized_query];
    const { responseObj, parsed_filters } = filter_function(stringDB);

    return res.status(200).json({
      data: responseObj,
      count: responseObj.length,
      interpreted_query: {
        original: query_prompt,
        parsed_filters,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- DELETE STRING -------------------- */
const delete_string = (req, res) => {
  const { string_value } = req.params;

  const index = stringDB.findIndex((s) => s.value === string_value);
  if (index === -1) {
    return res.status(404).json({ message: "String not found" });
  }

  stringDB.splice(index, 1);
  return res.status(204).send();
};

export {
  create_string,
  get_string_by_value,
  get_all_strings,
  filter_by_natural_language,
  delete_string,
};
