from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import torch.nn as nn
import numpy as np
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
import uvicorn
import os
import google.generativeai as genai
import json
import requests
from datetime import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from transformers import BertTokenizer, BertForSequenceClassification
from dotenv import load_dotenv
from datetime import datetime,timedelta
from fastapi.middleware.cors import CORSMiddleware

# Load the environment variables from .env file
load_dotenv()
# Use the application default credentials.
cred = credentials.Certificate('finai.json')

firebase_admin.initialize_app(cred)
db = firestore.client()

genai.configure(api_key=os.environ.get("GEMINI_KEY"))

# Load the sentiment analysis model
sentiment_model_name = 'nlptown/bert-base-multilingual-uncased-sentiment'
sentiment_tokenizer = BertTokenizer.from_pretrained(sentiment_model_name)
sentiment_model = BertForSequenceClassification.from_pretrained(sentiment_model_name)
import finnhub
finnhub_client = finnhub.Client(api_key=os.environ.get("MARKET_KEY"))

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

generation_config = {
  "temperature": 0.95,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  system_instruction="You are an AI assistant that processes financial statements. Given a user input text, you need to extract the following information for each transaction mentioned:\n\n    1. Intent: The action or purpose of the user's statement (e.g., \"AddExpense\", \"ViewExpenses\", \"CheckBalance\").\n    2. Amount: The amount of money mentioned in the transaction (e.g., \"$50\", \"200\").\n    3. Category: The category of the expense (e.g., \"Groceries\", \"Electronics\", \"Rent\").\n    4. Note: The original user input text.\n    5. Timestamp: The current date and time in ISO 8601 format.\n\n    For each transaction in the input text, respond with a JSON object. If multiple transactions are mentioned, return a list of JSON objects. Here is an example JSON structure:\n\n    Example Inputs and Expected Outputs:\n\n    1. Input: \"I spent $50 on groceries and $20 on coffee.\"\n       - Output: [\n           {{\n               \"user_id\": 1,\n               \"amount\": \"50\",\n               \"credit_or_debit\": \"Debit\",\n               \"category\": \"Groceries\",\n               \"note\": \"I spent $50 on groceries.\",\n               \"timestamp\": \"2024-08-27T03:18:41Z\",\n               \"intent\": \"AddExpense\"\n           }},\n           {{\n               \"user_id\": 1,\n               \"amount\": \"20\",\n               \"credit_or_debit\": \"Debit\",\n               \"category\": \"Coffee\",\n               \"note\": \"I spent $20 on coffee.\",\n               \"timestamp\": \"2024-08-27T03:18:41Z\",\n               \"intent\": \"AddExpense\"\n           }}\n       ]\n\n    2. Input: \"I spent 50 on a pen and 20 on noodles.\"\n       - Output: [\n           {{\n               \"user_id\": 1,\n               \"amount\": \"50\",\n               \"credit_or_debit\": \"Debit\",\n               \"category\": \"Stationery\",\n               \"note\": \"I spent 50 on a pen.\",\n               \"timestamp\": \"2024-08-27T03:18:41Z\",\n               \"intent\": \"AddExpense\"\n           }},\n           {{\n               \"user_id\": 1,\n               \"amount\": \"20\",\n               \"credit_or_debit\": \"Debit\",\n               \"category\": \"Food\",\n               \"note\": \"I spent 20 on noodles.\",\n               \"timestamp\": \"2024-08-27T03:18:41Z\",\n               \"intent\": \"AddExpense\"\n           }}\n       ]\n\n    3. Input: \"Show me my expenses for this month.\"\n       - Output: {\n           \"user_id\": 1,\n           \"amount\": null,\n           \"credit_or_debit\": null,\n           \"category\": null,\n           \"note\": \"Show me my expenses for this month.\",\n           \"timestamp\": \"2024-08-27T03:18:41Z\",\n           \"intent\": \"ViewExpenses\"\n       }\n\n       The response must contain text of that format only.",
)

chat = model.start_chat(history=[])

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    user_message = request.message
    
    try:
        # Send the message to the model and collect the streamed response
        response = chat.send_message(user_message)
        print(response.text)
        
        # Collect all chunks from the streamed response
        current = ""
        for chunk in response:
            if chunk.text:
                current += chunk.text

        # Attempt to parse the final JSON output
        jsonstrs = json.loads(response.text)  # Modify this as needed based on the structure of `current`.

        doc_ref = db.collection('chat_logs').document()  # Auto-generate document ID
        doc_ref.set({
            'user_message': user_message,
            'model_response': current,
            'timestamp': datetime.now().isoformat()
        })

        datatable = db.collection('transaction_info').document()
        for jsonstr in jsonstrs:
            datatable.set({
                'user_id': jsonstr['user_id'],
                'amount': jsonstr['amount'],
                'credit_or_debit': jsonstr['credit_or_debit'],
                'category': jsonstr['category'],
                'note': jsonstr['note'],
                'timestamp': datetime.now().isoformat(),
                'intent': jsonstr['intent']
        })
        
        return jsonstrs  # Send the parsed JSON as the API response
    
    except Exception as e:
        # In case of any errors, raise an HTTP 500 error with the exception details
        raise HTTPException(status_code=500, detail=str(e))


# Define the request model using Pydantic
class ChatRequest(BaseModel):
    message: str

class SentimentRequest(BaseModel):
    stock_symbol: str

def predict_sentiment(text):
    # Tokenize and encode the text
    inputs = sentiment_tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)

    # Make prediction
    with torch.no_grad():
        outputs = sentiment_model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()

    # Map prediction to sentiment (assumed 5 classes for sentiment)
    return 'positive' if predicted_class > 2 else 'negative'

def get_news_headlines(stock_symbol):
    try:
        to_date = datetime.today().strftime('%Y-%m-%d')
        from_date = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
        new_response = finnhub_client.company_news(stock_symbol, _from=from_date, to=to_date)
        headlines = [article['headline'] for article in new_response[-15:]]
    except:
        print("error")

    # try:
    #     response = requests.get(url)
    #     response.raise_for_status()  # This will raise an exception for HTTP errors
    #     data = response.json()
    #     return [article['title'] for article in data['data']]
    # except requests.exceptions.HTTPError as e:
    #     print(f"HTTP error occurred: {e}")
    #     if response.status_code == 401:
    #         print("This may be due to an invalid API key or authentication issue.")
    # except requests.exceptions.RequestException as e:
    #     print(f"An error occurred while making the request: {e}")
    # except KeyError as e:
    #     print(f"Unexpected data format: {e}")
    #     print(f"Response content: {response.text}")
    
    return headlines
@app.get("/stock/{symbol}")
def get_stock_data(symbol: str):
    stock = yf.Ticker(symbol)
    history = stock.history(period="1mo")  # Fetch stock price data for the last month
    return history["Close"].to_dict() 

@app.post("/analyze-sentiment")
async def analyze_sentiment(request: SentimentRequest):
    stock_symbol = request.stock_symbol
    headlines = get_news_headlines(stock_symbol)
    sentiments = []

    for headline in headlines:
        sentiment = predict_sentiment(headline)
        sentiments.append(sentiment)
    
    positive_count = sentiments.count('positive')
    negative_count = sentiments.count('negative')
    average_sentiment = 'Positive' if positive_count > negative_count else 'Negative'

    # Prepare the result to save to Firestore
    analysis_result = {
        'stock_symbol': stock_symbol,
        'positive_headlines': positive_count,
        'negative_headlines': negative_count,
        'average_sentiment': average_sentiment,
        'timestamp': datetime.now().isoformat()
    }

    # Save the analysis result to Firestore
    db.collection('sentiment_analysis').document(stock_symbol).set(analysis_result)

    return analysis_result  # Return the summary of sentiment analysis


# Define the LSTM Model
class LSTM(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_layers, output_dim):
        super(LSTM, self).__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).to(x.device).requires_grad_()
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).to(x.device).requires_grad_()
        out, (hn, cn) = self.lstm(x, (h0.detach(), c0.detach()))
        out = self.fc(out[:, -1, :])
        return out

# Function to load the model
def load_model(model, filepath, device):
    model.load_state_dict(torch.load(filepath, map_location=device))
    model.eval()
    print(f"Model loaded from {filepath}")
    return model

# Set device
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# Initialize model and load the weights
input_dim = 1
hidden_dim = 32
num_layers = 2
output_dim = 1
model = LSTM(input_dim, hidden_dim, num_layers, output_dim).to(device)
model = load_model(model, 'model.pth', device)

# Scaler (same as used during training)
scaler = MinMaxScaler(feature_range=(-1, 1))

# Function to get the latest stock data
def get_stock_data(ticker, seq_length):
    stock_data = yf.download(ticker, period='1y')  # Adjust this as necessary
    closing_prices = stock_data['Close'].values.reshape(-1, 1)
    scaled_data = scaler.fit_transform(closing_prices)
    last_sequence = scaled_data[-seq_length:]
    return torch.FloatTensor(last_sequence).unsqueeze(0).to(device)

# Define the request model (Pydantic BaseModel)
class StockRequest(BaseModel):
    ticker: str

# /predict API endpoint
@app.post("/predict")
async def predict(request: StockRequest):
    ticker = request.ticker

    # Sequence length should match what you trained on (10 in your case)
    sequence_length = 10
    try:
        # Fetch the last sequence of stock data
        last_sequence = get_stock_data(ticker, sequence_length)
        
        # Predict the next 7 days
        predicted = []
        for _ in range(7):
            with torch.no_grad():
                pred = model(last_sequence)
                predicted.append(pred.item())
                # Update the last_sequence with the predicted value
                last_sequence = torch.cat((last_sequence[:, 1:, :], pred.reshape(1, 1, 1)), dim=1)

        # Inverse transform predictions
        predicted = scaler.inverse_transform(np.array(predicted).reshape(-1, 1))
        predictions = predicted.flatten().tolist()

        return {"ticker": ticker, "predictions": predictions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
