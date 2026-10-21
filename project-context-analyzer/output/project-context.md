## 1. Project Info

| Key | Value |
|---|---|
| Nama | laravel/laravel |
| Framework | Laravel ^13.8 |
| PHP | ? |
| Database | mysql (127.0.0.1) |
| Frontend | Vite ^8.0.0 + ^4.3.1 |

## 2. Folder Structure

```
project-root/
+-- app/
|   +-- Http/
|   +-- Models/
|   +-- Providers/
|   +-- Services/
+-- bootstrap/
|   +-- cache/
+-- config/
+-- database/
|   +-- factories/
|   +-- migrations/
|   +-- seeders/
+-- public/
|   +-- heroimg/
|   +-- images/
|   +-- marzipano/
|   +-- vt360/
+-- resources/
|   +-- css/
|   +-- js/
|   +-- views/
+-- routes/
+-- tests/
|   +-- Feature/
|   +-- Unit/
```

## 3. Route Map

| Method | URL | Handler |
|---|---|---|
| GET      | / | Closure |
| GET      | /galeri | Closure |
| GET      | /koleksi/{slug} | Closure |
| GET      | /pengrajin | Closure |
| GET      | /pengrajin/{id} | Closure |
| GET      | /virtual-tour | Closure |
| GET      | /proses-produksi | Closure |
| GET      | /tentang | Closure |
| GET      | /sejarah | Closure |
| GET      | /jelajah | Closure |
| GET      | /pengurus | Closure |
| GET      | /storytelling | Closure |
| PREFIX   | admin | Closure |
| GET      | login | Closure |
| POST     | login | Closure |
| POST     | logout | Closure |
| MIDDLEWARE | AdminAuth::class | Closure |
| GET      | dashboard | Closure |
| RESOURCE | collections | Closure |
| RESOURCE | artisans | Closure |
| PATCH    | artisans/{artisan}/toggle-featured | Closure |
| GET      | village-profile | Closure |
| PUT      | village-profile | Closure |
| RESOURCE | board-members | Closure |
| GET      | storytelling | Closure |
| PUT      | storytelling/chapters | Closure |
| RESOURCE | locations | Closure |
| RESOURCE | inventory | Closure |
| GET      | settings | Closure |
| PUT      | settings | Closure |

## 4. Database Schema


**users**
- name : string
- email : string
- password : string
- role : enum
- is_active : boolean
- last_login_at : timestamp
- failed_attempts : tinyInteger
- locked_until : timestamp
- email : string
- token : string
- created_at : timestamp
- id : string
- user_id : foreignId
- ip_address : string
- user_agent : text
- payload : longText
- last_activity : integer

**cache**
- key : string
- value : mediumText
- expiration : bigInteger
- key : string
- owner : string
- expiration : bigInteger

**jobs**
- queue : string
- payload : longText
- attempts : unsignedSmallInteger
- reserved_at : unsignedInteger
- available_at : unsignedInteger
- created_at : unsignedInteger
- id : string
- name : string
- total_jobs : integer
- pending_jobs : integer
- failed_jobs : integer
- failed_job_ids : longText
- options : mediumText
- cancelled_at : integer
- created_at : integer
- finished_at : integer
- uuid : string
- connection : string
- queue : string
- payload : longText
- exception : longText
- failed_at : timestamp

**artisans**
- name : string
- photo_url : string
- years_active : string
- specialty : string
- story : longText
- quote : text
- address : string
- phone : string
- is_featured : boolean
- sort_order : tinyInteger

**categories**
- name : string
- slug : string
- color_hex : char
- description : text
- sort_order : tinyInteger

**collections**
- name : string
- slug : string
- category_id : foreignId
- photo_url : string
- description : text
- history_origin : longText
- philosophy : longText
- technique : longText
- materials : text
- artisan_id : foreignId
- location : string
- year : smallInteger
- type : enum
- status : enum
- created_by : foreignId

**production_locations**
- artisan_id : foreignId
- name : string
- address : string
- latitude : decimal
- longitude : decimal
- phone : string
- main_products : text
- visit_capacity : string
- edu_activities : text
- is_open_visit : boolean
- photo_url : string

**production_stages**
- stage_number : tinyInteger
- title : string
- description : longText
- photo_url : string
- updated_at : timestamp

**history_pages**
- page_key : string
- title : string
- content : longText
- updated_at : timestamp

**village_profile**
- name : string
- description : text
- address : string
- latitude : decimal
- longitude : decimal
- gallery_photos : json
- updated_at : timestamp

**board_members**
- name : string
- position : string
- photo_url : string
- phone : string
- email : string
- sort_order : tinyInteger

**activity_logs**
- user_id : foreignId
- action : string
- target_type : string
- target_id : unsignedBigInteger
- old_value : longText
- new_value : longText
- ip_address : string
- created_at : timestamp

**virtual_tour**
- title : string
- description : text
- embed_type : enum
- embed_code : mediumText
- sanitized_code : mediumText
- is_active : boolean
- version_history : json
- updated_by : foreignId

**storytelling_chapters**
- chapter_key : string
- title : string
- content : json

## 5. Model Summary

| Model | Table | Fillable |
|---|---|---|
| ActivityLog | activitylog | user_id, action, target_type, target_id, old_value, new_value, ip_address |
| Artisan | artisan | name, photo_url, years_active, specialty, story, quote, address, phone, is_featured, sort_order |
| BoardMember | boardmember | name, position, photo_url, phone, email, sort_order |
| Category | category | name, slug, color_hex, description, sort_order |
| Collection | collection | name, slug, category_id, photo_url, description, history_origin, philosophy, technique, materials, artisan_id, location, year, type, status, created_by |
| HistoryPage | historypage | page_key, title, content |
| ProductionLocation | productionlocation | artisan_id, name, address, latitude, longitude, phone, main_products, visit_capacity, edu_activities, is_open_visit, photo_url |
| ProductionStage | productionstage | stage_number, title, description, photo_url |
| StorytellingChapter | storytellingchapter | chapter_key, title, content |
| User | user | - |
| VillageProfile | village_profile | name, description, address, latitude, longitude, gallery_photos |
| VirtualTour | virtual_tour | title, description, embed_type, embed_code, sanitized_code, is_active, version_history, updated_by |

## 6. Saran AGENTS.md

```markdown
# AGENTS.md — laravel/laravel

## Stack
- Laravel ^13.8
- PHP ?
- Database: mysql
- Frontend: Vite + Tailwind CSS

## Route Prefix
- Admin: /admin/* (middleware: auth)
- Public: /*

## Database Tables Utama
- users
- cache
- jobs
- artisans
- categories
- collections
- production_locations
- production_stages
- history_pages
- village_profile
- board_members
- activity_logs
- virtual_tour
- storytelling_chapters

## Perintah Run
- Dev: php artisan serve + npm run dev
- Build: npm run build
- Migrate: php artisan migrate
```
