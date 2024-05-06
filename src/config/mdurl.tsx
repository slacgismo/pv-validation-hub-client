// This file contains the functionality for replacing specific markdown image paths
// to work within the application.

/**
 * Replaces the image paths in the markdown with the correct path for the images
 * @param {string} markdown The markdown to replace the image paths in
 * @param {number} analysisId The id of the analysis to get the images for
 * @return {string} The markdown with the image paths replaced
 */
function replaceImagePaths(markdown: string, analysisId: number) {
  const regex = /!\[(.*?)\]\(\.\/(.*?)\)/g;
  return markdown.replace(regex,
      `![$1](${process.env.PUBLIC_URL}/assets/${analysisId}/$2)`);
}

export default replaceImagePaths;
