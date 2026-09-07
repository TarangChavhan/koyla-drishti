import logging
from typing import Any, Dict, List, Optional
from datetime import datetime, timezone
from app.core.config import settings

logger = logging.getLogger("koyla_drishti.db.mongo")

class InMemoryMongoFallback:
    """Thread-safe in-memory fallback for MongoDB collections when MongoDB server is offline."""
    def __init__(self):
        self.collections: Dict[str, List[Dict[str, Any]]] = {
            "ai_alerts": [],
            "ppe_detections": [],
            "hazard_detections": [],
            "document_extractions": [],
            "telemetry_history": [],
            "model_logs": []
        }

    def get_collection(self, name: str):
        if name not in self.collections:
            self.collections[name] = []
        return self

    def insert_one(self, collection_name: str, document: Dict[str, Any]) -> str:
        if collection_name not in self.collections:
            self.collections[collection_name] = []
        doc = document.copy()
        if "_id" not in doc and "id" in doc:
            doc["_id"] = doc["id"]
        elif "_id" not in doc:
            doc["_id"] = f"{collection_name[:3]}_{len(self.collections[collection_name]) + 1}_{int(datetime.now().timestamp())}"
        doc.setdefault("created_at", datetime.now(timezone.utc).isoformat())
        self.collections[collection_name].append(doc)
        return str(doc["_id"])

    def find(self, collection_name: str, filter_dict: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        items = self.collections.get(collection_name, [])
        if not filter_dict:
            return list(reversed(items[-limit:]))
        
        results = []
        for item in reversed(items):
            match = True
            for k, v in filter_dict.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                results.append(item)
                if len(results) >= limit:
                    break
        return results

    def find_one(self, collection_name: str, filter_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        items = self.collections.get(collection_name, [])
        for item in items:
            match = True
            for k, v in filter_dict.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                return item
        return None

    def update_one(self, collection_name: str, filter_dict: Dict[str, Any], update_dict: Dict[str, Any]) -> bool:
        item = self.find_one(collection_name, filter_dict)
        if item:
            set_vals = update_dict.get("$set", update_dict)
            item.update(set_vals)
            item["updated_at"] = datetime.now(timezone.utc).isoformat()
            return True
        return False

class MongoDBManager:
    """Manages connection to MongoDB with graceful fallback to InMemory store."""
    def __init__(self):
        self.client = None
        self.db = None
        self.is_connected = False
        self.fallback = InMemoryMongoFallback()

    def connect(self):
        try:
            from pymongo import MongoClient
            self.client = MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=2000)
            # Ping database to verify connectivity
            self.client.admin.command('ping')
            self.db = self.client[settings.MONGODB_DB_NAME]
            self.is_connected = True
            logger.info(f"Connected to MongoDB Atlas: {settings.MONGODB_DB_NAME}")
        except Exception as e:
            self.is_connected = False
            logger.warning(f"MongoDB connection failed ({e}). Using resilient local in-memory event store.")

    def get_collection(self, name: str):
        if self.is_connected and self.db is not None:
            return self.db[name]
        return None

    # High-level helper methods that work seamlessly whether online or fallback
    def insert_document(self, collection_name: str, doc: Dict[str, Any]) -> str:
        if self.is_connected and self.db is not None:
            try:
                res = self.db[collection_name].insert_one(doc)
                return str(res.inserted_id)
            except Exception as e:
                logger.error(f"MongoDB insert failed ({e}), saving to fallback.")
        return self.fallback.insert_one(collection_name, doc)

    def find_documents(self, collection_name: str, filter_dict: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                cursor = self.db[collection_name].find(filter_dict or {}).sort("_id", -1).limit(limit)
                docs = []
                for d in cursor:
                    d["_id"] = str(d["_id"])
                    docs.append(d)
                return docs
            except Exception as e:
                logger.error(f"MongoDB find failed ({e}), reading from fallback.")
        return self.fallback.find(collection_name, filter_dict, limit)

    def find_one_document(self, collection_name: str, filter_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.db is not None:
            try:
                doc = self.db[collection_name].find_one(filter_dict)
                if doc:
                    doc["_id"] = str(doc["_id"])
                return doc
            except Exception as e:
                logger.error(f"MongoDB find_one failed ({e}), checking fallback.")
        return self.fallback.find_one(collection_name, filter_dict)

    def update_document(self, collection_name: str, filter_dict: Dict[str, Any], update_dict: Dict[str, Any]) -> bool:
        if self.is_connected and self.db is not None:
            try:
                if not any(k.startswith("$") for k in update_dict.keys()):
                    update_dict = {"$set": update_dict}
                res = self.db[collection_name].update_one(filter_dict, update_dict)
                return res.modified_count > 0 or res.matched_count > 0
            except Exception as e:
                logger.error(f"MongoDB update failed ({e}), updating in fallback.")
        return self.fallback.update_one(collection_name, filter_dict, update_dict)

mongo_db = MongoDBManager()
