from sqlalchemy.orm import Session
from . import models


def generate_weight_plot(db: Session, cat_id: int):
    """Generate a JSON representation of a Plotly figure for cat weight over time"""
    
    # Get cat and its weight records
    cat = db.query(models.Cat).filter(models.Cat.id == cat_id).first()
    if not cat:
        return None
    
    # Get weight records sorted by date
    weight_records = db.query(models.WeightRecord).filter(
        models.WeightRecord.cat_id == cat_id
    ).order_by(models.WeightRecord.date).all()
    
    if not weight_records:
        return {
            "cat_id": cat.id,
            "name": cat.name,
            "dates": [],
            "weights": [],
            "target_weight": cat.target_weight
        }
    
    # Extract dates and weights
    dates = [record.date.strftime("%Y-%m-%d") for record in weight_records]
    weights = [record.cat_weight for record in weight_records]
    
    return {
        "cat_id": cat.id,
        "name": cat.name,
        "dates": dates,
        "weights": weights,
        "target_weight": cat.target_weight
    }