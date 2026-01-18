from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.get("/", response_model=List[schemas.InventoryDisplay])
def get_all_items(db: Session = Depends(get_db)):
    return db.query(models.Inventory).all()

@router.post("/", response_model=schemas.InventoryDisplay)
def create_item(item: schemas.InventoryCreate, db: Session = Depends(get_db)):
    new_item = models.Inventory(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Inventory).filter(models.Inventory.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}