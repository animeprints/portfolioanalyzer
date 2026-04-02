IMPORTANT: HOW TO UPLOAD CORRECTLY

STEP 1: Extract the zip file
You will get a folder named: api-deploy

STEP 2: Open that folder
Inside you should see:
  .env
  .htaccess
  index.php
  install.sql
  config/
  controllers/
  middleware/
  models/
  utils/
  upload/
  vendor/
  test-cors.php
  diagnostics.php

STEP 3: Upload ALL these items (files and folders) to:
  Hostinger → public_html/api/

NOT like this:
  public_html/api/api-deploy/   <-- WRONG (will cause 404)

BUT like this:
  public_html/api/.env          <-- Correct
  public_html/api/.htaccess     <-- Correct
  public_html/api/index.php     <-- Correct
  public_html/api/upload/       <-- Correct
  etc.

STEP 4: Verify structure in Hostinger File Manager
Navigate to public_html/api/
You should see index.php, .env, .htaccess directly in that folder.

STEP 5: Set permissions
upload/ → 755
.env → 644
All .php files → 644

STEP 6: Test
https://dizitrends.cardzey.com/api/health
Should return: {"status":"ok"}
