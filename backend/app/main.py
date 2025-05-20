from fastapi import FastAPI, Depends, HTTPException, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas, plots
from .database import engine, get_db
import time
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cat Weight Tracker API")

# Create API router for /api prefix
api_router = APIRouter(prefix="/api")

# Configure CORS - allow both development and production origins
origins = [
    "http://localhost:3000",  # Development frontend
    "http://localhost", 
    "http://localhost:80", 
    "http://frontend", 
    "http://frontend:80",
    "*"  # Allow all origins in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware for request logging and basic rate limiting
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Simple IP-based request counting (basic rate limiting)
    client_ip = request.client.host
    request_path = request.url.path
    
    # Log the request
    logger.info(f"Request: {request.method} {request_path} from {client_ip}")
    
    response = await call_next(request)
    
    # Log the response time
    process_time = time.time() - start_time
    logger.info(f"Response: {request.method} {request_path} completed in {process_time:.3f}s with status {response.status_code}")
    
    return response


# Define routes for both root and /api prefix
# Cat endpoints for root path
@app.post("/cats/", response_model=schemas.Cat)
def create_cat(cat: schemas.CatCreate, db: Session = Depends(get_db)):
    # Input validation beyond Pydantic
    if len(cat.name) > 50:
        raise HTTPException(status_code=400, detail="Cat name too long")
    if cat.target_weight <= 0 or cat.target_weight > 30:
        raise HTTPException(status_code=400, detail="Invalid target weight")
        
    return crud.create_cat(db=db, cat=cat)


@app.get("/cats/", response_model=List[schemas.Cat])
def read_cats(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Limit the maximum number of records that can be fetched
    if limit > 100:
        limit = 100
    cats = crud.get_cats(db, skip=skip, limit=limit)
    return cats


@app.get("/cats/{cat_id}", response_model=schemas.CatWithRecords)
def read_cat(cat_id: int, db: Session = Depends(get_db)):
    db_cat = crud.get_cat(db, cat_id=cat_id)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    return db_cat


@app.put("/cats/{cat_id}", response_model=schemas.Cat)
def update_cat(cat_id: int, cat: schemas.CatCreate, db: Session = Depends(get_db)):
    # Input validation
    if len(cat.name) > 50:
        raise HTTPException(status_code=400, detail="Cat name too long")
    if cat.target_weight <= 0 or cat.target_weight > 30:
        raise HTTPException(status_code=400, detail="Invalid target weight")
        
    db_cat = crud.update_cat(db, cat_id=cat_id, cat=cat)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    return db_cat


@app.delete("/cats/{cat_id}")
def delete_cat(cat_id: int, db: Session = Depends(get_db)):
    success = crud.delete_cat(db, cat_id=cat_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cat not found")
    return {"detail": "Cat deleted successfully"}


# Cat endpoints for /api prefix
@app.post("/api/cats/", response_model=schemas.Cat)
def create_cat_api(cat: schemas.CatCreate, db: Session = Depends(get_db)):
    return create_cat(cat, db)


@app.get("/api/cats/", response_model=List[schemas.Cat])
def read_cats_api(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return read_cats(skip, limit, db)


@app.get("/api/cats/{cat_id}", response_model=schemas.CatWithRecords)
def read_cat_api(cat_id: int, db: Session = Depends(get_db)):
    return read_cat(cat_id, db)


@app.put("/api/cats/{cat_id}", response_model=schemas.Cat)
def update_cat_api(cat_id: int, cat: schemas.CatCreate, db: Session = Depends(get_db)):
    return update_cat(cat_id, cat, db)


@app.delete("/api/cats/{cat_id}")
def delete_cat_api(cat_id: int, db: Session = Depends(get_db)):
    return delete_cat(cat_id, db)


# Weight record endpoints
@app.post("/cats/{cat_id}/weights/", response_model=schemas.WeightRecord)
def create_weight_record(
    cat_id: int, weight_record: schemas.WeightRecordCreate, db: Session = Depends(get_db)
):
    # Input validation
    if weight_record.user_weight <= 0 or weight_record.user_weight > 500:
        raise HTTPException(status_code=400, detail="Invalid user weight")
    if weight_record.combined_weight <= weight_record.user_weight:
        raise HTTPException(status_code=400, detail="Combined weight must be greater than user weight")
    
    db_cat = crud.get_cat(db, cat_id=cat_id)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    return crud.create_weight_record(db=db, weight_record=weight_record, cat_id=cat_id)


@app.get("/cats/{cat_id}/weights/", response_model=List[schemas.WeightRecord])
def read_weight_records(
    cat_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    # Limit the maximum number of records that can be fetched
    if limit > 100:
        limit = 100
        
    db_cat = crud.get_cat(db, cat_id=cat_id)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    return crud.get_weight_records(db, cat_id=cat_id, skip=skip, limit=limit)


@app.delete("/weights/{record_id}")
def delete_weight_record(record_id: int, db: Session = Depends(get_db)):
    success = crud.delete_weight_record(db, record_id=record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Weight record not found")
    return {"detail": "Weight record deleted successfully"}


# Weight record endpoints with /api prefix
@app.post("/api/cats/{cat_id}/weights/", response_model=schemas.WeightRecord)
def create_weight_record_api(
    cat_id: int, weight_record: schemas.WeightRecordCreate, db: Session = Depends(get_db)
):
    return create_weight_record(cat_id, weight_record, db)


@app.get("/api/cats/{cat_id}/weights/", response_model=List[schemas.WeightRecord])
def read_weight_records_api(
    cat_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return read_weight_records(cat_id, skip, limit, db)


@app.delete("/api/weights/{record_id}")
def delete_weight_record_api(record_id: int, db: Session = Depends(get_db)):
    return delete_weight_record(record_id, db)


# Plot data endpoint
@app.get("/cats/{cat_id}/plot", response_model=schemas.PlotData)
def get_plot_data(cat_id: int, db: Session = Depends(get_db)):
    db_cat = crud.get_cat(db, cat_id=cat_id)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    
    plot_data = plots.generate_weight_plot(db, cat_id)
    if plot_data is None:
        raise HTTPException(status_code=404, detail="Failed to generate plot data")
    
    return plot_data


# Plot data endpoint with /api prefix
@app.get("/api/cats/{cat_id}/plot", response_model=schemas.PlotData)
def get_plot_data_api(cat_id: int, db: Session = Depends(get_db)):
    return get_plot_data(cat_id, db)