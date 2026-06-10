# GoDaddy Production Deployment Guide (subhraedu.com)

This guide provides step-by-step instructions for deploying your React frontend and Laravel backend to GoDaddy shared hosting at **https://subhraedu.com/**.

---

## Deployment Architectures

You can deploy the project using one of two methods:

### Method A: Unified Deployment (Single Domain - Recommended)
The React frontend and Laravel API are hosted together under `https://subhraedu.com`.
- **CORS Issues:** None (same origin).
- **Structure:** The frontend `dist/` build files are placed directly inside Laravel's `/public` directory, and Laravel routes any non-API web request to the frontend's `index.html`.

### Method B: Subdomain Deployment (Separate - Alternative)
- **Frontend:** Uploaded to the main directory of the domain `https://subhraedu.com`.
- **Backend:** Uploaded to a folder of your choice and mapped to a subdomain (e.g., `https://api.subhraedu.com`).
- **CORS Issues:** Handled by configuring `SANCTUM_STATEFUL_DOMAINS` and `FRONTEND_URL` in Laravel's `.env`.

---

## Step 1: Preparing files for GitHub (Do this first)

Make sure you commit all configuration changes we just set up. Do **not** commit the `.env` file itself.
```bash
git add .
git commit -m "chore: prepare for production deployment and secure env configs"
git push origin main
```

---

## Step 2: Preparing the Laravel Backend (Locally)

Since GoDaddy shared hosting rarely has SSH access or allows running Composer commands:

1. **Optimize Autoloader Locally:**
   Run the following in your local `backend` directory to clean up dev dependencies and optimize classes:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```
2. **Compress the Backend Files:**
   Create a ZIP archive of the `backend` folder.
   - **Include:** `app/`, `bootstrap/`, `config/`, `database/`, `public/`, `resources/`, `routes/`, `storage/`, `vendor/`, `artisan`, `composer.json`.
   - **Exclude:** `.env`, `.git/`, `tests/`, `.phpunit.result.cache`.

---

## Step 3: Preparing the React Frontend (Locally)

1. **Configure Environment Variables:**
   Create a file named `.env.production` inside the `/frontend` directory:
   ```env
   VITE_API_URL=https://subhraedu.com/api
   ```
   *(If using a subdomain for the API, set this to `https://api.subhraedu.com/api`)*

2. **Build the Frontend:**
   In the `/frontend` directory, run:
   ```bash
   npm run build
   ```
   This generates the build assets in `frontend/dist/`.

---

## Step 4: Database Setup on GoDaddy cPanel

1. Log in to your **GoDaddy cPanel**.
2. Go to **MySQL Database Wizard**.
3. Create a new database (e.g., `subhra_db`).
4. Create a database user and a strong password. **Write these down.**
5. Add the user to the database and check **All Privileges**.

---

## Step 5: Uploading and Configuring Files on GoDaddy

### Option A: Unified Setup (Single Domain - Recommended)

1. **Upload Backend:**
   Upload the `backend.zip` file to your GoDaddy server directory (e.g. `public_html/` or a subdirectory `subhraedu/` inside your user home directory to keep it secure). Extract it.
2. **Upload Frontend Build:**
   Copy all files inside `frontend/dist/` directly into Laravel's `backend/public/` directory (overwriting `index.php` or `welcome` views is fine, but make sure React's `index.html` resides in `backend/public/index.html`).
3. **Configure Domains:**
   Configure your GoDaddy Domain Main Directory to point directly to Laravel's `/public` folder (e.g. `/home/username/public_html/backend/public`).
4. **Configure `.env` File:**
   Create a `.env` file in the extracted `backend` root directory on GoDaddy:
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

   # Set a strong secret key for running artisan commands via browser:
   DEPLOY_SECRET=YOUR_CHOSEN_LONG_SECRET_KEY_MIN_8_CHARS

   FRONTEND_URL=https://subhraedu.com
   SANCTUM_STATEFUL_DOMAINS=subhraedu.com
   ```

---

## Step 6: Extracting & Initializing the Application (No SSH Needed)

Because you cannot access the command line easily on GoDaddy shared hosting, use the secure deploy utility route we added:

1. **Extract the uploaded `release.zip` file:**
   In your browser, visit:
   `https://subhraedu.com/deploy-utility?secret=YOUR_CHOSEN_LONG_SECRET_KEY_MIN_8_CHARS&action=unzip`
   *(Note: This is automatically executed by the GitHub Actions pipeline, but you can run it manually if needed)*

2. **Run Database Migrations:**
   In your browser, visit:
   `https://subhraedu.com/deploy-utility?secret=YOUR_CHOSEN_LONG_SECRET_KEY_MIN_8_CHARS&action=migrate`
   This will run `php artisan migrate --force` and return the terminal output in your browser!

3. **Seed Initial Database Data (If required):**
   `https://subhraedu.com/deploy-utility?secret=YOUR_CHOSEN_LONG_SECRET_KEY_MIN_8_CHARS&action=db-seed`

4. **Create the Storage Link:**
   `https://subhraedu.com/deploy-utility?secret=YOUR_CHOSEN_LONG_SECRET_KEY_MIN_8_CHARS&action=storage-link`

5. **Cache Configurations and Routes for speed:**
   `https://subhraedu.com/deploy-utility?secret=YOUR_CHOSEN_LONG_SECRET_KEY_MIN_8_CHARS&action=optimize`


---

## Step 7: Folder Permissions

Make sure the following directories on GoDaddy are writeable by the web server (usually permission code `775` or `755` in cPanel File Manager):
- `/storage`
- `/bootstrap/cache`

---

## Step 8: Continuous Deployment with GitHub Actions (Auto-Deploy on Push)

We have created an automated deployment workflow file at `.github/workflows/deploy.yml`. Every time you push to the `main` branch, GitHub will automatically compile the React app, compile Laravel composer dependencies, package them together, upload them to GoDaddy, and trigger migrations.

### How to set up GitHub Secrets:
1. Go to your repository on GitHub: `https://github.com/wrickguha/School_Management_System_SRD`.
2. Click on the **Settings** tab.
3. In the left sidebar, click on **Secrets and variables** > **Actions**.
4. Click on the **New repository secret** button for each of the following:

| Secret Name | Value | Description |
|---|---|---|
| `FTP_SERVER` | e.g. `ftp.subhraedu.com` | Your GoDaddy FTP Hostname / IP address |
| `FTP_USERNAME` | e.g. `subhraedu_ftp` | Your GoDaddy FTP Username |
| `FTP_PASSWORD` | `YourFTPPassword` | Your GoDaddy FTP Password |
| `DEPLOY_SECRET` | `A_Strong_Random_String` | The secret key matching `DEPLOY_SECRET` in your GoDaddy Laravel `.env` |

5. Once these are set, simply push your code to the `main` branch. You can monitor the real-time build and upload logs under the **Actions** tab on your GitHub repository page.

---

## Troubleshooting

### CORS Errors
If you run frontend on `https://subhraedu.com` and backend on `https://api.subhraedu.com`, ensure:
1. `SANCTUM_STATEFUL_DOMAINS` is set to `subhraedu.com`.
2. `FRONTEND_URL` is set to `https://subhraedu.com`.

### 404 on Refresh (React Router)
If refreshing pages like `/dashboard` returns a 404, verify that the `.htaccess` file created in `frontend/public/.htaccess` was copied to the document root of the frontend.

### FTP Error 553: Disk Quota Exceeded
If you get a `Disk quota exceeded` error during deployment:
1. Open your **GoDaddy cPanel File Manager**.
2. Go to your domain's folder (e.g. `public_html` or the folder you are deploying to) and **delete the old `vendor/` folder**. 
3. *Why?* The previous deployment attempt tried to upload ~15,000 separate PHP files inside `vendor/`. This consumes a massive number of inodes (file counts) and overhead. Deleting it immediately frees up your server quota so that the single `release.zip` can be uploaded and extracted cleanly.


