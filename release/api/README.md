# CV Analyzer Backend API

PHP 8+ backend API for the CV Analyzer platform. Deployable on shared hosting (Hostinger, cPanel).

## Features

- User authentication (JWT)
- CV upload, parsing, and analysis (server-side)
- Profile management
- Job posting and candidate search (interviewer role)
- Interview question bank and practice tracking
- LinkedIn profile optimization
- Analysis export (JSON, HTML, DOCX)
- Shareable analysis links
- MySQL database with full schema

## Requirements

- PHP 8.0 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Composer (for dependency management)
- Web server: Apache with mod_rewrite (Hostinger default) or Nginx
- File upload support (max 10MB recommended)
- JSON extension (usually built-in)
- Zip extension (for DOCX parsing)

## Installation on Hostinger

### Step 1: Create Database

1. Log in to Hostinger control panel (hPanel)
2. Go to **Databases** > **MySQL**
3. Create a new database and note:
   - Database name
   - Database username
   - Database password
   - Database host (usually `localhost`)
4. Import the schema: Use **phpMyAdmin** to import `install.sql`

### Step 2: Upload Backend Files

1. Using File Manager or FTP, upload the entire `/api` folder to your hosting account
   - Recommended location: `/public_html/api` or `/public_html/api`
2. Ensure the `upload/` directory is writable:
   ```
   chmod 755 upload/
   ```
   (Hostinger usually sets this automatically)

### Step 3: Install Dependencies (Optional)

If your Hostinger plan allows SSH and Composer:

```bash
cd /path/to/api
composer install --no-dev
```

If SSH not available, you can upload the `vendor/` folder from a local Composer install.

To prepare locally:
```bash
# On your local machine
composer install
# Then upload the entire api folder including vendor/
```

### Step 4: Configure Environment

1. Rename `.env.example` to `.env`
2. Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_NAME=your_database_name
   DB_USER=your_database_username
   DB_PASS=your_database_password

   JWT_SECRET=generate-a-random-secret-key-here-minimum-32-chars
   ```

3. Generate a strong JWT secret:
   ```bash
   php -r "echo bin2hex(random_bytes(32));"
   ```
   Copy the output into `JWT_SECRET`

4. For same-domain deployment, `ALLOWED_ORIGINS` is not required (CORS not used).
   Only set it if you need cross-origin requests.

5. If using email features (future), configure SMTP.

### Step 5: Configure Apache (if needed)

Hostinger typically auto-detects `.htaccess`. Ensure it's in the api folder:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api
RewriteRule ^.*$ index.php [L,QSA]
```

If your API is at a subdirectory like `/api`, configure accordingly.

### Step 6: Test API

1. Visit: `https://your-domain.com/api/` (adjust path)
   Should see API documentation page with "Status: ✓ Online"

2. Test health endpoint: `https://your-domain.com/api/health`

3. Test registration with Postman or curl:
   ```bash
   curl -X POST https://your-domain.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   ```

### Step 7: Connect Frontend

**For same-domain deployment** (frontend and backend on same domain):
- **Do NOT set** `VITE_API_URL` environment variable
- The frontend automatically uses relative path `/api` (same origin)
- Build the frontend normally: `npm run build`

**For local development:**
Create `.env.local` in frontend directory:
```env
VITE_API_URL=http://localhost:8000/api
```
Then run backend: `php -S localhost:8000` from `/api` folder.

The frontend's `api.ts` automatically detects the correct API URL based on environment.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### CV Analysis
- `POST /api/analysis/upload` - Upload CV file (multipart/form-data)
- `GET /api/analysis` - List user's CV analyses
- `GET /api/analysis/:id` - Get specific analysis
- `DELETE /api/analysis/:id` - Delete analysis

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile (theme, language, etc.)

### Job Postings (Interviewer only)
- `GET /api/jobs` - List my job postings
- `POST /api/jobs` - Create new job posting

### Candidate Search (Interviewer only)
- `POST /api/candidates/search` - Search candidates with filters

### Interview Prep
- `GET /api/interview/questions` - Get questions (query params: industry, role, difficulty, limit)
- `GET /api/interview/questions/:id` - Get specific question
- `POST /api/interview/practice` - Record practice response
- `GET /api/interview/practice` - Get practice history

### LinkedIn
- `POST /api/linkedin/analyze` - Analyze LinkedIn profile data
- `GET /api/linkedin/profile` - Get saved LinkedIn analysis

### Export
- `POST /api/export` - Export analysis (body: { format: 'json'|'html'|'docx', analysis_id: string })

### Share Links
- `POST /api/share` - Create share link (body: { analysis_id, expires_in_days?, password? })
- `GET /api/share/:token` - View shared analysis (public - may require password in body)
- `DELETE /api/share/:token` - Revoke share link

## File Upload

- Supported formats: PDF, DOCX, TXT
- Maximum size: 10MB (configurable via `MAX_FILE_SIZE` in .env)
- Uploaded files stored in `upload/` directory
- Files are parsed server-side using CLI tools (pdftotext) or PHP extensions

## Database Schema

See `install.sql` for full schema with all tables and indexes.

Key tables:
- `users` - User accounts with role-based access
- `profiles` - User preferences and profile data
- `cv_analyses` - CV analysis results
- `job_postings` - Interviewer job postings
- `job_applications` - Candidate applications
- `interview_questions` - Question bank
- `interview_practice` - User practice tracking
- `linkedin_profiles` - LinkedIn optimization data
- `share_links` - Shareable analysis links

## Authentication

JWT-based authentication:

1. Register/Login → receive `access_token` (15min) and `refresh_token` (7 days)
2. Include `Authorization: Bearer <access_token>` in all protected requests
3. When access token expires, send refresh token to `/api/auth/refresh` to get new access token
4. On logout, clear tokens from localStorage (no server invalidation currently)

Roles:
- `candidate` - Can upload and analyze own CVs
- `interviewer` - Can post jobs and search candidates
- `admin` - Full access (reserved)

## Security Notes

- Use HTTPS in production
- Set strong `JWT_SECRET` (minimum 32 random characters)
- Configure CORS `ALLOWED_ORIGINS` to only allow your frontend domain(s)
- Upload directory should be outside web root if possible (on Hostinger, place outside `public_html` and symlink if needed)
- Add rate limiting on API (can add via .htaccess or PHP if needed)
- Validate all inputs (current implementation has basic validation)

## Troubleshooting

**"Failed to connect to database"**
- Check DB credentials in `.env`
- Ensure database exists and user has permissions
- Verify DB host (usually `localhost` on Hostinger)

**"Class not found" errors**
- Ensure Composer dependencies installed: `composer install`
- If uploading via FTP, make sure `vendor/` directory is included

**PDF parsing returns empty text**
- Ensure `pdftotext` CLI is available on your Hostinger plan
- If not, install or use alternative PHP PDF library (e.g., `smalot/pdfparser`)
- For quick fix, the code falls back to simple text extraction which may be limited

**Upload fails (403 Forbidden)**
- Check `upload/` directory permissions (755)
- Hostinger may have file upload limits; check `upload_max_filesize` and `post_max_size` in php.ini
- If you can't change php.ini, add `.user.ini` in api folder:
  ```
  upload_max_filesize = 10M
  post_max_size = 12M
  ```

**Blank page / 500 error**
- Enable error reporting temporarily by adding at top of `index.php`:
  ```php
  ini_set('display_errors', 1);
  error_reporting(E_ALL);
  ```
- Check Hostinger error logs in hPanel

## Development

For local development:

1. Clone the repository
2. Copy `.env.example` to `.env` and fill with local DB
3. Run `composer install`
4. Import `install.sql` to your local MySQL
5. Start PHP built-in server:
   ```bash
   php -S localhost:8000
   ```
6. API will be at `http://localhost:8000/api/`
7. Set frontend `VITE_API_URL=http://localhost:8000/api`

## API Response Format

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Upcoming Features

- Email verification
- Password reset flow with email
- Admin dashboard for user management
- Advanced candidate matching with AI
- Real-time notifications (WebSocket)
- API rate limiting
- API documentation with Swagger

## Support

For issues or questions, check repository README or open an issue.

---

**Version:** 1.0.0
**Last Updated:** 2025
