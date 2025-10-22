import { query_prompts } from "./query_prompts.js";
import {
  hash_string,
  compute_string_occurance,
  count_unique_characters,
  compute_number_of_words,
  char_in_string,
  is_string_palindrome,
  count_string_characters,
} from "./utils.js";

const stringDB = [];

/** ============================
 * POST /strings
 * ============================
 */
const create_string = (req, res) => {
  const { value } = req.body;

  if (value === undefined) {
    return res.status(400).json({ message: "'value' field is required" });
  }

  if (typeof value !== "string") {
    return res.status(422).json({ message: "'value' must be a string" });
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    return res.status(400).json({ message: "String cannot be empty" });
  }

  const existing = stringDB.find((s) => s.value === value);
  if (existing) {
    return res.status(409).json({ message: "String already exists" });
  }

  try {
    const sha256_hash = hash_string(value);

    const stringStats = {
      id: sha256_hash,
      value,
      properties: {
        length: count_string_characters(value),
        is_palindrome: is_string_palindrome(value),
        unique_characters: count_unique_characters(value),
        word_count: compute_number_of_words(value),
        sha256_hash,
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

/** ============================
 * GET /strings/:string_value
 * ============================
 */
const get_string_by_value = (req, res) => {
  const { string_value } = req.params;

  if (!string_value) {
    return res.status(400).json({ message: "String value is required" });
  }

  const found = stringDB.find((s) => s.value === string_value);
  if (!found) {
    return res.status(404).json({ message: "String not found" });
  }

  return res.status(200).json(found);
};

/** ============================
 * GET /strings
 * ============================
 */
const get_all_strings = (req, res) => {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;

  // Validate query parameter types
  if (
    (min_length && isNaN(min_length)) ||
    (max_length && isNaN(max_length)) ||
    (word_count && isNaN(word_count)) ||
    (is_palindrome && !["true", "false"].includes(is_palindrome))
  ) {
    return res.status(400).json({ message: "Invalid query parameter values" });
  }

  const filters = {
    is_palindrome: is_palindrome === "true",
    min_length: min_length ? parseInt(min_length, 10) : null,
    max_length: max_length ? parseInt(max_length, 10) : null,
    word_count: word_count ? parseInt(word_count, 10) : null,
    contains_character: contains_character || null,
  };

  let filtered = stringDB;

  if (Object.values(filters).some((f) => f !== null && f !== false)) {
    filtered = stringDB.filter(({ value, properties }) => {
      if (filters.is_palindrome && !properties.is_palindrome) return false;
      if (filters.min_length && properties.length < filters.min_length)
        return false;
      if (filters.max_length && properties.length > filters.max_length)
        return false;
      if (
        filters.word_count &&
        properties.word_count !== filters.word_count
      )
        return false;
      if (
        filters.contains_character &&
        !char_in_string(filters.contains_character, value)
      )
        return false;
      return true;
    });
  }

  return res.status(200).json({
    data: filtered,
    count: filtered.length,
    filters_applied: filters,
  });
};

/** ============================
 * GET /strings/filter-by-natural-language
 * ============================
 */
const filter_by_natural_language = (req, res) => {
  const query = req.query.query || req.query.query_prompt;
  const normalized = query?.toLowerCase().trim();

  if (!normalized) {
    return res
      .status(400)
      .json({ message: "Missing or invalid 'query' parameter" });
  }

  const matched_filter = query_prompts[normalized];
  if (!matched_filter) {
    return res
      .status(400)
      .json({ message: "Unable to parse natural language query" });
  }

  try {
    const { responseObj, parsed_filters } = matched_filter(stringDB);

    if (!responseObj) {
      return res.status(422).json({ message: "Conflicting or invalid filters" });
    }

    return res.status(200).json({
      data: responseObj,
      count: responseObj.length,
      interpreted_query: {
        original: query,
        parsed_filters,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** ============================
 * DELETE /strings/:string_value
 * ============================
 */
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
