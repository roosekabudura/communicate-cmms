import random
import string
from sqlalchemy import Column, Integer, String, ForeignKey, Float, event
from sqlalchemy.orm import relationship
from app.database import Base

class Asset(Base):
    __tablename__ = "assets"
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String, unique=True, index=True)
    name = Column(String)
    category = Column(String)
    nature = Column(String)
    criticality = Column(String)
    status = Column(String)
    condition_score = Column(String)
    site = Column(String)
    manufacturer = Column(String)
    purchase_date = Column(String)
    warranty_expiry = Column(String)
    assigned_team = Column(String)
    
    work_orders = relationship("WorkOrder", back_populates="asset_parent")

@event.listens_for(Asset, 'before_insert')
def receive_before_insert(mapper, connection, target):
    if not target.asset_id:
        target.asset_id = "AST-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

class WorkOrder(Base):
    __tablename__ = "work_orders"
    id = Column(Integer, primary_key=True, index=True)
    wo_number = Column(String, unique=True, index=True)
    origin = Column(String)
    priority = Column(String)
    asset_id_link = Column(String, ForeignKey("assets.asset_id"))
    site_id = Column(String)
    sla_deadline = Column(String)
    service_affected = Column(String)
    assigned_team = Column(String)
    safety_permit = Column(String)
    status = Column(String, default="New")
    root_cause = Column(String, nullable=True)
    resolution_notes = Column(String, nullable=True)
    labor_hours = Column(Float, default=0.0)
    assigned_engineer = Column(String, nullable=True)

    asset_parent = relationship("Asset", back_populates="work_orders")

@event.listens_for(WorkOrder, 'before_insert')
def receive_wo_before_insert(mapper, connection, target):
    if not target.wo_number:
        target.wo_number = "WO-" + ''.join(random.choices(string.digits, k=5))

class Engineer(Base):
    __tablename__ = "engineers"
    id = Column(Integer, primary_key=True, index=True)
    eng_id = Column(String, unique=True, index=True)
    name = Column(String)
    specialization = Column(String)
    contact = Column(String)
    status = Column(String, default="Available")
    

@event.listens_for(Engineer, 'before_insert')
def receive_eng_before_insert(mapper, connection, target):
    if not target.eng_id:
        target.eng_id = "ENG-" + ''.join(random.choices(string.digits, k=3))

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    part_name = Column(String)
    category = Column(String)
    quantity = Column(Integer)
    unit_cost = Column(Float)
    location = Column(String)
    condition_status = Column(String, default="New")

class PMSchedule(Base):
    __tablename__ = "pm_schedules"
    id = Column(Integer, primary_key=True, index=True)
    asset_name = Column(String)
    task_description = Column(String)
    frequency = Column(String) # Weekly, Monthly, Quarterly
    next_due_date = Column(String)
    assigned_team = Column(String)

    last_completed = Column(String, nullable=True)
