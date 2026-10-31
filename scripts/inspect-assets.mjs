import fs from "node:fs";
import path from "node:path";

function getDim(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), type: "png" };
  }
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xFF) break;
      const marker = buf[offset + 1];
      if (marker === 0xC0 || marker === 0xC2) {
        return { h: buf.readUInt16BE(offset + 5), w: buf.readUInt16BE(offset + 7), type: "jpg" };
      }
      const len = buf.readUInt16BE(offset + 2);
      offset += 2 + len;
    }
  }
  return { w: 0, h: 0, type: "unknown" };
}

function scan(dir) {
  const results = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...scan(full));
    } else if (/\.(jpg|png|webp)$/i.test(item.name)) {
      const buf = fs.readFileSync(full);
      const dim = getDim(buf);
      results.push({ file: full.replace(/\\/g, "/"), ...dim, bytes: buf.length });
    }
  }
  return results;
}

const res = scan("public/assets/nitaara");
console.table(res);

