# 🚀 Deployment Guide

Complete guide to deploy your Weather Prediction App to production.

---

## 📋 Deployment Strategy

**Recommended Architecture:**
```
Frontend (React) → Netlify/Vercel
        ↓ API calls
Backend (Flask + ML) → Render
```

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend (Already Done ✓)

Your backend is now configured to work with Render:
- ✅ Dynamic PORT handling
- ✅ Production mode support
- ✅ ML models included

### Step 2: Deploy to Render

1. **Go to [render.com](https://render.com)** and sign up/login

2. **Click "New +"** → **"Web Service"**

3. **Connect GitHub repository:**
   - Authorize Render to access your GitHub
   - Select: `Long-term-weather-prediction`

4. **Configure Web Service:**

   | Setting | Value |
   |---------|-------|
   | **Name** | `weather-prediction-api` |
   | **Region** | Oregon (US West) or closest to you |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt && python generate_data.py && python train_model.py` |
   | **Start Command** | `python app.py` |
   | **Instance Type** | Free |

5. **Environment Variables** (optional):
   - Click "Advanced"
   - Add: `FLASK_ENV` = `production`

6. **Click "Create Web Service"**

### Step 3: Wait for Build (5-10 minutes)

Watch the logs for:
```
Installing dependencies...
✓ Successfully installed Flask, scikit-learn, pandas, numpy...
Generating training data...
✓ weather_data.csv created
Training models...
✓ rain_model.pkl created
✓ temperature_model.pkl created
✓ aqi_model.pkl created
Starting Flask app...
✓ Running on http://0.0.0.0:10000
```

### Step 4: Get Your Backend URL

After deployment completes:
- Copy the URL (e.g., `https://weather-prediction-api.onrender.com`)
- Save it - you'll need it for frontend!

### Step 5: Test Your Backend

```bash
# Test health endpoint
curl https://YOUR-APP-NAME.onrender.com/health

# Or use the test script
cd backend
python test_deployment.py
# (Edit the RENDER_URL in the file first)
```

---

## 🎨 Frontend Deployment (Netlify)

### Step 1: Update Frontend Code

Edit `frontend/src/App.js` around line 101:

**Find:**
```javascript
const response = await axios.post('http://localhost:5002/predict', {
```

**Replace with:**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';
const response = await axios.post(`${API_URL}/predict`, {
```

### Step 2: Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)** and sign up/login

2. **Click "Add new site"** → **"Import an existing project"**

3. **Connect GitHub:**
   - Select: `Long-term-weather-prediction`

4. **Configure Site:**

   | Setting | Value |
   |---------|-------|
   | **Base directory** | `frontend` |
   | **Build command** | `npm run build` |
   | **Publish directory** | `frontend/build` |

5. **Environment Variables:**
   - Click "Show advanced"
   - Add new variable:
     - **Key**: `REACT_APP_API_URL`
     - **Value**: `https://YOUR-RENDER-URL.onrender.com` (from Step 4 above)

6. **Click "Deploy site"**

### Step 3: Wait for Build (2-3 minutes)

Watch for:
```
Installing dependencies...
Building React app...
✓ Build successful
Deploying to Netlify...
✓ Site is live!
```

### Step 4: Get Your Frontend URL

- Copy the URL (e.g., `https://wonderful-app-abc123.netlify.app`)
- You can customize this in Settings → Domain management

### Step 5: Test Your App

1. Open your Netlify URL
2. Click on the map to select a location
3. Choose a date
4. Click "Predict Weather"
5. Wait ~30 seconds (first time wakes up backend)
6. See your prediction! 🎉

---

## 🎯 Quick Summary

| Component | Platform | URL | Cost |
|-----------|----------|-----|------|
| **Backend** | Render | `https://weather-prediction-api.onrender.com` | FREE |
| **Frontend** | Netlify | `https://your-app.netlify.app` | FREE |

**Total Cost: $0** 💰

---

## ⚠️ Important Notes

### Backend (Render Free Tier):
- ⏰ Sleeps after 15 min of inactivity
- 🐌 Takes ~30s to wake up (first request)
- 💾 512MB RAM
- ⏱️ 750 hours/month free

### Frontend (Netlify Free Tier):
- ⚡ Always fast (no sleep)
- 🌍 Global CDN
- 📦 100GB bandwidth/month
- 🔄 Auto-deploy on Git push

---

## 🔧 Troubleshooting

### Backend won't start:
1. Check Render logs for errors
2. Verify `requirements.txt` has all dependencies
3. Make sure `.pkl` files are generated during build

### Frontend can't reach backend:
1. Check CORS is enabled in backend (it is!)
2. Verify `REACT_APP_API_URL` environment variable in Netlify
3. Check browser console for errors

### "Loading forever" on first request:
- Normal! Free tier backend is waking up
- Wait 30-60 seconds
- Subsequent requests will be fast

### NASA API errors:
- App will fall back to seasonal patterns automatically
- No action needed

---

## 🚀 Upgrade Options (Optional)

### Render Backend:
- **Starter Plan** ($7/month):
  - No sleep
  - 512MB RAM
  - Always fast

### Netlify Frontend:
- **Pro Plan** ($19/month):
  - Better analytics
  - Team features
  - Priority support

---

## 📊 Monitoring

### Check Backend Health:
```bash
curl https://YOUR-APP.onrender.com/health
```

### Check Render Logs:
- Go to your Render dashboard
- Click on your service
- Click "Logs" tab
- See real-time requests and errors

### Check Netlify Logs:
- Go to your Netlify dashboard
- Click on your site
- Click "Deploys" tab
- See build logs and deploy history

---

## 🔄 Updating Your App

### Backend Updates:
1. Push changes to GitHub
2. Render auto-deploys from `main` branch
3. Wait 5-10 minutes for build
4. Changes are live!

### Frontend Updates:
1. Push changes to GitHub
2. Netlify auto-deploys from `main` branch
3. Wait 2-3 minutes for build
4. Changes are live!

---

## 🎉 You're Done!

Your app is now live and accessible worldwide! 🌍

**Share your app:**
- Frontend URL: Your Netlify URL
- API Docs: Your Render URL + `/health`

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Flask Deployment Best Practices](https://flask.palletsprojects.com/en/latest/deploying/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

---

**Need Help?**
- Check Render logs for backend issues
- Check browser console for frontend issues
- Verify environment variables are set correctly
