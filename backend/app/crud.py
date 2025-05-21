from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash


# User CRUD operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Cat CRUD operations
def get_cats(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Cat).filter(models.Cat.user_id == user_id).offset(skip).limit(limit).all()


def get_cat(db: Session, cat_id: int, user_id: int = None):
    query = db.query(models.Cat).filter(models.Cat.id == cat_id)
    if user_id is not None:
        query = query.filter(models.Cat.user_id == user_id)
    return query.first()


def create_cat(db: Session, cat: schemas.CatCreate, user_id: int):
    db_cat = models.Cat(name=cat.name, target_weight=cat.target_weight, user_id=user_id)
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat


def update_cat(db: Session, cat_id: int, cat: schemas.CatCreate, user_id: int):
    db_cat = get_cat(db, cat_id, user_id)
    if db_cat:
        db_cat.name = cat.name
        db_cat.target_weight = cat.target_weight
        db.commit()
        db.refresh(db_cat)
    return db_cat


def delete_cat(db: Session, cat_id: int, user_id: int):
    db_cat = get_cat(db, cat_id, user_id)
    if db_cat:
        db.delete(db_cat)
        db.commit()
        return True
    return False


# Weight record CRUD operations
def get_weight_records(db: Session, cat_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.WeightRecord).filter(
        models.WeightRecord.cat_id == cat_id
    ).offset(skip).limit(limit).all()


def create_weight_record(db: Session, weight_record: schemas.WeightRecordCreate, cat_id: int):
    # Calculate cat weight
    cat_weight = weight_record.combined_weight - weight_record.user_weight
    
    db_record = models.WeightRecord(
        date=weight_record.date,
        user_weight=weight_record.user_weight,
        combined_weight=weight_record.combined_weight,
        cat_weight=cat_weight,
        cat_id=cat_id
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def delete_weight_record(db: Session, record_id: int, user_id: int = None):
    query = db.query(models.WeightRecord).filter(models.WeightRecord.id == record_id)
    
    # If user_id is provided, ensure the weight record belongs to a cat owned by this user
    if user_id is not None:
        query = query.join(models.Cat).filter(models.Cat.user_id == user_id)
        
    db_record = query.first()
    if db_record:
        db.delete(db_record)
        db.commit()
        return True
    return False


def get_cat_with_records(db: Session, cat_id: int, user_id: int = None):
    query = db.query(models.Cat).filter(models.Cat.id == cat_id)
    if user_id is not None:
        query = query.filter(models.Cat.user_id == user_id)
    return query.first()


# Create a default user and associate existing cats with it
def create_default_user(db: Session):
    # Check if default user already exists
    default_user = get_user_by_username(db, "demo")
    if default_user:
        return default_user
        
    # Create default user
    default_user = models.User(
        username="demo",
        email="demo@example.com",
        hashed_password=get_password_hash("password"),
        is_active=True
    )
    db.add(default_user)
    db.commit()
    db.refresh(default_user)
    
    # Associate existing cats with default user
    orphan_cats = db.query(models.Cat).filter(models.Cat.user_id == None).all()
    for cat in orphan_cats:
        cat.user_id = default_user.id
    
    db.commit()
    return default_user