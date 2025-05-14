from sqlalchemy.orm import Session
from . import models, schemas


# Cat CRUD operations
def get_cats(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Cat).offset(skip).limit(limit).all()


def get_cat(db: Session, cat_id: int):
    return db.query(models.Cat).filter(models.Cat.id == cat_id).first()


def create_cat(db: Session, cat: schemas.CatCreate):
    db_cat = models.Cat(name=cat.name, target_weight=cat.target_weight)
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat


def update_cat(db: Session, cat_id: int, cat: schemas.CatCreate):
    db_cat = get_cat(db, cat_id)
    if db_cat:
        db_cat.name = cat.name
        db_cat.target_weight = cat.target_weight
        db.commit()
        db.refresh(db_cat)
    return db_cat


def delete_cat(db: Session, cat_id: int):
    db_cat = get_cat(db, cat_id)
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


def delete_weight_record(db: Session, record_id: int):
    db_record = db.query(models.WeightRecord).filter(models.WeightRecord.id == record_id).first()
    if db_record:
        db.delete(db_record)
        db.commit()
        return True
    return False


def get_cat_with_records(db: Session, cat_id: int):
    return db.query(models.Cat).filter(models.Cat.id == cat_id).first()