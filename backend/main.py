from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Tuple
import json
import os

app = FastAPI(title="Explainable RAG API")

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load knowledge base
with open("knowledge_base.json", "r") as f:
    KNOWLEDGE_BASE = json.load(f)


class ChatRequest(BaseModel):
    message: str
    persona: str = "supply_chain"  # default persona


class SourceReference(BaseModel):
    chunk_id: str
    text: str
    source: str
    page: int
    relevance_score: float


class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceReference]
    confidence: float


def simple_search(query: str, persona: str) -> List[dict]:
    """
    Simple keyword-based search in knowledge base.
    In production, this would use vector embeddings.
    """
    query_lower = query.lower()
    results = []
    
    # Filter by persona
    persona_chunks = [chunk for chunk in KNOWLEDGE_BASE if chunk["persona"] == persona]
    
    # Simple keyword matching
    for chunk in persona_chunks:
        text_lower = chunk["text"].lower()
        # Count keyword matches
        keywords = query_lower.split()
        matches = sum(1 for keyword in keywords if keyword in text_lower)
        
        if matches > 0:
            score = matches / len(keywords)
            results.append({
                **chunk,
                "relevance_score": score
            })
    
    # Sort by relevance
    results.sort(key=lambda x: x["relevance_score"], reverse=True)
    return results[:3]  # Return top 3


def generate_answer(query: str, sources: List[dict]) -> Tuple[str, float]:
    """
    Generate answer using LLM (Google Gemini or OpenAI).
    For now, using a simple template. We'll add real LLM later.
    """
    if not sources:
        return "I don't have enough information to answer that question.", 0.3
    
    # Build context from sources
    context = "\n\n".join([f"Source {i+1}: {s['text']}" for i, s in enumerate(sources)])
    
    # For demo, create a template answer
    # In production, this would call Gemini/GPT
    if "delay" in query.lower() or "bottleneck" in query.lower():
        answer = f"Based on the supply chain data, I found that {sources[0]['text'][:150]}..."
        confidence = 0.9
    elif "score" in query.lower() or "optimization" in query.lower():
        answer = f"The optimization analysis shows: {sources[0]['text']}"
        confidence = 0.85
    else:
        answer = f"According to the documents: {sources[0]['text'][:200]}..."
        confidence = 0.75
    
    return answer, confidence


@app.get("/")
def read_root():
    return {"status": "Explainable RAG API is running"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint with source attribution.
    """
    try:
        # Search for relevant chunks
        relevant_chunks = simple_search(request.message, request.persona)
        
        if not relevant_chunks:
            raise HTTPException(
                status_code=404,
                detail="No relevant information found in the knowledge base."
            )
        
        # Generate answer
        answer, confidence = generate_answer(request.message, relevant_chunks)
        
        # Format sources
        sources = [
            SourceReference(
                chunk_id=chunk["id"],
                text=chunk["text"],
                source=chunk["source"],
                page=chunk["page"],
                relevance_score=chunk["relevance_score"]
            )
            for chunk in relevant_chunks
        ]
        
        return ChatResponse(
            answer=answer,
            sources=sources,
            confidence=confidence
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/personas")
def get_personas():
    """Get available personas"""
    return {
        "personas": [
            {"id": "supply_chain", "name": "Supply Chain Manager", "icon": "📦"},
            {"id": "education", "name": "School Administrator", "icon": "🎓"},
            {"id": "hr", "name": "HR Manager", "icon": "👥"}
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
