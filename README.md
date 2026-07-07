# FinAL

AI-powered stock analysis. LSTM 7-day price forecasting, BERT sentiment analysis
on financial news headlines, live market data, and a Gemini-powered expense chat.

**Live demo:** https://final-psi-bice.vercel.app
**API:** https://r1ch3rd-final-api.hf.space

> Research and portfolio demonstration, not financial advice.

## Features

| Feature | How it works |
|---|---|
| **Price forecast** | A 2-layer LSTM (PyTorch) predicts the next 7 days from a year of closing prices |
| **News sentiment** | `bert-base-multilingual-uncased-sentiment` scores recent Finnhub headlines, aggregated to an overall signal |
| **Live prices** | yfinance for historical/latest quotes |
| **Expense chat** | Gemini parses natural-language spending into structured transactions that feed the dashboard's expense chart |

## Architecture

- **Frontend** — React + Vite + Tailwind, deployed on Vercel
- **Backend** — FastAPI on a Hugging Face Space (Docker, CPU); LSTM weights ship
  in the image, BERT downloads on first boot. Finnhub and Gemini keys are Space
  secrets.

### Demo mode

The original app persisted transactions and portfolios to Firebase. This public
demo keeps everything on-device (localStorage) instead, so no login or backing
store is required. Firebase persistence turns back on automatically if a
service-account file is present.

## Run locally

```bash
# backend
pip install -r requirements-space.txt
GEMINI_KEY=<key> MARKET_KEY=<finnhub-key> uvicorn app:app --reload --port 8000

# frontend
cd Client
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

## Notes

- The demo backend sleeps after ~48h idle on the free tier; the first request
  after a quiet spell takes ~30s to wake.
- yfinance occasionally rate-limits hosted IPs; retry after a moment.
