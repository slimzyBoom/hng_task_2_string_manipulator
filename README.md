## String Manipulator API

A lightweight Express.js API for creating, analyzing, and filtering strings.
It supports palindrome detection, word/character analysis, and natural-language-based string querying.


### Features

* Add and store new strings (mock DB)
* Check if a string is a palindrome
* Count unique characters and word count
* Query strings dynamically using filters
* Use natural language queries like:

  * `"strings longer than 10 characters"`
  * `"all single word palindromes"`
  * `"strings containing the letter z"`

## Tech Stack

* **Node.js**
* **Express.js**

## Setup Instructions

### Clone the repository

```bash
git clone https://github.com/your-username/string-manipulator-api.git
cd string-manipulator-api
```

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

Or manually:

```bash
nodemon index.js
```

### Start the server

Default port: **3000**

```bash
Server running on http://localhost:3000
```

## Dependencies

| Package                 | Purpose                                |
| ----------------------- | -------------------------------------- |
| **express**             | Core web framework                     |
| **nodemon**             | Auto-reload on file changes (dev only) |
| **cors**                | Enable cross-origin requests           |
| **crypto** *(built-in)* | Hash generation (optional if used)     |

Install individually if needed:

```bash
npm install express cors
npm install --save-dev nodemon
```

## API Endpoints

### Create a new string

**POST** `/api/strings`
**Body (JSON):**

```json
{
  "value": "A man a plan a canal Panama"
}
```

**Response:**

```json
{
  "message": "String added successfully",
  "data": {
    "value": "A man a plan a canal Panama",
    "properties": {
      "is_string_palindrome": true,
      "length": 27,
      "word_count": 6,
      "unique_characters": { "a": 10, "m": 2, "n": 3, ... }
    }
  }
}
```

### Get all strings (with optional filters)

**GET** `/api/strings`

**Query Parameters:**

| Parameter            | Type    | Example | Description                       |
| -------------------- | ------- | ------- | --------------------------------- |
| `is_palindrome`      | boolean | `true`  | Filter only palindromes           |
| `min_length`         | number  | `5`     | Minimum string length             |
| `max_length`         | number  | `10`    | Maximum string length             |
| `word_count`         | number  | `3`     | Match exact word count            |
| `contains_character` | string  | `z`     | Must contain a specific character |

**Example:**

```
GET /api/strings?is_palindrome=true&min_length=5
```

---

### Get a single string by value

**GET** `/api/strings/:string_value`

**Example:**

```
GET /api/strings/madam
```

---

### Filter by natural language

**GET** `/api/strings/filter-by-natural-language?query_prompt=<query>`

**Example:**

```
GET /api/strings/filter-by-natural-language?query_prompt=strings%20longer%20than%2010%20characters
```



