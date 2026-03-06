# Misi Bubur Lambuk Sedekah Ramadan 2026 - Live Dashboard

Selamat datang ke projek **Dashboard Live TikTok Misi Bubur Lambuk Sedekah Ramadan 2026**. Projek ini adalah sistem paparan *real-time* yang direka khusus untuk mengurus, memantau, dan memacu kutipan infaq secara langsung (live streaming) menggunakan strategi pemangkin (game changer) ala Khairul Aming.

## 📌 Ringkasan Projek (Overview)

Projek ini bertujuan untuk mencapai sasaran sumbangan **2000 pek bubur lambuk (RM10,000)** dalam tempoh yang sangat singkat sewaktu siaran langsung (live). Dashboard ini berfungsi sebagai *sumber kebenaran tunggal* (Single Source of Truth) bagi hos live dan kru teknikal.

### Ciri-ciri Utama (Key Features)

* **Pemantauan Masa Nyata**: Menjejaki jumlah dana yang terkumpul (Start Pax + Donors = Current Pax) secara terus.
* **Overtime Mode (Glow Emas)**: Kesan visual keemasan dan pendaran yang diaktifkan secara automatik apabila sasaran awal dicapai, menggalakkan "FOMO" dan "Stretch Target".
* **Notifikasi Pembesar Suara (Sound Alerts)**: Audio tiga-peringkat berdasarkan jumlah infaq untuk mengekalkan tenaga hos.
* **Boost Target (Butang Panik)**: Sistem automatik untuk terus menaikkan skala sasaran kepada 2000 pax apabila graf momentum sedang mendaki ("pucuk").
* **Sesi Agihan Dinamik**: Tarikh/masa agihan dan lokasi boleh diubah terus dari Admin Panel tanpa sentuh kod.
* **Padam & Undo Donor**: Butang ❌ padam donor individual dari jadual + toast UNDO 8 saat untuk pulihkan kesilapan.
* **Target Fleksibel**: Sasaran boleh ditetapkan sebarang nilai (500, 1000, 2000, 3000 dll.) mengikut keperluan harian.
* **Eksport CSV Selamat**: Memuat turun data sumbangan dengan pantas tanpa risiko *CSV Injection*.

## 🚀 Cara Penggunaan (How to Run)

Projek ini dibina menggunakan teknologi *Vanilla* (HTML, CSS, JavaScript) tulen tanpa framework kompleks, untuk memastikan prestasi maksimum pada sebarang OS.

1. Muat turun atau *clone* repositori ini.
2. Tiada *Node.js* atau *bundler* (seperti Webpack/Vite) diperlukan.
3. Hanya klik dua kali (**double-click**) pada fail `index.html` untuk membukanya di mana-mana pelayar web moden (Chrome, Safari, Edge, Firefox).

## 🗂 Struktur Projek

* `index.html`: Struktur utama antaramuka (UI) Dashboard dan Admin Panel (disembunyikan secara visual).
* `styles.css`: Gaya persembahan visual, mematuhi prinsip rekabentuk premium (Teal, Gold, Ivory).
* `app.js`: Logik aplikasi utama (Pengurusan State, Manipulasi DOM, Kesan Audio, Eksport Data).
* `docs/`: Folder utama yang mengandungi **Standard Operating Procedure (SOP)** perniagaan, pelan rekabentuk (canva), sukatan bahan, integrasi TikTok, dan kajian pasaran (Khairul Aming playbook).

## 🔒 Privasi & Keselamatan

Semua data (nama panel, jumlah kutipan) disimpan secara tempatan di dalam *Local Storage* pelayar pengguna sehingga anda reset data atau clear cache. Tiada pangkalan data awan (cloud database) yang disambungkan dalam versi ini. Sentiasa pastikan tekan butang "Export to CSV" selepas tamat setiap sesi.

## 🤝 Pasukan & Ejen AI

Projek ini diuruskan bersama oleh pasukan operasi manusia dan ejen AI berautonomi (OpenClaw). Sila rujuk fail `AGENTS.md` untuk arahan spesifik interaksi bersama agen.

> **Sedia untuk memecahkan rekod RM10K / 2000 pek? Let's go! 🚀**
