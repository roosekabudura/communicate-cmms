from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, database

router = APIRouter(prefix="/work-orders", tags=["Work Orders"])

@router.get("/", response_model=List[schemas.WorkOrderDisplay])
def get_work_orders(db: Session = Depends(database.get_db)):
    return db.query(models.WorkOrder).all()

@router.post("/", response_model=schemas.WorkOrderDisplay)
def create_work_order(wo: schemas.WorkOrderCreate, db: Session = Depends(database.get_db)):
    db_wo = models.WorkOrder(**wo.model_dump())
    db.add(db_wo)
    db.commit()
    db.refresh(db_wo)
    return db_wo