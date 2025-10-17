# Full Stack Weather Dashboard - Deployment Guide

Complete guide for deploying both the API backend and React frontend to Vercel.

## Project Structure

```
claude-code-app/
├── server.js              # Express API backend
├── package.json          # Backend dependencies
├── vercel.json          # Backend Vercel config
├── api/
│   └── index.js        # Vercel serverless entry
└── client/             # React frontend
    ├── src/
    │   ├── App.jsx
    │   └── App.css
    ├── package.json
    └── vercel.json
```

## Currently Running

- **API Backend**: http://localhost:3001
- **React Frontend**: http://localhost:5173

## Deployment Steps

### Step 1: Deploy the API Backend

1. **Create a new Vercel project for the API:**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - Click "Deploy"

2. **Add Environment Variable:**
   - Go to Project Settings → Environment Variables
   - Add: `WEATHER_API_KEY` = `f4abdb790ea8b217e6bee7241cc4410e`
   - Select all environments (Production, Preview, Development)
   - Save and redeploy

3. **Note your API URL:**
   - After deployment, copy the URL (e.g., `https://your-api.vercel.app`)
   - You'll need this for the frontend

### Step 2: Deploy the React Frontend

1. **Create a new Vercel project for the frontend:**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import the SAME GitHub repository
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - Click on "Environment Variables" before deploying

2. **Add Environment Variable:**
   - Add: `VITE_API_URL` = Your API URL from Step 1
   - Example: `https://your-api.vercel.app`
   - Select all environments
   - Save

3. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Step 3: Test Your Deployment

Visit your frontend URL and test:
- Search for a city
- View current weather
- Check forecast data
- Verify air quality information

## Alternative: Deploy via Vercel CLI

### Deploy Backend

```bash
# From project root
vercel

# Add environment variable
vercel env add WEATHER_API_KEY
# Enter: f4abdb790ea8b217e6bee7241cc4410e

# Deploy to production
vercel --prod

# Copy the URL
```

### Deploy Frontend

```bash
# From client directory
cd client

vercel

# Add environment variable
vercel env add VITE_API_URL
# Enter your backend URL from above

# Deploy to production
vercel --prod
```

## Environment Variables Summary

**Backend (.env)**
```
WEATHER_API_KEY=f4abdb790ea8b217e6bee7241cc4410e
PORT=3001
```

**Frontend (client/.env)**
```
VITE_API_URL=http://localhost:3001
```

**Vercel Backend Environment Variables**
- `WEATHER_API_KEY` = Your OpenWeatherMap API key

**Vercel Frontend Environment Variables**
- `VITE_API_URL` = Your deployed backend URL

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend `server.js` has CORS enabled (already configured).

### API Not Found (404)
- Check that `VITE_API_URL` is set correctly in frontend
- Verify backend is deployed and accessible
- Check browser console for exact error

### Environment Variables Not Working
- Redeploy after adding/changing environment variables
- Check that variable names are exact (case-sensitive)
- For Vite variables, must start with `VITE_`

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node version compatibility
- Check build logs in Vercel dashboard

## Features Deployed

- Current weather by city search
- 24-hour weather forecast
- Air quality index with pollutant details
- Location information (coordinates, timezone, sunrise/sunset)
- Reverse geocoding
- City search with autocomplete
- Responsive mobile and desktop design

## API Endpoints Available

- `GET /health` - Health check
- `GET /api/weather/current?city=London` - Current weather
- `GET /api/weather/forecast?city=London` - Forecast
- `GET /api/weather/search?q=Paris` - Search cities
- `GET /api/weather/reverse?lat=51.5&lon=-0.1` - Reverse geocode
- `GET /api/weather/air-pollution?lat=51.5&lon=-0.1` - Air quality

## Tech Stack

**Backend:**
- Node.js
- Express.js
- Axios
- OpenWeatherMap API

**Frontend:**
- React 18
- Vite
- Modern CSS (Grid, Flexbox)
- Fetch API

**Deployment:**
- Vercel Serverless Functions
- Vercel Static Hosting
- Environment Variables via Vercel

## Next Steps

1. Consider adding custom domains in Vercel
2. Set up automatic deployments from GitHub
3. Add monitoring and analytics
4. Implement caching for API responses
5. Add error tracking (e.g., Sentry)

## Support

- Vercel Documentation: https://vercel.com/docs
- React Documentation: https://react.dev
- Vite Documentation: https://vite.dev
- OpenWeatherMap API: https://openweathermap.org/api
