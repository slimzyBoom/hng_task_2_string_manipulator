import { is_string_palindrome, char_in_string } from "./utils.js";

export const query_prompts = {
  "all single word palindromic strings": (dbObj) => {
    const parsed_filters = { word_count: 1, is_palindrome: true };
    const responseObj = dbObj.filter(
      (s) =>
        s.properties.word_count === 1 && s.properties.is_palindrome === true
    );
    return { responseObj, parsed_filters };
  },

  "strings longer than 10 characters": (dbObj) => {
    const parsed_filters = { min_length: 11 };
    const responseObj = dbObj.filter((s) => s.properties.length > 10);
    return { responseObj, parsed_filters };
  },

  "palindromic strings that contain the first vowel": (dbObj) => {
    const parsed_filters = { is_palindrome: true, contains_character: "a" };
    const responseObj = dbObj.filter(
      (s) =>
        s.properties.is_palindrome &&
        char_in_string("a", s.value)
    );
    return { responseObj, parsed_filters };
  },

  "strings containing the letter z": (dbObj) => {
    const parsed_filters = { contains_character: "z" };
    const responseObj = dbObj.filter((s) =>
      char_in_string("z", s.value)
    );
    return { responseObj, parsed_filters };
  },
};
