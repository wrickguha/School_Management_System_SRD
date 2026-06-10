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

## Step 6: Initializing the Application (No SSH Needed)

Because you cannot access the command line easily, use the secure deploy route we added:

1. **Run Database Migrations:**
   In your browser, visit:
   `https://subhraedu.com/deploy-utility?secret=YOUR_CHOSEN_LONG_SECRET_KEY_MIN_8_CHARS&action=migrate`
   This will run `php artisan migrate --force` and return the terminal output in your browser!

2. **Seed Initial Database Data (If required):**
   `https://subhraedu.com/deploy-utility?secret=YOUR_CHOSEN_LONG_SECRET_KEY_MIN_8_CHARS&action=db-seed`

3. **Create the Storage Link:**
   `https://subhraedu.com/deploy-utility?secret=YOUR_CHOSEN_LONG_SECRET_KEY_MIN_8_CHARS&action=storage-link`

4. **Cache Configurations and Routes for speed:**
   `https://subhraedu.com/deploy-utility?secret=YOUR_CHOSEN_LONG_SECRET_KEY_MIN_8_CHARS&action=optimize`

---

## Step 7: Folder Permissions

Make sure the following directories on GoDaddy are writeable by the web server (usually permission code `775` or `755` in cPanel File Manager):
- `/storage`
- `/bootstrap/cache`

---

## Troubleshooting

### CORS Errors
If you run frontend on `https://subhraedu.com` and backend on `https://api.subhraedu.com`, ensure:
1. `SANCTUM_STATEFUL_DOMAINS` is set to `subhraedu.com`.
2. `FRONTEND_URL` is set to `https://subhraedu.com`.

### 404 on Refresh (React Router)
If refreshing pages like `/dashboard` returns a 404, verify that the `.htaccess` file created in `frontend/public/.htaccess` was copied to the document root of the frontend.
