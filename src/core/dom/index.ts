/**
 * @fileoverview
 * This file exports a jsdom instance to be used for DOM manipulation.
 * This is used to create and manipulate DOM nodes in a Node.js environment.
 */
import { JSDOM } from "jsdom";

const jsdom = new JSDOM();
export const document = jsdom.window.document;
