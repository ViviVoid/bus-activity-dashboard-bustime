# Bus Activity Dashboard - Angular Frontend

Modern Angular 20 frontend application for displaying real-time bus information and predictions.

## Features

- **Bus Routes Display**: View all available bus routes with color-coded cards
- **Bus Predictions Search**: Search for real-time bus arrival predictions by stop ID
- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes
- **Modern UI**: Clean, gradient-based design with smooth animations

## Architecture

### Components

- **RoutesListComponent**: Displays a grid of all bus routes fetched from the API
- **PredictionsComponent**: Provides a search interface for bus stop predictions

### Services

- **BustimeService**: Handles HTTP communication with the backend API
  - `getRoutes()`: Fetches all available bus routes
  - `getPredictions(stopId)`: Fetches predictions for a specific stop

### Models

TypeScript interfaces for API responses:
- `Route`: Bus route information
- `Prediction`: Bus arrival prediction data
- `RoutesResponse` & `PredictionsResponse`: API response wrappers

## Development

### Prerequisites

- Node.js (v18 or later)
- npm

### Setup

```bash
npm install
```

### Development Server

```bash
npm start
```
or
```bash
ng serve
```
to test different configurations:
```bash
ng serve --configuration production
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

The dev server is configured to proxy API requests to `http://localhost:5000` (see `proxy.conf.json`).

### Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
npm test
```

## API Integration

The frontend connects to the BusTimeDashboard.API backend at:

- `GET /api/bustime/routes` - Fetch all bus routes
- `GET /api/bustime/predictions/{stopId}` - Fetch predictions for a stop

Make sure the backend API is running before starting the frontend.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── routes-list.component.ts    # Bus routes display
│   │   └── predictions.component.ts    # Predictions search
│   ├── services/
│   │   └── bustime.service.ts          # API communication
│   ├── models/
│   │   └── bustime.models.ts           # TypeScript interfaces
│   ├── app.ts                          # Root component
│   ├── app.html                        # Root template
│   ├── app.css                         # Root styles
│   └── app.config.ts                   # App configuration
└── ...
```

## Technologies

- **Angular 20**: Latest Angular framework with standalone components
- **RxJS 7**: Reactive programming for async operations
- **TypeScript 5.8**: Type-safe development
- **CSS3**: Modern styling with gradients and animations
