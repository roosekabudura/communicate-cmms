from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(prefix="/engineers", tags=["Engineers"])

@router.get("/", response_model=List[schemas.EngineerDisplay])
def get_engineers(db: Session = Depends(database.get_db)):
    return db.query(models.Engineer).all()

@router.post("/", response_model=schemas.EngineerDisplay)
def create_engineer(eng: schemas.EngineerCreate, db: Session = Depends(database.get_db)):
    db_eng = models.Engineer(**eng.model_dump())
    db.add(db_eng)
    db.commit()
    db.refresh(db_eng)
    return db_eng

@router.delete("/{eng_id}")
def delete_engineer(eng_id: int, db: Session = Depends(database.get_db)):
    eng = db.query(models.Engineer).filter(models.Engineer.id == eng_id).first()
    if not eng:
        raise HTTPException(status_code=404, detail="Engineer not found")
    db.delete(eng)
    db.commit()
    return {"message": "Engineer deleted"}