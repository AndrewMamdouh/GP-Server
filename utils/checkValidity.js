import { default as isItEmpty } from "validator/lib/isempty.js";

export const isNull = (field) => field == null;

export const isEmpty = (field) => isItEmpty(field.trim());

export const isArray = (arr) => Array.isArray(arr);

export const hasLength = (data, len) => data.length === len;

export const isBetween = (lb, num, up) => num > lb && num < up;

export const isNum = (num) => typeof num === 'number';

export const isString = (str) => typeof str === 'string';

export const isMember = (elem, arr) => arr.includes(elem);