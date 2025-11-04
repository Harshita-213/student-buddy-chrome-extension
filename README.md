# Student Buddy – AI-Powered Chrome Extension
Student Buddy is a Chrome extension designed to help students learn more efficiently while browsing.  
It can **summarize any article** from the current webpage and **answer student questions** instantly using the **Gemini 2.5 Flash API** — without switching tabs.

## ✨ Features
- 🧠 **AI Q&A** — Ask any doubt and get instant answers
- 📄 **Summarize Webpages** — One click to summarize the article you're currently reading
- 🔍 **Context Aware** — Extracts only the meaningful text from the webpage (ignores ads/menus)
- 🎨 **Clean & Minimal Side Panel UI**
- ⚡ Fast responses using **Gemini Flash** model

## 🛠️ Tech Stack
| Component | Technology |
|----------|------------|
| Frontend | HTML, CSS, JavaScript |
| Chrome Extension | Manifest V3, Content Scripts, Message Passing |
| AI Model | Google Gemini 2.5 Flash API |

## 🔑 Setup Instructions (Required to Run)
This project requires a **Gemini API key**.
1. Get your API key here:  
   https://aistudio.google.com/app/apikey
2. Open `popup.js`
3. Replace this line: **const API_KEY = "YOUR_GEMINI_API_KEY_HERE";**
4. Save the file

## 🚀 Load the Extension in Chrome
1. Download or Clone this repository
2. Open Chrome and visit: chrome://extensions/
3. Enable Developer Mode (top-right)
4. Click Load unpacked
5. Select the project folder
6. Open any webpage → Click the extension icon → It opens in Side Panel 🎉

## 🖼️ UI Preview 
1. (image.png)
2. (image-1.png)
3. (image-2.png)
