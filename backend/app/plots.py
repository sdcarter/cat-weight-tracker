from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional, Dict, List, Union, Any
import logging
from . import models

# Configure logging
logger = logging.getLogger(__name__)

def generate_weight_plot(db: Session, cat_id: int) -> Optional[Dict[str, Union[int, str, List[Any], float]]]:
    """Generate a JSON representation of a Plotly figure for cat weight over time.
    
    Args:
        db: Database session
        cat_id: ID of the cat to generate plot for
        
    Returns:
        Dictionary with plot data or None if cat not found or error occurs
    """
    try:
        # Input validation
        if not isinstance(cat_id, int) or cat_id <= 0:
            logger.error(f"Invalid cat_id: {cat_id}")
            return None
            
        # Get cat and its weight records
        cat = db.query(models.Cat).filter(models.Cat.id == cat_id).first()
        if not cat:
            logger.warning(f"Cat not found for plot generation: {cat_id}")
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
        
        # Extract dates and weights with validation
        dates = []
        weights = []
        for record in weight_records:
            if record.date and record.cat_weight is not None:
                dates.append(record.date.strftime("%Y-%m-%d"))
                weights.append(record.cat_weight)
        
        return {
            "cat_id": cat.id,
            "name": cat.name,
            "dates": dates,
            "weights": weights,
            "target_weight": cat.target_weight
        }
    except SQLAlchemyError as e:
        logger.error(f"Database error generating plot for cat {cat_id}: {str(e)}")
        db.rollback()
        return None
    except Exception as e:
        logger.error(f"Error generating plot for cat {cat_id}: {str(e)}")
        return None