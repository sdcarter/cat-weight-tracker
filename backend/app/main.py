from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas, plots
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cat Weight Tracker API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Cat endpoints
@app.post("/cats/", response_model=schemas.Cat)
def create_cat(cat: schemas.CatCreate, db: Session = Depends(get_db)):
    return crud.create_cat(db=db, cat=cat)


@app.get("/cats/", response_model=List[schemas.Cat])
def read_cats(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
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


# Weight record endpoints
@app.post("/cats/{cat_id}/weights/", response_model=schemas.WeightRecord)
def create_weight_record(
    cat_id: int, weight_record: schemas.WeightRecordCreate, db: Session = Depends(get_db)
):
    db_cat = crud.get_cat(db, cat_id=cat_id)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    return crud.create_weight_record(db=db, weight_record=weight_record, cat_id=cat_id)


@app.get("/cats/{cat_id}/weights/", response_model=List[schemas.WeightRecord])
def read_weight_records(
    cat_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
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