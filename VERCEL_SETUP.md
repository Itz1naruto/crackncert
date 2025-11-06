# Vercel Environment Variable Setup

## Firebase Service Account Key

Add this to Vercel as a **single-line JSON string**:

### Step 1: Get Your Service Account Key

1. Go to Firebase Console: https://console.firebase.google.com/project/crackncert-cca5e/settings/serviceaccounts/adminsdk
2. Click **"Generate New Private Key"**
3. Download the JSON file
4. Copy the **entire JSON content** (it's all one line when formatted for Vercel)

**Important:** The JSON will look like this (but with your actual values):
```json
{"type":"service_account","project_id":"crackncert-cca5e","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
```

**⚠️ SECURITY WARNING:** Never commit this key to Git! It's already in `.gitignore`.

### Step 2: Add to Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project: `crackncert`
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. **Key**: `FIREBASE_SERVICE_ACCOUNT_KEY`
6. **Value**: Paste the entire JSON string above (all on one line)
7. Select environments: ✅ Production, ✅ Preview, ✅ Development
8. Click **Save**

### Step 3: Redeploy

After adding the variable, Vercel will automatically redeploy, or you can:
- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment

### Step 4: Test

After deployment, test at: `https://your-domain.vercel.app/testauth`

Try:
1. Sign up with a new email
2. Enter verification code
3. Account should be created and email auto-verified
4. You should stay logged in

---

## ⚠️ Security Note

**DO NOT:**
- Commit this key to Git (already in `.gitignore`)
- Share this key publicly
- Expose it in client-side code

**This key gives full admin access to your Firebase project!**

