export async function optimizeImage(file, preset = "photo") {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choose a JPEG, PNG or WebP image.");
  const bitmap = await createImageBitmap(file);
  if (bitmap.width * bitmap.height > 50000000) {
    bitmap.close();
    throw new Error("Image is too large. Resize it below 50 megapixels first.");
  }
  const social = preset === "social";
  const max = preset === "logo" ? 512 : 1600;
  const ratio = Math.min(1, max / bitmap.width, max / bitmap.height);
  const width = social ? 1200 : Math.max(1, Math.round(bitmap.width * ratio));
  const height = social ? 630 : Math.max(1, Math.round(bitmap.height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (social) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    const r = Math.min(width / bitmap.width, height / bitmap.height);
    const w = bitmap.width * r,
      h = bitmap.height * r;
    context.drawImage(bitmap, (width - w) / 2, (height - h) / 2, w, h);
  } else context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.86),
  );
  if (!blob) throw new Error("Could not process image.");
  return {
    file: new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", {
      type: "image/webp",
    }),
    width,
    height,
  };
}
