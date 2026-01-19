from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import engine, SessionLocal

# Rebuild tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS SETTINGS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- 🔐 AUTHENTICATION ROUTES (The Missing Part) ---
@app.post("/auth/login")
def login(data: dict):
    user_email = data.get("email")
    user_password = data.get("password")
    
    # ADMIN ACCOUNT: Full Access
    if user_email == "admin@communicate.com" and user_password == "admin123":
        return {
            "token": "admin-token", 
            "user": "System Admin", 
            "role": "admin"  # <--- This is the key
        }
    
    # STAFF ACCOUNT: Limited Access
    if user_email == "staff@communicate.com" and user_password == "staff123":
        return {
            "token": "staff-token", 
            "user": "Field Staff", 
            "role": "staff"  # <--- This is the key
        }

    raise HTTPException(status_code=401, detail="Invalid credentials")

# --- ASSET ROUTES ---
@app.post("/assets", response_model=schemas.AssetDisplay)
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(get_db)):
    db_asset = models.Asset(**asset.dict())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset
# Add this to your POST routes in main.py to see exactly what is failing
@app.post("/assets", response_model=schemas.AssetDisplay)
def create_asset(asset: schemas.AssetCreate, db: Session = Depends(get_db)):
    print(f"DEBUG: Received Asset Data: {asset.dict()}") # THIS WILL TELL US THE TRUTH
    db_asset = models.Asset(**asset.dict())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@app.get("/assets", response_model=List[schemas.AssetDisplay])
def get_assets(db: Session = Depends(get_db)):
    return db.query(models.Asset).all()

@app.delete("/assets/{asset_id}")
def delete_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    db.delete(asset)
    db.commit()
    return {"message": "Deleted successfully"}

# --- PREVENTIVE MAINTENANCE ROUTES ---
@app.get("/pm-schedules", response_model=List[schemas.PMDisplay])
def get_pm_schedules(db: Session = Depends(get_db)):
    return db.query(models.PMSchedule).all()

@app.post("/pm-schedules", response_model=schemas.PMDisplay)
def create_pm_schedule(pm: schemas.PMCreate, db: Session = Depends(get_db)):
    db_pm = models.PMSchedule(**pm.dict())
    db.add(db_pm)
    db.commit()
    db.refresh(db_pm)
    return db_pm

# --- WORK ORDER ROUTES ---
@app.get("/work-orders", response_model=List[schemas.WorkOrderDisplay])
def get_work_orders(db: Session = Depends(get_db)):
    return db.query(models.WorkOrder).all()

@app.post("/work-orders", response_model=schemas.WorkOrderDisplay)
def create_work_order(wo: schemas.WorkOrderCreate, db: Session = Depends(get_db)):
    db_wo = models.WorkOrder(**wo.dict())
    db.add(db_wo)
    db.commit()
    db.refresh(db_wo)
    return db_wo

# --- ENGINEER ROUTES ---
@app.get("/engineers", response_model=List[schemas.EngineerDisplay])
def get_engineers(db: Session = Depends(get_db)):
    return db.query(models.Engineer).all()

@app.post("/engineers", response_model=schemas.EngineerDisplay)
def create_engineer(engineer: schemas.EngineerCreate, db: Session = Depends(get_db)):
    db_eng = models.Engineer(**engineer.dict())
    db.add(db_eng)
    db.commit()
    db.refresh(db_eng)
    return db_eng
@app.get("/engineers/available")
def get_available_engineers(db: Session = Depends(get_db)):
    # This filters the database for ONLY 'Available' status
    return db.query(models.Engineer).filter(models.Engineer.status == "Available").all()
    
# --- INVENTORY ROUTES ---
@app.get("/inventory", response_model=List[schemas.InventoryDisplay])
def get_inventory(db: Session = Depends(get_db)):
    return db.query(models.Inventory).all()

@app.post("/inventory", response_model=schemas.InventoryDisplay)
def create_inventory(item: schemas.InventoryCreate, db: Session = Depends(get_db)):
    db_item = models.Inventory(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# --- DASHBOARD STATS ROUTE ---
@app.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # This route gathers all counts in one single trip to the database
    return {
        "assets": db.query(models.Asset).count(),
        "work_orders": db.query(models.WorkOrder).count(),
        "engineers": db.query(models.Engineer).count(),
        "low_stock": db.query(models.Inventory).filter(models.Inventory.quantity < 5).count()
    }

# Put this at the end of main.py
@app.patch("/engineers/{engineer_id}")
def update_engineer_status(engineer_id: int, data: dict, db: Session = Depends(get_db)):
    # 1. Find the engineer in the database
    engineer = db.query(models.Engineer).filter(models.Engineer.id == engineer_id).first()
    
    # 2. Update the availability field
    if "availability" in data:
        engineer.availability = data["availability"]
    
    # 3. Save it
    db.commit()
    return {"message": "Success"}
