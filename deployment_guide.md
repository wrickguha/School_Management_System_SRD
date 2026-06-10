# GoDaddy Production Deployment Guide (subhraedu.com)

This guide provides step-by-step instructions for deploying your React frontend and Laravel backend to GoDaddy shared hosting at **https://subhraedu.com/** using GitHub Actions.

To bypass GoDaddy FTP connection rate limits and "Disk quota exceeded" errors, we exclude the massive PHP `vendor/` folder (which contains over 15,000 files) from the automated GitHub Actions deployment. 

The GitHub Action will automatically deploy all custom code (including the React frontend and Laravel controllers/routes) in under 1 minute on every push. You only need to upload the `vendor/` folder **once manually** using the cPanel File Manager.

---

## Step 1: Set Up GitHub Repository Secrets

To enable automated deployment, add your GoDaddy FTP credentials as secure **Repository Secrets** in your GitHub repository settings:

1. Go to your repository on GitHub: **[GitHub Secrets Settings](https://github.com/wrickguha/School_Management_System_SRD/settings/secrets/actions)**.
2. Click **New repository secret** for each of the following:

| Secret Name | Value | Description |
|---|---|---|
| `FTP_SERVER` | `subhraedu.com` | Your domain name (or your server's IP: `68.178.188.122`) |
| `FTP_USERNAME` | `pratikguha@srdtechnologiesindia.com` | Your GoDaddy FTP Username |
| `FTP_PASSWORD` | `YourFTPPassword` | Your GoDaddy FTP Password |
| `DEPLOY_SECRET` | `A_Strong_Random_String` | A security token (e.g. `SubhraEduSecret2026!`) of your choice to protect your remote migrations |

---

## Step 2: One-Time Manual Upload of the `vendor/` Folder

Since the `vendor/` folder rarely changes, you only need to upload it once manually:

1. **Prepare Vendor locally:**
   In your local `backend` directory, run:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```
2. **Zip the `vendor` folder:**
   Compress only the `backend/vendor/` folder into a file named `vendor.zip`.
3. **Upload to GoDaddy:**
   - Log in to your **GoDaddy cPanel** -> **File Manager**.
   - Navigate to your target application directory on the server (e.g. `public_html/` or a subdirectory).
   - Upload the `vendor.zip` file directly.
   - Right-click `vendor.zip` on the server and select **Extract**.
   - Delete `vendor.zip` from the server once extracted to save disk space.

*(You only need to repeat this step if you add or modify PHP dependencies in `composer.json` in the future).*

---

## Step 3: Database Setup on GoDaddy cPanel

1. Log in to your **GoDaddy cPanel**.
2. Go to **MySQL Database Wizard**.
3. Create a new database (e.g., `subhra_db`).
4. Create a database user and a strong password. **Write these down.**
5. Add the user to the database and check **All Privileges**.

---

## Step 4: Configure the GoDaddy `.env` File

Create a file named `.env` in your backend directory on GoDaddy (using cPanel File Manager -> New File):
```env
APP_NAME=SUBHRAEDU
APP_ENV=production
APP_KEY=base64:SafjOw0OGuQr+P+JVlQxQQWQ7KTaiCapMozTVcMe0Kw= # Keep your key secure!
APP_DEBUG=false
APP_URL=https://subhraedu.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_godaddy_db_name
DB_USERNAME=your_godaddy_db_username
DB_PASSWORD=your_godaddy_db_password

# Must match the DEPLOY_SECRET you set in GitHub Secrets:
DEPLOY_SECRET=YOUR_CHOSEN_DEPLOYMENT_SECRET

FRONTEND_URL=https://subhraedu.com
SANCTUM_STATEFUL_DOMAINS=subhraedu.com
```

---

## Step 5: Push to GitHub to Trigger Auto-Deployment

Now, push your code to the `main` branch to trigger the automated deployment pipeline:

```powershell
git add .
git commit -m "chore: setup automated deployment with vendor exclusion"
git push origin main
```

Every time you push, GitHub Actions will:
1. Compile your React frontend.
2. Merge the built static assets into Laravel's `/public` folder.
3. Upload all custom code (controllers, views, routing, React files) via FTP in under **1 minute**.

---

## Step 6: Initialize and Migrate the Database (No SSH Needed)

Since you cannot run terminal commands on GoDaddy shared hosting, use the secure utility route in your browser:

1. **Run Database Migrations:**
   In your browser, visit:
   `https://subhraedu.com/deploy-utility?secret=YOUR_DEPLOYMENT_SECRET&action=migrate`
   This runs your migrations and displays the output in your browser.

2. **Seed Initial Database Data (If needed):**
   `https://subhraedu.com/deploy-utility?secret=YOUR_DEPLOYMENT_SECRET&action=db-seed`

3. **Create the Storage Link:**
   `https://subhraedu.com/deploy-utility?secret=YOUR_DEPLOYMENT_SECRET&action=storage-link`

4. **Optimize Cache:**
   `https://subhraedu.com/deploy-utility?secret=YOUR_DEPLOYMENT_SECRET&action=optimize`

---

## Step 7: Folder Permissions

Make sure the following directories on GoDaddy are writeable by the web server (usually permission code `775` or `755` in cPanel File Manager):
- `/storage`
- `/bootstrap/cache`

---

## Troubleshooting

### CORS Errors
If you get CORS errors, ensure:
1. `SANCTUM_STATEFUL_DOMAINS` is set to `subhraedu.com` in GoDaddy `.env`.
2. `FRONTEND_URL` is set to `https://subhraedu.com` in GoDaddy `.env`.

### 404 on Refresh (React Router)
If refreshing pages like `/dashboard` or `/students` returns a 404 error, make sure the `.htaccess` file created by the build in `frontend/public/.htaccess` is located in your public root directory.
