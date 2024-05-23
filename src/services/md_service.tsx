// Markdown Service
const MS = {
  // fetch markdown file from static folder
  fetchMarkdown: async (path: string) => {
    const response = await fetch(path);
    const text = await response.text();
    return text;
  },
};

export default MS;
