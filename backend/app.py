from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class Preference(BaseModel):
    user_input: str
    products: list

@app.post("/recommend")
async def recommend(preference: Preference):

    # Use correct model
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""
    You are an AI product recommendation engine.
    User preference: {preference.user_input}
    Available products: {preference.products}
    Return ONLY a JSON list containing product names.
    """

    response = model.generate_content(prompt)
    text = response.text.strip()
    print("AI RAW RESPONSE:", text)
    
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    # Parse JSON safely
    try:
        parsed = json.loads(text)
        return {"results": parsed}              
    except:
        return {"results": [], "error": text}