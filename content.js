function getMainText() {
  // Prefer a focused article container
  const el =
    document.querySelector('article') ||
    document.querySelector('main') ||
    document.querySelector('[role="main"]') ||
    document.querySelector('.content, .post, .entry-content, .article-content');

  // If user selected text, prefer that (usually most accurate)
  const sel = window.getSelection()?.toString()?.trim();
  if (sel && sel.length > 80) return sel;

  const text = (el ? el.innerText : document.body.innerText).trim();

  // Collapse extra whitespace
  return text.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "GET_PAGE_TEXT") {
    const text = getMainText();
    sendResponse({ text, title: document.title });
  }
  return true;
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if(message.action === "GET_PAGE_TEXT"){
//         const text = document.body.innerText; // Read all visible text
//         sendResponse({ text });
//     }
//     return true;
// });