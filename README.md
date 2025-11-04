# BusTime Activity Dashboard
-------------------------
This is a hobbyist project to use the Milwaukee County Transit System (MCTS) api to create a functional dashboard similar to the ridemcts provided webservice ([ridemcts.com](https://www.ridemcts.com/real-time)). The Angular frontend was initially vibe-coded through copilot github actions provided the backend I developed as a technical spike to establish familiarity with .NET and C#.

Future prospects for this project would be to expand the functionality of the backend api to allow more usage of the provided developer API from MCTS and improve UI/UX practices of the Angular frontend to promote mobile usability.

This project is currently deployed using Azure Cloud Services: [https://calm-glacier-02ac7391e.3.azurestaticapps.net/](https://calm-glacier-02ac7391e.3.azurestaticapps.net/)

Contains:
 - BusTimeDashboard.API (ASP.NET 8 minimal API proxy)
 - bus-dashboard (Angular skeleton)

Instructions for Local Development
### Backend
 - Copy `/BusTimeDashboard.API/.env.example` to `.env`
 - Update API keys in `.env` appropriately
 - Start backend: dotnet run from BusTimeDashboard.API folder (port default printed by dotnet)

### Frontend
 - Start frontend: npm install && ng serve in bus-dashboard

### AI (LLM) Disclosure
The use of Copilot was applied in the angular frontend scaffolding of this project.
