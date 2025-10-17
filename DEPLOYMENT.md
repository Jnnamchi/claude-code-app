# Deploying to Vercel

This guide will help you deploy your Weather Dashboard API to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed (optional, but recommended)
3. Your OpenWeatherMap API key

## Method 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Weather Dashboard API"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect the settings

### Step 3: Configure Environment Variables
1. In the project settings, go to "Environment Variables"
2. Add the following variable:
   - Key: `WEATHER_API_KEY`
   - Value: Your OpenWeatherMap API key
   - Environment: Production, Preview, Development (select all)
3. Click "Save"

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Your API will be live at `https://your-project-name.vercel.app`

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# First deployment
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - What's your project's name? weather-dashboard-api (or your preferred name)
# - In which directory is your code located? ./

# Add environment variable
vercel env add WEATHER_API_KEY
# Enter your OpenWeatherMap API key when prompted
# Select all environments (production, preview, development)

# Deploy to production
vercel --prod
```

## Testing Your Deployment

Once deployed, test your endpoints:

```bash
# Replace YOUR_VERCEL_URL with your actual Vercel URL
curl "https://YOUR_VERCEL_URL.vercel.app/health"
curl "https://YOUR_VERCEL_URL.vercel.app/api/weather/current?city=London"
curl "https://YOUR_VERCEL_URL.vercel.app/api/weather/forecast?city=Paris"
```

## Available Endpoints

Your deployed API will have these endpoints:

- `GET /health` - Health check
- `GET /api/weather/current?city=London` - Current weather
- `GET /api/weather/forecast?city=London` - 5-day forecast
- `GET /api/weather/onecall?lat=51.5074&lon=-0.1278` - One Call API
- `GET /api/weather/search?q=London` - Search cities
- `GET /api/weather/reverse?lat=51.5074&lon=-0.1278` - Reverse geocode
- `GET /api/weather/air-pollution?lat=51.5074&lon=-0.1278` - Air quality

## Vercel Configuration

The `vercel.json` file in this project configures:
- Node.js runtime for serverless functions
- Route handling to direct all requests to the Express app
- Environment variable placeholders

## Continuous Deployment

With the GitHub integration:
- Every push to `main` branch triggers a production deployment
- Every pull request creates a preview deployment
- You can enable automatic deployments from other branches

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Monitoring

Vercel provides:
- Real-time logs in the dashboard
- Function execution metrics
- Error tracking
- Analytics (on paid plans)

## Troubleshooting

### API returns 404
- Make sure `vercel.json` is properly configured
- Check that all routes are defined in `server.js`

### Environment variables not working
- Ensure variables are set in Vercel dashboard
- Redeploy after adding/changing variables

### Cold starts
- Serverless functions may have cold starts
- First request after inactivity might be slower
- Consider upgrading to Pro plan for better performance

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- OpenWeatherMap API Docs: https://openweathermap.org/api
- Check server logs in Vercel Dashboard
