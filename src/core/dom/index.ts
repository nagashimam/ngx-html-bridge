import { JSDOM } from "jsdom";

const jsdom = new JSDOM();
export const document = jsdom.window.document;
