export const shuffleArray = (array: Array<any>) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi các phần tử
  }
  return array;
};

export const textContentFromHTML = (html: string) => {
  const removedRtTagsHTML = html.replaceAll(/<rt>.*?<\/rt>/g, "");
  const div = document.createElement("div");
  div.innerHTML = removedRtTagsHTML.trim();
  return div.textContent;
};
