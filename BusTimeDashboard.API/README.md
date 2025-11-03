# BusTimeDashboard.API

.NET 8 Web API proxy for BusTime Developer API.

## Setup

1. Update `appsettings.json` with your BusTime BaseUrl and ApiKey.
2. Run:
   ```
   dotnet restore
   dotnet run
   ```
3. API Endpoints:
   - GET /api/bustime/routes
   - GET /api/bustime/predictions/{stopId}

This project is a minimal skeleton intended for local development.
