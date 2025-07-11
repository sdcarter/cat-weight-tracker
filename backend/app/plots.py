import logging
from typing import Any, Dict, List, Optional, Union

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from . import models

# Configure logging
logger = logging.getLogger(__name__)


def generate_weight_plot(
        db: Session, cat_id: int) -> Optional[Dict[str, Union[int, str, List[Any], float]]]:
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
            # Avoid logging sensitive data (CWE-117)
            logger.error("Invalid cat_id format")
            return None

        # Get cat and its weight records using ORM methods (CWE-89)
        cat = db.query(models.Cat).filter(models.Cat.id == cat_id).first()
        if not cat:
            # Avoid logging sensitive data (CWE-117)
            logger.warning("Cat not found for plot generation")
            return None

        # Get weight records sorted by date using ORM methods (CWE-89)
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
    except SQLAlchemyError:
        # Avoid logging sensitive data (CWE-117)
        logger.error("Database error generating plot")
        db.rollback()
        return None
    except Exception:
        # Avoid logging sensitive data (CWE-117)
        logger.error("Error generating plot")
        return None
