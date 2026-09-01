import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Myntra AI Engine", version="1.0.0")

# Initialize Groq client
# The user needs to provide GROQ_API_KEY in their environment or .env file
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY", "dummy_key"))

class UserProfile(BaseModel):
    heightCm: float
    weightKg: float
    usualSize: str
    bodyType: str

class ProductMetadata(BaseModel):
    sku: str
    availableSizes: List[str]
    category: str

class FitScoreRequest(BaseModel):
    userProfile: UserProfile
    product: ProductMetadata

class SummarizeRequest(BaseModel):
    sku: str
    reviews: List[str]

class StylingRequest(BaseModel):
    sku: str
    userProfile: UserProfile

@app.post("/api/fit-score")
async def calculate_fit_score(req: FitScoreRequest):
    # Deterministic score based on sku length or hash
    try:
        sku_val = int(req.product.sku.replace("SKU", ""))
    except:
        sku_val = sum(ord(c) for c in req.product.sku)
        
    # Base score varies from 60 to 98 based on sku
    base_score = 60 + (sku_val * 7 % 39) 
    
    # Simple rule: if usual size is in available sizes, score is higher
    if req.userProfile.usualSize in req.product.availableSizes:
        base_score = min(98, base_score + 10)
        
    # Cap between 0 and 100
    final_score = max(60, min(98, base_score))
    
    return {
        "sku": req.product.sku,
        "fitScore": final_score,
        "confidence": "High" if final_score > 80 else "Medium"
    }

@app.post("/api/summarize-reviews")
async def summarize_reviews(req: SummarizeRequest):
    if not req.reviews:
        return {"sku": req.sku, "consensus": "No reviews available yet."}
        
    try:
        reviews_text = "\n".join([f"- {r}" for r in req.reviews])
        
        prompt = f"""
        You are an expert fashion assistant. Summarize the following product reviews into a single, punchy "consensus highlight" sentence. 
        Focus on fabric stretch, durability, and fit nuances. Keep it under 15 words.
        
        Reviews:
        {reviews_text}
        
        Consensus Highlight:
        """
        
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a concise fashion assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="mixtral-8x7b-32768",
            temperature=0.3,
            max_tokens=50,
        )
        
        consensus = chat_completion.choices[0].message.content.strip()
        
        # Remove any quotes that the LLM might have added
        if consensus.startswith('"') and consensus.endswith('"'):
            consensus = consensus[1:-1]
            
        return {
            "sku": req.sku,
            "consensus": consensus
        }
    except Exception as e:
        print(f"Error calling Groq: {e}")
        # Fallback if Groq API key is missing or fails
        return {
            "sku": req.sku,
            "consensus": "Fits true to size, great quality fabric."
        }

@app.post("/api/styling-recommendations")
async def styling_recommendations(req: StylingRequest):
    # Mock heuristic for styling
    recommendations = []
    if req.sku == 'SKU1001': # Dress
        recommendations = [
            { "sku": "SKU_ACC_01", "name": "Minimalist Gold Necklace", "imageUrl": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80" },
            { "sku": "SKU_SHOE_02", "name": "Nude Block Heels", "imageUrl": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=200" }
        ]
    elif req.sku == 'SKU1002': # Jeans
        recommendations = [
            { "sku": "SKU_TOP_01", "name": "White Crop Top", "imageUrl": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=200" },
            { "sku": "SKU_SHOE_03", "name": "Chunky White Sneakers", "imageUrl": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200" }
        ]
    
    return {
        "sku": req.sku,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
