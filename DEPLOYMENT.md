# Firebase Authentication - Production Deployment Guide

## 🚀 Deploying to Vercel

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project: `crackncert` (or your project name)
3. Go to **Settings** → **Environment Variables**
4. Add these Firebase environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDdQfZ4pfdQwAged5CE03bEE7b63XHjFMs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=crackncert-cca5e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crackncert-cca5e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crackncert-cca5e.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=258380225071
NEXT_PUBLIC_FIREBASE_APP_ID=1:258380225071:web:9983ad21f69922cfb884da
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-S6XMYZ86LN
```

5. Also add your Gemini API key (if not already added):
```
GEMINI_API_KEY=your-gemini-api-key-here
```

6. For password reset (optional but recommended), add Firebase Admin SDK credentials:
```
FIREBASE_ADMIN_PROJECT_ID=crackncert-cca5e
FIREBASE_ADMIN_PRIVATE_KEY=your-private-key-here
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-email@crackncert-cca5e.iam.gserviceaccount.com
```

7. Click **Save** for each variable
8. Make sure to select **Production**, **Preview**, and **Development** environments

### Step 2: Add Authorized Domain to Firebase

1. Go to Firebase Console: https://console.firebase.google.com/project/crackncert-cca5e/authentication/settings
2. Scroll down to **Authorized domains**
3. Click **Add domain**
4. Add your Vercel domain: `crackncert.vercel.app` (or your custom domain like `crackncert.in`)
5. Click **Add**

### Step 3: Firestore Rules (Already Done ✅)

Your Firestore rules are already set to allow reads/writes for development. For production, you may want to tighten them later, but they'll work for now.

### Step 4: Deploy

1. Push your code to GitHub (if not already):
   ```bash
   git add .
   git commit -m "Add Firebase authentication"
   git push origin main
   ```

2. Vercel will automatically deploy your changes

3. After deployment, test at: `https://your-domain.vercel.app/testauth`

### Step 5: Test Production

1. Visit: `https://your-domain.vercel.app/testauth`
2. Try signing up with a real email
3. Check that verification codes work (they won't be shown in production - you'll need email service)
4. Test login functionality

## 📧 Email Service Setup (For Production)

Currently, verification codes are only shown in development mode. For production, you need to set up an email service:

### Option 1: Resend (Recommended)

1. Sign up at: https://resend.com
2. Get your API key
3. Add to Vercel: `RESEND_API_KEY=your-resend-api-key`
4. Uncomment the email sending code in `src/app/api/send-verification-code/route.ts`
5. Install Resend: `npm install resend`

### Option 2: SendGrid, AWS SES, or other email services

Follow similar steps for your preferred email service.

## 🔒 Security Notes

- Firestore rules are currently permissive for development
- For production, consider adding authentication checks
- Never commit `.env.local` files (already in `.gitignore`)
- Keep Firebase Admin credentials secure

## ✅ Checklist

- [ ] Firebase environment variables added to Vercel
- [ ] Authorized domain added to Firebase
- [ ] Firestore rules published (already done)
- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Test authentication on live site
- [ ] (Optional) Email service configured

