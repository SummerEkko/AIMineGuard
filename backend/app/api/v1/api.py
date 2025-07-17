from fastapi import APIRouter
from app.api.v1.endpoints import auth, mines, alerts, environment_data, equipment, maintenance

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(mines.router, prefix="/mines", tags=["mines"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(environment_data.router, prefix="/environment-data", tags=["environment-data"])
api_router.include_router(equipment.router, prefix="/equipment", tags=["equipment"])
api_router.include_router(maintenance.router, prefix="/maintenance", tags=["maintenance"]) 