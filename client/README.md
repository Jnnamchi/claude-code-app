# Weather Dashboard Frontend

React frontend for the Weather Dashboard application.

## Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:3001
```

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deploying to Vercel

### Option 1: Via Vercel Dashboard

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set Root Directory to `client`
4. Set environment variable:
   - `VITE_API_URL` = Your API URL (e.g., `https://your-api.vercel.app`)
5. Deploy

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variable
vercel env add VITE_API_URL

# Deploy to production
vercel --prod
```

## Features

- Real-time weather data display
- City search with autocomplete
- Current weather conditions
- 24-hour forecast
- Air quality index
- Location details (sunrise, sunset, coordinates)
- Responsive design for mobile and desktop

## API Endpoints Used

- `/api/weather/current` - Current weather data
- `/api/weather/forecast` - Weather forecast
- `/api/weather/search` - City search
- `/api/weather/air-pollution` - Air quality data

## Technologies

- React 18
- Vite
- CSS3 (with Grid and Flexbox)
- OpenWeatherMap API
