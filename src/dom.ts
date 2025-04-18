import { JSDOM } from "jsdom";

const dom = new JSDOM();
const window = dom.window;
export const document = window.document;
