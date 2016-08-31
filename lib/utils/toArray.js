/**
 * Converts list into array
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = toArray;

function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}