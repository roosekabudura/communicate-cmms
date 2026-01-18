from app.database import engine, Base
from app import models

def rebuild_database():
    print("Dropping all existing tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating new tables with updated columns (including 'role')...")
    Base.metadata.create_all(bind=engine)
    
    print("Database has been successfully rebuilt!")

if __name__ == "__main__":
    rebuild_database()