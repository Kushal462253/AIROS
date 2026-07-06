"""Vector database service utilizing ChromaDB with pure-Python TF-IDF mathematical fallback."""

import logging
import os
import math
import re
import json
from typing import Any, Dict, List, Optional, Tuple
from app.core.config import settings

logger = logging.getLogger(__name__)

# --- Pure-Python Mathematical Fallback Vector Database ---

class FallbackVectorCollection:
    """A pure-python vector collection implementing TF-IDF and Cosine Similarity."""

    def __init__(self, name: str, filepath: str):
        self.name = name
        self.filepath = filepath
        self.documents: List[str] = []
        self.ids: List[str] = []
        self.metadatas: List[Dict[str, Any]] = []
        self.vocab: Dict[str, int] = {}
        self.idf: List[float] = []
        self.tfidf_vectors: List[List[float]] = []
        self._load()

    def _tokenize(self, text: str) -> List[str]:
        words = re.findall(r"\b[a-zA-Z0-9_]+\b", text.lower())
        stopwords = {
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent",
            "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
            "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont",
            "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have",
            "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him",
            "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt",
            "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not",
            "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
            "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such",
            "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres",
            "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too",
            "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "werent", "what",
            "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys",
            "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours",
            "yourself", "yourselves"
        }
        return [w for w in words if w not in stopwords]

    def _load(self) -> None:
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.documents = data.get("documents", [])
                    self.ids = data.get("ids", [])
                    self.metadatas = data.get("metadatas", [])
                self._recalculate_vectors()
            except Exception as e:
                logger.error(f"Failed to load fallback vector db: {e}")

    def _save(self) -> None:
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        try:
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump({
                    "documents": self.documents,
                    "ids": self.ids,
                    "metadatas": self.metadatas
                }, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Failed to save fallback vector db: {e}")

    def _recalculate_vectors(self) -> None:
        if not self.documents:
            self.vocab = {}
            self.idf = []
            self.tfidf_vectors = []
            return

        # 1. Build Vocab
        tokenized_docs = [self._tokenize(doc) for doc in self.documents]
        vocab_set = set()
        for doc in tokenized_docs:
            vocab_set.update(doc)
        
        self.vocab = {word: idx for idx, word in enumerate(sorted(vocab_set))}
        N = len(self.documents)
        
        # 2. Calculate IDF
        self.idf = [0.0] * len(self.vocab)
        for term, t_idx in self.vocab.items():
            df = sum(1 for doc in tokenized_docs if term in doc)
            self.idf[t_idx] = math.log((1 + N) / (1 + df)) + 1.0

        # 3. Calculate TF-IDF Vectors
        self.tfidf_vectors = []
        for doc in tokenized_docs:
            self.tfidf_vectors.append(self._vectorize(doc))

    def _vectorize(self, tokens: List[str]) -> List[float]:
        vector = [0.0] * len(self.vocab)
        if not tokens:
            return vector
            
        # Count term frequencies
        tfs = {}
        for token in tokens:
            if token in self.vocab:
                tfs[token] = tfs.get(token, 0) + 1

        # Multiply by IDF
        for term, count in tfs.items():
            t_idx = self.vocab[term]
            vector[t_idx] = count * self.idf[t_idx]
            
        # L2 Normalization
        sq_sum = sum(x*x for x in vector)
        if sq_sum > 0:
            norm = math.sqrt(sq_sum)
            vector = [x / norm for x in vector]
            
        return vector

    def add(
        self,
        ids: List[str],
        documents: List[str],
        metadatas: List[Dict[str, Any]]
    ) -> None:
        for idx, doc_id in enumerate(ids):
            if doc_id in self.ids:
                # Update existing
                e_idx = self.ids.index(doc_id)
                self.documents[e_idx] = documents[idx]
                self.metadatas[e_idx] = metadatas[idx]
            else:
                self.ids.append(doc_id)
                self.documents.append(documents[idx])
                self.metadatas.append(metadatas[idx])
                
        self._recalculate_vectors()
        self._save()

    def query(
        self,
        query_text: str,
        n_results: int = 5
    ) -> Dict[str, Any]:
        if not self.documents:
            return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}

        query_tokens = self._tokenize(query_text)
        query_vector = self._vectorize(query_tokens)

        # Check if query vector is empty
        if sum(query_vector) == 0:
            # Fallback to simple keyword search
            scores = []
            for idx, doc in enumerate(self.documents):
                matching = sum(1 for t in query_tokens if t in doc.lower())
                scores.append((idx, matching))
            # Sort by keyword matches descending
            scores.sort(key=lambda x: x[1], reverse=True)
        else:
            # Cosine similarity score
            scores = []
            for idx, doc_vector in enumerate(self.tfidf_vectors):
                # Since vectors are L2-normalized, cosine similarity is dot product
                sim = sum(query_vector[i] * doc_vector[i] for i in range(len(self.vocab)))
                scores.append((idx, sim))
            scores.sort(key=lambda x: x[1], reverse=True)

        top_scores = scores[:n_results]
        
        ids_out = []
        docs_out = []
        meta_out = []
        dist_out = [] # We use distance as (1 - similarity)
        
        for idx, score in top_scores:
            ids_out.append(self.ids[idx])
            docs_out.append(self.documents[idx])
            meta_out.append(self.metadatas[idx])
            dist_out.append(float(1.0 - score)) # 0.0 distance = exact match

        return {
            "ids": [ids_out],
            "documents": [docs_out],
            "metadatas": [meta_out],
            "distances": [dist_out]
        }

class FallbackVectorClient:
    """Fallback client mimicking ChromaDB Client interface."""

    def __init__(self, db_path: str):
        self.db_path = db_path

    def get_or_create_collection(self, name: str) -> FallbackVectorCollection:
        filepath = os.path.join(self.db_path, f"{name}.json")
        return FallbackVectorCollection(name, filepath)


# --- Modular Unified Adapter wrapper ---

class VectorStoreService:
    """ChromaDB Service wrapper with robust mathematical pure-Python fallback."""

    def __init__(self) -> None:
        self.db_path = settings.CHROMADB_PATH
        self.chroma_client = None
        self.use_fallback = False
        self._initialize_client()

    def _initialize_client(self) -> None:
        try:
            import chromadb
            # Try initializing real ChromaDB
            os.makedirs(self.db_path, exist_ok=True)
            self.chroma_client = chromadb.PersistentClient(path=self.db_path)
            logger.info("ChromaDB Persistent Client initialized successfully.")
        except ImportError:
            logger.warning("chromadb library is not installed. Loading TF-IDF mathematical fallback vector store.")
            self.use_fallback = True
        except Exception as e:
            logger.error(f"Error loading ChromaDB: {e}. Loading fallback vector store.")
            self.use_fallback = True

        if self.use_fallback:
            self.chroma_client = FallbackVectorClient(self.db_path) # type: ignore

    def get_collection(self, name: str) -> Any:
        """Returns collection. Automatically routes to fallback if needed."""
        # Clean collection name (alphanumeric + underscores only)
        cleaned_name = re.sub(r"[^a-zA-Z0-9_]", "_", name)
        # Chroma requires length 3-63, starts with alphanumeric
        if len(cleaned_name) < 3:
            cleaned_name = f"col_{cleaned_name}"
        cleaned_name = cleaned_name[:63]
        
        return self.chroma_client.get_or_create_collection(cleaned_name) # type: ignore

    def add_documents(
        self,
        collection_name: str,
        ids: List[str],
        documents: List[str],
        metadatas: List[Dict[str, Any]]
    ) -> None:
        """Stores text documents, generating embeddings (or TF-IDF) in the collection."""
        try:
            collection = self.get_collection(collection_name)
            collection.add(
                ids=ids,
                documents=documents,
                metadatas=metadatas
            )
            logger.info(f"Successfully added {len(documents)} document chunks to vector collection '{collection_name}'")
        except Exception as e:
            logger.error(f"Failed to add documents to vector store: {e}")
            raise

    def similarity_search(
        self,
        collection_name: str,
        query: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Queries the collection using vector cosine similarity or TF-IDF metric."""
        try:
            collection = self.get_collection(collection_name)
            results = collection.query(
                query_text=query,
                n_results=limit
            )
            
            formatted_results = []
            if results and results.get("documents") and len(results["documents"][0]) > 0:
                for i in range(len(results["documents"][0])):
                    doc = results["documents"][0][i]
                    metadata = results["metadatas"][0][i]
                    doc_id = results["ids"][0][i]
                    distance = results["distances"][0][i]
                    
                    # Convert distance to similarity score
                    score = max(0.0, min(1.0, 1.0 - distance))
                    
                    formatted_results.append({
                        "id": doc_id,
                        "document": doc,
                        "metadata": metadata,
                        "score": round(score, 3)
                    })
                    
            return formatted_results
        except Exception as e:
            logger.error(f"Similarity search query failed: {e}")
            return []

vector_store_service = VectorStoreService()
