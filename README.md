# 📈 Stock Market Insights Web App

A dynamic web application that delivers curated stock market news, connects to user portfolios (real or simulated), and uses AI to provide sentiment analysis of market developments.

Github URL:
Deploy URL:
ShortWorking Video Demo:

## 🔧 Features

### 📰 News Scraping Module
- Automatically scrapes stock market-related news in India.
- Sources: [Moneycontrol](https://www.moneycontrol.com/), [Economic Times Markets](https://economictimes.indiatimes.com/markets), or free news APIs.
- Headlines are shown in a **General News** section.

### 📊 Portfolio Linking Module
- Users can link their stock portfolios to the webpage.
- Integration with broker APIs like:
  - Zerodha Kite Connect (sandbox)
  - Groww Developer Sandbox
  - Or any other free/open APIs
- If API integration is unavailable, users can simulate a portfolio by manually entering stock symbols.

### 🔍 Filtered News Section
- Displays only news relevant to the user’s portfolio.
- Automatically matches keywords/tickers in news headlines with the user's stock list.

### 🤖 AI Analysis Module
- Uses OpenAI / ChatGPT API to analyze filtered news.
- Outputs sentiment indicators for each headline:
  - 📈 Positive Impact
  - ⚖️ Neutral Impact
  - 📉 Negative Impact
- If no portfolio is linked, generates a **general market sentiment summary**.
- *(Optional Bonus)*: Adds confidence scores and brief reasoning under each sentiment.

### 📣 Notification System (Optional)
- Sends push notifications or email alerts based on sentiment analysis results or major market changes.

---

## 🧪 Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Frontend     | **React.js**, **Next.js** (Preferred) |
| Backend      | **Node.js** (Optional)       |
| Scraping     | **Cheerio**, **Axios** (or Python's BeautifulSoup via microservice) |
| AI API       | **OpenAI API (ChatGPT)**     |
| Portfolio APIs | Zerodha / Groww (or mocked input) |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/stock-news-ai.git
cd stock-news-ai



2. Install dependencies
bash
Copy
Edit
npm install

3. Environment Variables
Create a .env.local file:

env
Copy
Edit
OPENAI_API_KEY=your_openai_key
NEWS_API_URL=https://yournewsapi.com
BROKER_API_KEY=your_broker_key (if applicable)


. Run the development server
bash
Copy
Edit
npm run dev



Let me know if you’d like me to generate this as a downloadable file or update based on your GitHub repo URL.
