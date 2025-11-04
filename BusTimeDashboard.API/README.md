# BusTimeDashboard.API

.NET 8 Web API proxy for BusTime Developer API.

## Setup

1. Copy `.env.example` to `.env` with appropriate base url and api keys.
2. Run:
   ```
   dotnet restore
   dotnet run
   ```
3. API Endpoints:
   - GET /api/bustime/routes
   - GET /api/bustime/predictions/{stopId}

This project is a minimal skeleton intended for local development.
