# 🔐 Environment Variables Setup

## ⚠️ IMPORTANT: Secret Key Security

**A Clerk secret key was previously detected in this repository.** For security:

1. **Regenerate your Clerk keys** at https://dashboard.clerk.com/last-active?path=api-keys
2. **Never commit secret keys** to version control
3. **Set environment variables only in deployment platforms**

## 📝 Required Environment Variables

### For Netlify Deployment:

Go to your Netlify site → **Site settings** → **Environment variables** and add:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_new_publishable_key
CLERK_SECRET_KEY=sk_test_your_new_secret_key
NEXT_PUBLIC_BACKEND_URL=https://housing-app-qgae.onrender.com
```

### For Local Development:

1. Copy `frontend/.env.example` to `frontend/.env.local`
2. Fill in your actual values (from Clerk dashboard)
3. **Never commit `.env.local`** (it's in .gitignore)

## 🔄 After Setting Environment Variables:

1. **Redeploy** your Netlify site
2. The Clerk authentication should work properly
3. No more "missing secretKey" errors

## 🛡️ Security Best Practices:

- ✅ Use `.env.example` for templates
- ✅ Set real secrets only in deployment environment variables
- ✅ Regenerate keys if accidentally committed
- ❌ Never commit actual secret values to git
