"""FastAPI routes for Retrieval search engine and RAG pipeline operations."""

import logging
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Query
from pydantic import BaseModel

from app.services.retrieval import retrieval_service
from app.services.pdf_pipeline import pdf_pipeline_service
from app.services.vector_store import vector_store_service

logger = logging.getLogger(__name__)
router = APIRouter()

# --- Request/Response Pydantic Models ---

class RAGSearchRequest(BaseModel):
    projectId: str
    query: str
    limit: Optional[int] = 5

class PaperResponse(BaseModel):
    title: str
    authors: str
    source: str
    abstract: str
    publicationYear: int
    relevanceScore: float
    sourceType: str
    url: Optional[str] = ""

class RAGContextResponse(BaseModel):
    id: str
    document: str
    metadata: Dict[str, Any]
    score: float

# --- Routes ---

@router.get("/search", response_model=List[PaperResponse])
async def search_publications(
    query: str = Query(..., description="The search query topic"),
    limit: int = Query(4, description="Results limit per source engine"),
    topic: Optional[str] = Query(None, description="The research project context topic")
):
    """Search publications across arXiv, Semantic Scholar, and Web search engines."""
    if not query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    try:
        results = await retrieval_service.retrieve_all_sources(query, limit_per_source=limit, project_topic=topic)
        return results
    except Exception as e:
        logger.error(f"Search API route failed: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.post("/upload-pdf")
async def upload_pdf_document(
    projectId: str = Form(..., description="ID of the research project"),
    file: UploadFile = File(..., description="PDF manuscript file to upload")
):
    """Upload PDF, parse text, chunk paragraphs, generate embeddings, and store in vector database."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF documents are supported")
    try:
        content = await file.read()
        logger.info(f"Received PDF upload '{file.filename}' for project '{projectId}' ({len(content)} bytes)")
        
        result = pdf_pipeline_service.process_and_index_pdf(
            project_id=projectId,
            filename=file.filename,
            file_content=content
        )
        
        if result.get("status") == "failed":
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to process PDF"))
            
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF upload API route failed: {e}")
        raise HTTPException(status_code=500, detail=f"PDF ingestion failed: {str(e)}")

@router.post("/rag-search", response_model=List[RAGContextResponse])
async def similarity_rag_search(request: RAGSearchRequest):
    """Retrieve matching context chunks from vector store based on query cosine similarity."""
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    try:
        collection_name = f"project_{request.projectId}"
        results = vector_store_service.similarity_search(
            collection_name=collection_name,
            query=request.query,
            limit=request.limit or 5
        )
        return results
    except Exception as e:
        logger.error(f"RAG Search API route failed: {e}")
        raise HTTPException(status_code=500, detail=f"RAG search failed: {str(e)}")

@router.get("/uploaded-pdfs")
async def get_uploaded_pdfs(projectId: str = Query(..., description="ID of the research project")):
    """Get list of all uploaded and processed PDF documents in a project's vector space."""
    try:
        collection_name = f"project_{projectId}"
        collection = vector_store_service.get_collection(collection_name)
        
        # Aggregate unique PDFs by querying the local JSON store documents directly
        # or querying all documents in the collection
        unique_pdfs = {}
        
        # Fetch directly from Chroma or Fallback store
        # By inspecting collection elements
        # For Fallback Vector Collection:
        if hasattr(collection, "documents"):
            for idx, metadata in enumerate(collection.metadatas):
                source = metadata.get("source")
                if source:
                    if source not in unique_pdfs:
                        unique_pdfs[source] = {
                            "filename": source,
                            "chunks_count": metadata.get("total_chunks", 0),
                            "status": "processed"
                        }
        else:
            # For Chroma collection client, query all data
            results = collection.get()
            if results and results.get("metadatas"):
                for metadata in results["metadatas"]:
                    if metadata:
                        source = metadata.get("source")
                        if source:
                            if source not in unique_pdfs:
                                unique_pdfs[source] = {
                                    "filename": source,
                                    "chunks_count": metadata.get("total_chunks", 0),
                                    "status": "processed"
                                }
                                
        return list(unique_pdfs.values())
    except Exception as e:
        logger.error(f"List uploaded PDFs API route failed: {e}")
        return []
