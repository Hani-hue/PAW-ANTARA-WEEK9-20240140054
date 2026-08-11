# Todo API (Express + Sequelize + PostgreSQL)

Struktur MVC simple, auth pake session (bukan JWT), buat login & CRUD todo.

## Struktur folder
```
todo-api/
├── app.js                  # entry point
├── config/
│   └── database.js         # koneksi sequelize
├── models/
│   ├── user.model.js
│   ├── todo.model.js
│   └── index.js
├── controllers/
│   ├── auth.controller.js
│   └── todo.controller.js
├── middlewares/
│   └── auth.middleware.js  # cek session login
├── routes/
│   ├── auth.routes.js
│   └── todo.routes.js
├── seeders/
│   └── seed.js              # data dummy user & todo
└── utils/
    └── response.js         # format response konsisten
```

## Cara install & jalanin

1. Bikin database postgres dulu:
```sql
CREATE DATABASE todo_db;
```

2. Copy `.env.example` jadi `.env`, terus sesuaikan kredensial DB kamu.

3. Install dependency:
```bash
npm install
```

4. Jalankan server:
```bash
npm run dev
```
Tabel `users` dan `todos` bakal otomatis kebuat pas server pertama kali nyala (lewat `sequelize.sync()`).

## Seeder (data dummy)

Buat isi database dengan data awal (2 user + beberapa todo), tinggal jalanin:
```bash
npm run seed
```
Ini bakal bikin (atau skip kalo udah ada, aman dijalanin berkali-kali):
- User `rizki` & `budi`, password sama-sama `password123`
- Beberapa todo dummy punya masing-masing user

Setelah itu langsung bisa login pake salah satu user di atas buat testing endpoint todo.

## Endpoint

### Auth
| Method | Endpoint            | Body                          | Keterangan          |
|--------|----------------------|--------------------------------|----------------------|
| POST   | /api/auth/register   | `{ username, password }`      | Daftar user baru     |
| POST   | /api/auth/login      | `{ username, password }`      | Login, bikin session |
| POST   | /api/auth/logout     | -                              | Logout               |

### Todo (wajib login / punya session valid)
| Method | Endpoint                     | Body                                        | Keterangan                          |
|--------|-------------------------------|----------------------------------------------|---------------------------------------|
| GET    | /api/todos                   | -                                             | List semua todo user                 |
| GET    | /api/todos?project_id=1      | -                                             | List todo, difilter per project      |
| POST   | /api/todos                   | `{ title, project_id? }`                     | Tambah todo baru (project_id opsional) |
| PUT    | /api/todos/:id                | `{ title?, is_done?, project_id? }`          | Update todo, termasuk pindah project |
| DELETE | /api/todos/:id                | -                                             | Hapus todo                           |

### Project (wajib login / punya session valid)
| Method | Endpoint            | Body                          | Keterangan                          |
|--------|-----------------------|--------------------------------|----------------------------------------|
| GET    | /api/projects         | -                               | List semua project user               |
| GET    | /api/projects/:id      | -                               | Detail project + todo di dalamnya     |
| POST   | /api/projects          | `{ name, description? }`       | Tambah project baru                   |
| PUT    | /api/projects/:id       | `{ name?, description? }`      | Update project                        |
| DELETE | /api/projects/:id       | -                               | Hapus project (todo di dalamnya ikut kehapus) |

## Format response
Semua response pake format seragam:
```json
{
  "code": 200,
  "success": true,
  "message": "...",
  "data": { }
}
```

## Catatan
- Auth pake `express-session`, session id disimpan di cookie `connect.sid`. Kalo test pake Postman/Insomnia, pastiin cookie di-enable biar session kebawa antar-request.
- Kalo mau deploy production, ganti session store default (in-memory) ke store yang persist, misal `connect-pg-simple` biar session gak ilang tiap restart server.
