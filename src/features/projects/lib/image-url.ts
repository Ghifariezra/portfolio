const OBJECT = "/storage/v1/object/public/";
const RENDER = "/storage/v1/render/image/public/";

export function cardImage(url: string, w = 640, h = 256, q = 60): string {
    if (!url.includes(OBJECT)) return url;
    return `${url.replace(OBJECT, RENDER)}?width=${w}&height=${h}&resize=cover&quality=${q}`;
}
