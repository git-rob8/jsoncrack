import { NODE_DIMENSIONS } from "../../../../../../constants/graph";

type Text = string | [string, string][];
type Size = { width: number; height: number };

const calculateLines = (text: Text): string => {
  if (typeof text === "string") {
    return text;
  } else {
    return text.map(([k, v]) => `${k}: ${JSON.stringify(v).slice(0, 80)}`).join("\n");
  }
};

const calculateWidthAndHeight = (str: string, single = false) => {
  if (!str) return { width: 45, height: 45 };

  const dummyElement = document.createElement("div");
  dummyElement.style.whiteSpace = single ? "nowrap" : "pre-wrap";
  dummyElement.innerText = str;
  dummyElement.style.fontSize = "12px";
  dummyElement.style.width = "fit-content";
  dummyElement.style.padding = "0 10px";
  dummyElement.style.fontWeight = "500";
  dummyElement.style.fontFamily = "monospace";
  document.body.appendChild(dummyElement);

  const clientRect = dummyElement.getBoundingClientRect();
  const lines = str.split("\n").length;

  const width = clientRect.width + 4;
  const height = single ? NODE_DIMENSIONS.PARENT_HEIGHT : lines * NODE_DIMENSIONS.ROW_HEIGHT;

  document.body.removeChild(dummyElement);
  return { width, height };
};

const sizeCache = new Map<Text, Size>();

setInterval(() => sizeCache.clear(), 120_000);

export const calculateNodeSize = (text: Text, isParent = false) => {
  const cacheKey = [text, isParent].toString();

  if (sizeCache.has(cacheKey)) {
    const size = sizeCache.get(cacheKey);
    if (size) return size;
  }

  const lines = calculateLines(text);
  const sizes = calculateWidthAndHeight(lines, typeof text === "string");

  if (isParent) sizes.width += 80;
  if (sizes.width > 700) sizes.width = 700;

  sizeCache.set(cacheKey, sizes);
  return sizes;
};