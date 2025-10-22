import express from "express";
const router = express.Router();

import {
  create_string,
  get_string_by_value,
  get_all_strings,
  filter_by_natural_language,
  delete_string,
} from "./controller.js";

router.get("/strings/filter-by-natural-language", filter_by_natural_language);
router.get("/strings/:string_value", get_string_by_value);
router.get("/strings", get_all_strings);
router.post("/strings", create_string);
router.delete("/strings/:string_value", delete_string);

export default router;
