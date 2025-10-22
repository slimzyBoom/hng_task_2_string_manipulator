export const query_prompts = {
    "all single word palindromes": (dbObj) => {
      const parsed_filters = {
        word_count: 1,
        is_string_palindrome: true,
      };
      const responseObj = dbObj.filter((stringObj) => {
        return (
          stringObj.value.trim().split(/\s+/).length === 1 &&
          is_string_palindrome(stringObj.value)
        );
      });
      return { responseObj, parsed_filters };
    },
    "strings longer than 10 characters": (dbObj) => {
      const parsed_filters = {
        min_length: 11,
      };
      const responseObj = dbObj.filter(
        (stringObj) => stringObj.properties.length > 10
      );
      return { responseObj, parsed_filters };
    },
    "palindromic strings that contains the first vowel 'a' ": (dbObj) => {
      const parsed_filters = {
        is_string_palindrome: true,
        contains_character: "a",
      };
      const palindromic_strings = dbObj.filter((string) =>
        is_string_palindrome(string.value)
      );
      const first_letter_vowel_palindromes = palindromic_strings.filter(
        (string) => string.value.includes("a")
      );
      return { responseObj: first_letter_vowel_palindromes, parsed_filters };
    },
    "strings containing the letter z": (dbObj) => {
      const parsed_filters = {
        contains_character: "z",
      };
      const responseObj = dbObj.filter((stringObj) =>
        char_in_string("z", stringObj.value)
      );
      return { responseObj, parsed_filters };
    },
  };