const stickers = import.meta.glob('./stickers/*.{png,jpg,jpeg,svg,webp}', { eager: true });

export default Object.keys(stickers).map((key) => stickers[key].default);
