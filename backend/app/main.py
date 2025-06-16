from fastapi import FastAPI, Depends, HTTPException, Request, APIRouter, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import timedelta
from contextlib import asynccontextmanager
from . import crud, models, schemas, plots, auth
from .database import engine, get_db
from .config import settings
import time
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Define lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create default user if needed
    db = next(get_db())
    crud.create_default_user(db)
    yield
    # Shutdown: Nothing to do here

# Create FastAPI app with lifespan
app = FastAPI(title="Cat Weight Tracker API", lifespan=lifespan)

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
    
    # Sanitize path for logging (CWE-117)
    request_path = request.url.path
    # Limit path length to prevent log injection
    if len(request_path) > 100:
        request_path = request_path[:97] + "..."
    
    # Sanitize method for logging (CWE-117)
    request_method = request.method
    if not request_method.isalpha() or len(request_method) > 10:
        request_method = "INVALID"
    
    # Log the request with sanitized values
    logger.info("Request: %s %s", request_method, request_path)  # Use %s placeholders instead of f-string
    
    response = await call_next(request)
    
    # Log the response time with sanitized values
    process_time = time.time() - start_time
    logger.info("Response: %s %s completed in %.3fs with status %d",
                request_method, request_path, process_time, response.status_code)
    
    return response


# Health check endpoint for root path
@app.get("/")
def health_check() -> Dict[str, str]:
    """
    Health check endpoint for the root path.
    This is used by the GCP load balancer to check if the service is healthy.
    """
    return {"status": "ok"}


# Authentication endpoints
@app.post("/auth/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if registration is enabled
    if not settings.REGISTRATION_ENABLED:
        raise HTTPException(status_code=403, detail="Registration is currently disabled")
    
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_user(db=db, user=user)


@app.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/auth/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user


@app.get("/auth/users/me/cats", response_model=List[schemas.Cat])
def read_own_cats(
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    cats = crud.get_cats(db, user_id=current_user.id, skip=skip, limit=limit)
    return cats


# Cat endpoints for root path
@app.post("/cats/", response_model=schemas.Cat)
def create_cat(
    cat: schemas.CatCreate, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Input validation beyond Pydantic
    if len(cat.name) > 50:
        raise HTTPException(status_code=400, detail="Cat name too long")
    if cat.target_weight <= 0 or cat.target_weight > 30:
        raise HTTPException(status_code=400, detail="Invalid target weight")
        
    return crud.create_cat(db=db, cat=cat, user_id=current_user.id)


@app.get("/cats/", response_model=List[schemas.Cat])
def read_cats(
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Limit the maximum number of records that can be fetched
    if limit > 100:
        limit = 100
    cats = crud.get_cats(db, user_id=current_user.id, skip=skip, limit=limit)
    return cats


@app.get("/cats/{cat_id}", response_model=schemas.CatWithRecords)
def read_cat(
    cat_id: int, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    db_cat = crud.get_cat(db, cat_id=cat_id, user_id=current_user.id)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    return db_cat


@app.put("/cats/{cat_id}", response_model=schemas.Cat)
def update_cat(
    cat_id: int, 
    cat: schemas.CatCreate, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Input validation
    if len(cat.name) > 50:
        raise HTTPException(status_code=400, detail="Cat name too long")
    if cat.target_weight <= 0 or cat.target_weight > 30:
        raise HTTPException(status_code=400, detail="Invalid target weight")
        
    db_cat = crud.update_cat(db, cat_id=cat_id, cat=cat, user_id=current_user.id)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    return db_cat


@app.delete("/cats/{cat_id}")
def delete_cat(
    cat_id: int, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_cat(db, cat_id=cat_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Cat not found")
    return {"detail": "Cat deleted successfully"}


# Cat endpoints for /api prefix
@app.post("/api/cats/", response_model=schemas.Cat)
def create_cat_api(
    cat: schemas.CatCreate, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return create_cat(cat, current_user, db)


@app.get("/api/cats/", response_model=List[schemas.Cat])
def read_cats_api(
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return read_cats(skip, limit, current_user, db)


@app.get("/api/cats/{cat_id}", response_model=schemas.CatWithRecords)
def read_cat_api(
    cat_id: int, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return read_cat(cat_id, current_user, db)


@app.put("/api/cats/{cat_id}", response_model=schemas.Cat)
def update_cat_api(
    cat_id: int, 
    cat: schemas.CatCreate, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return update_cat(cat_id, cat, current_user, db)


@app.delete("/api/cats/{cat_id}")
def delete_cat_api(
    cat_id: int, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return delete_cat(cat_id, current_user, db)


# Weight record endpoints
@app.post("/cats/{cat_id}/weights/", response_model=schemas.WeightRecord)
def create_weight_record(
    cat_id: int, 
    weight_record: schemas.WeightRecordCreate, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Input validation
    if weight_record.user_weight <= 0 or weight_record.user_weight > 500:
        raise HTTPException(status_code=400, detail="Invalid user weight")
    if weight_record.combined_weight <= weight_record.user_weight:
        raise HTTPException(status_code=400, detail="Combined weight must be greater than user weight")
    
    db_cat = crud.get_cat(db, cat_id=cat_id, user_id=current_user.id)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    return crud.create_weight_record(db=db, weight_record=weight_record, cat_id=cat_id)


@app.get("/cats/{cat_id}/weights/", response_model=List[schemas.WeightRecord])
def read_weight_records(
    cat_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    # Limit the maximum number of records that can be fetched
    if limit > 100:
        limit = 100
        
    db_cat = crud.get_cat(db, cat_id=cat_id, user_id=current_user.id)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    return crud.get_weight_records(db, cat_id=cat_id, skip=skip, limit=limit)


@app.delete("/weights/{record_id}")
def delete_weight_record(
    record_id: int, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_weight_record(db, record_id=record_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Weight record not found")
    return {"detail": "Weight record deleted successfully"}


# Weight record endpoints with /api prefix
@app.post("/api/cats/{cat_id}/weights/", response_model=schemas.WeightRecord)
def create_weight_record_api(
    cat_id: int, 
    weight_record: schemas.WeightRecordCreate, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return create_weight_record(cat_id, weight_record, current_user, db)


@app.get("/api/cats/{cat_id}/weights/", response_model=List[schemas.WeightRecord])
def read_weight_records_api(
    cat_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return read_weight_records(cat_id, skip, limit, current_user, db)


@app.delete("/api/weights/{record_id}")
def delete_weight_record_api(
    record_id: int, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return delete_weight_record(record_id, current_user, db)


# Plot data endpoint
@app.get("/cats/{cat_id}/plot", response_model=schemas.PlotData)
def get_plot_data(
    cat_id: int, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    db_cat = crud.get_cat(db, cat_id=cat_id, user_id=current_user.id)
    if db_cat is None:
        raise HTTPException(status_code=404, detail="Cat not found")
    
    plot_data = plots.generate_weight_plot(db, cat_id)
    if plot_data is None:
        raise HTTPException(status_code=404, detail="Failed to generate plot data")
    
    return plot_data


# Plot data endpoint with /api prefix
@app.get("/api/cats/{cat_id}/plot", response_model=schemas.PlotData)
def get_plot_data_api(
    cat_id: int, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return get_plot_data(cat_id, current_user, db)


# Authentication endpoints with /api prefix
@app.post("/api/auth/register", response_model=schemas.User)
def register_user_api(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return register_user(user, db)

# Registration status endpoint
@app.get("/auth/registration-status")
def get_registration_status():
    return {"enabled": settings.REGISTRATION_ENABLED}

@app.get("/api/auth/registration-status")
def get_registration_status_api():
    return get_registration_status()
    
# User profile endpoints
@app.put("/auth/me", response_model=schemas.User)
def update_user_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    updated_user = crud.update_user(db, current_user.id, user_update)
    if not updated_user:
        raise HTTPException(
            status_code=400, 
            detail="Username or email already taken"
        )
    return updated_user

@app.put("/auth/me/password")
def change_password(
    password_change: schemas.UserPasswordChange,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    success = crud.change_user_password(
        db, 
        current_user.id, 
        password_change.current_password, 
        password_change.new_password
    )
    if not success:
        raise HTTPException(
            status_code=400, 
            detail="Current password is incorrect"
        )
    return {"detail": "Password changed successfully"}

# API prefix versions of user profile endpoints
@app.put("/api/auth/me", response_model=schemas.User)
def update_user_profile_api(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return update_user_profile(user_update, current_user, db)

@app.put("/api/auth/me/password")
def change_password_api(
    password_change: schemas.UserPasswordChange,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return change_password(password_change, current_user, db)


@app.post("/api/auth/login", response_model=schemas.Token)
def login_for_access_token_api(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login_for_access_token(form_data, db)


@app.get("/api/auth/me", response_model=schemas.User)
def read_users_me_api(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user


@app.get("/api/auth/users/me/cats", response_model=List[schemas.Cat])
def read_own_cats_api(
    skip: int = 0, 
    limit: int = 100, 
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    return read_own_cats(skip, limit, current_user, db)