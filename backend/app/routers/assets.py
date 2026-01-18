from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, database

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.get("/", response_model=List[schemas.AssetDisplay])
def get_assets(db: Session = Depends(database.get_db)):
    return db.query(models.Asset).all()

@router.post("/", response_model=schemas.AssetDisplay)
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(database.get_db)):
    db_asset = models.Asset(**asset.model_dump())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset