from pydantic import BaseModel
from typing import Optional

# ASSET SCHEMAS
class AssetBase(BaseModel):
    name: str
    category: str
    nature: str
    criticality: str
    status: str
    condition_score: str
    site: str
    manufacturer: str
    purchase_date: str
    warranty_expiry: str
    assigned_team: str

class AssetCreate(AssetBase):
    pass

class AssetDisplay(AssetBase):
    id: int
    asset_id: str
    class Config:
        from_attributes = True

# WORK ORDER SCHEMAS
class WorkOrderBase(BaseModel):
    origin: str
    priority: str
    asset_id_link: str
    site_id: str
    sla_deadline: str
    service_affected: str
    assigned_team: str
    safety_permit: str
    status: str
    labor_hours: float

class WorkOrderCreate(WorkOrderBase):
    pass

class WorkOrderDisplay(WorkOrderBase):
    id: int
    wo_number: str
    class Config:
        from_attributes = True

# --- ENGINEER SCHEMAS (The Missing Part) ---
class EngineerBase(BaseModel):
    name: str
    contact: str
    specialization: str
    availability: str = "Available"  # New field with default

class EngineerCreate(EngineerBase):
    pass

class EngineerDisplay(EngineerBase):
    id: int
    eng_id: str
    class Config:
        from_attributes = True
        
# --- INVENTORY SCHEMAS ---
class InventoryBase(BaseModel):
    part_name: str
    category: str
    quantity: int
    unit_cost: float
    location: str
    condition_status: str = "New"  # New field with default

class InventoryCreate(InventoryBase):
    pass

class InventoryDisplay(InventoryBase):
    id: int
    class Config:
        from_attributes = True

class PMBase(BaseModel):
    asset_name: str
    task_description: str
    frequency: str
    next_due_date: str
    assigned_team: str

class PMCreate(PMBase):
    pass

class PMDisplay(PMBase):
    id: int
    last_completed: Optional[str] = None
    class Config:
        from_attributes = True