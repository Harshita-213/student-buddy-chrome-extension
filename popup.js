const askBtn = document.getElementById('askBtn');
const inputEl = document.getElementById('userInput');
const outEl = document.getElementById('responseBox');
const summarizeBtn = document.getElementById("summarizeBtn");

const MODEL = 'gemini-2.5-flash';
const API_KEY = "YOUR_GEMINI_API_KEY_HERE";

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }]}],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  // Bubble up API errors with details
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || 'Request failed';
    throw new Error(msg);
  }

  const rawText =
    data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "";

  return formatResponse(rawText);

  //return text.trim();
}

async function handleAsk() {
  const prompt = inputEl.value.trim();

  if (!prompt) return;

  askBtn.disabled = true;
  outEl.style.display = "block";
  outEl.innerHTML = 'Thinking… 🤖';

  try {
    const reply = await callGemini(prompt);
    outEl.innerHTML = reply || 'No response.';
  } catch (e) {
    outEl.innerHTML = 'Error: ' + e.message;
  } finally {
    askBtn.disabled = false;
  }
}

// async function handleAsk() {
//   const prompt = inputEl.value.trim();
//   // if (!prompt) {
//   //   outEl.textContent = 'Please enter a question first!';
//   //   return;
//   // }

//   askBtn.disabled = true;
//   outEl.textContent = 'Thinking… 🤖';

//   try {
//     const reply = await callGemini(prompt);
//     outEl.innerHTML = reply || 'No response.';
//   } catch (e) {
//     outEl.innerHTML = 'Error: ' + e.message;
//   } finally {
//     askBtn.disabled = false;
//   }
// }

askBtn.addEventListener('click', handleAsk);

// Ctrl/Cmd + Enter to submit
inputEl.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleAsk();
});

function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/## (.*?)(\n|$)/g, "<h4>$1</h4>")
    .replace(/\n/g, "<br>");
}

summarizeBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action : "GET_PAGE_TEXT"}, (res) => {
      if (chrome.runtime.lastError || !res?.text) {
        outEl.style.display = "block";
        outEl.innerHTML = "Could not read this page. Try another site.";
        return;
      }

      // Keep within model limits; 6–8k chars is a safe target for Flash
      const MAX = 8000;
      const text = res.text.slice(0, MAX);
      const title = res.title || "Untitled";

      outEl.innerHTML = "Summarizing… ✨";

      const prompt =
        `You are an extractive summarizer. Work ONLY with the text between <content>...</content>.\n` +
        `Ignore navigation, sidebars, related links, ads, comments, or unrelated snippets.\n` +
        `If the text mixes topics, focus on the PRIMARY topic referenced in the first few paragraphs.\n` +
        `Title: ${title}\n\n` +
        `<content>\n${text}\n</content>\n\n` +
        `Output:\n- 5–7 concise bullet points\n- One-line conclusion in bold\n- Do NOT invent facts not present in <content>.`;

       callGemini(prompt)
        .then(summary => {
          outEl.style.display = "block";
          outEl.innerHTML = summary || "No summary.";
        })
        .catch(err => {
          outEl.style.display = "block";
          outEl.innerHTML = "Error: " + err.message;
        });
    });
  });
});