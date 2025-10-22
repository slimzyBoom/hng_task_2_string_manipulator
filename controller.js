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

const create_string = (req, res) => {
  const { string_value } = req.body;
  if(typeof string_value !== "string") {
    return res.status(422).json({ message: "String value must be a string" });
  }
  if (!string_value && string_value === "") {
    return res.status(400).json({ message: "String value is required" });
  }
  for (let strObj of stringDB) {
    if (strObj.value === string_value) {
      return res.status(409).json({ message: "String already exists" });
    }
  }
  try {
    const hashedString = hash_string(string_value);
    const stringStats = {
      id: hashedString,
      value: string_value,
      properties: {
        length: count_string_characters(string_value),
        is_string_palindrome: is_string_palindrome(string_value),
        unique_characters: count_unique_strings(string_value),
        word_count: compute_number_of_words(string_value),
        sha2656_hash: hashedString,
        character_frequency_map: compute_string_occurance(string_value),
      },
      created_at: new Date().toUTCString(),
    };
    stringDB.push(stringStats);
    res.status(201).json(stringStats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const get_string_by_value = (req, res) => {
  const { string_value } = req.params;
  if (!string_value && string_value === "") {
    return res.status(400).json({ message: "String value is required" });
  }
  try {
    const stringObj = stringDB.find((str) => str.value === string_value);
    if (!stringObj) {
      return res.status(404).json({ message: "String not found" });
    }
    res.json(stringObj);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const get_all_strings = (req, res) => {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;

  //   At least one filter must be provided
  if (
    !is_palindrome &&
    !min_length &&
    !max_length &&
    !word_count &&
    !contains_character
  ) {
    return res
      .status(400)
      .json({ message: "At least one query parameter is required" });
  }

  // Convert string query values to correct types
  const isPalindrome = is_palindrome === "true";
  const minLength = min_length ? parseInt(min_length) : null;
  const maxLength = max_length ? parseInt(max_length) : null;
  const wordCount = word_count ? parseInt(word_count) : null;
  const containsChar = contains_character || null;

  // Filtering
  const filtered_strings = stringDB.filter((strObj) => {
    const { value, properties } = strObj;

    // Apply all active filters
    if (isPalindrome && !properties.is_string_palindrome) return false;
    if (minLength && properties.length < minLength) return false;
    if (maxLength && properties.length > maxLength) return false;
    if (wordCount && properties.word_count !== wordCount) return false;
    if (containsChar && !char_in_string(containsChar, value)) return false;

    return true;
  });

  if (filtered_strings.length === 0) {
    return res
      .status(404)
      .json({ message: "No strings found matching the criteria" });
  }

  res.json({
    data: filtered_strings,
    count: filtered_strings.length,
    filters_applied: req.query,
  });
};

const filter_by_natural_language = (req, res) => {
  const { query } = req.query;
  const normalized_query = query?.toLowerCase().trim();
  if (!normalized_query || !query_prompts[normalized_query]) {
    return res
      .status(400)
      .json({ message: " Unable to parse natural language query" });
  }
  try {
    // Get the filter function based on the query prompt
    const filter_function = query_prompts[query];
    const { responseObj, parsed_filters } = filter_function(stringDB);

    res.json({
      data: responseObj,
      count: responseObj.length,
      interpreted_query: {
        original: query,
        parsed_filters,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const delete_string = (req, res) => {
  const { string_value } = req.params;
  if (!string_value && string_value === "") {
    return res.status(400).json({ message: "String value is required" });
  }
  try {
    const stringIndex = stringDB.findIndex((str) => str.value === string_value);
    if (stringIndex === -1) {
      return res.status(404).json({ message: "String not found" });
    }
    stringDB.splice(stringIndex, 1);
    res.status(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  create_string,
  get_string_by_value,
  get_all_strings,
  filter_by_natural_language,
  delete_string
};
