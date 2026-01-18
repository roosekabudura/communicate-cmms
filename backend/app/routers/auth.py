from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
# Use relative imports to avoid 'app not found' errors
from .. import models, schemas, database

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(database.get_db)):
    # Verify the user exists in the database [cite: 197-198]
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
    
    # Hardcoded check for the admin user [cite: 199]
    if user_credentials.password != "admin123":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    return {"access_token": "dummy-jwt-token", "token_type": "bearer"}