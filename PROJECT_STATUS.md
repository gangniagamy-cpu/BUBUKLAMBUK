# Project Status: Misi Bubur Lambuk Sedekah Ramadan 2026

**Kitaran Hayat (Lifecycle)**: `Production Ready`
**Versi Semasa**: `v1.4.0` (Full 10/10 Quality Upgrade)

## Fasa 1: Minimum Viable Product (MVP) - (SELESAI)

- [x] Rangka HTML dan Pengiraan Asas
- [x] Paparan sasaran dan status semasa
- [x] Eksport ke fail CSV
- [x] Tema Warna Asas (Teal, Ivory, Gold)

## Fasa 2: Pemantapan Integrasi & Keselamatan - (SELESAI)

- [x] Menyelesaikan ralat `currentPax` tidak sejajar dengan rekod sumbangan.
- [x] Mencagarkan titik masuk dari Serangan Suntikan Ralat CSV (`CSV Injection`).
- [x] Ketepatan Logik Pemasa Kira Detik (Countdown Timer 00:00:00).
- [x] Mengubah suai logik pencapaian (Milestones) agar dinamis (100 pax increment).
- [x] Mengintegrasi fungsi *Overtime Mode* (Glow Emas, Alert Banner).

## Fasa 3: Asas Pendokumentasian & SOP Live - (SELESAI)

- [x] Penambahan struktur dokumentasi teras (README, PRD, ARCHITECTURE, dll.)
- [x] Penerapan Teori Live Khairul Aming ke dalam SOP Hos.
- [x] Penyesuaian masa operasi & plan kontingensi skala 2000 pek.
- [x] Pautan Sokongan Sahih (URL references) untuk rujukan auditan pada fail kajian.

## Fasa 4: Skala Harian & Keseragaman 2000 Pax - (SELESAI)

- [x] Default sasaran utama diseragamkan kepada 2000 pax (RM10,000).
- [x] Countdown dan header agihan dijadikan dinamik mengikut `distributionAt` + `location`.
- [x] Penjejakan CSV diperkukuh untuk audit multi-hari (timestamp penuh + ringkasan sesi).
- [x] Dokumen operasi kritikal diselaraskan kepada objektif 2000 pax.

## Fasa 5: Pemurnian Kualiti Penuh (10/10 Quality) - (SELESAI)

- [x] **Padam Donor Individual** — butang ❌ pada setiap baris jadual.
- [x] **Undo dengan Restore** — toast UNDO 8 saat untuk pulihkan donor yang dipadam.
- [x] **Target Fleksibel** — buang lantai minimum 2000, boleh set sebarang target.
- [x] **Validasi Input** — had nama 100 aksara, had pax 10,000.
- [x] **Countdown Hari** — tunjuk "X Hari Y Jam" jika tarikh agihan > 24 jam.
- [x] **Amaran Storan** — notifikasi auto jika donor > 3,000 rekod.
- [x] **Responsif Tablet** — breakpoint 768px baru untuk grid stats dan pakej.
- [x] **Favicon 🌙** — ikon tab browser tanpa fail luaran.
- [x] **Fix Subtitle Flash** — kosongkan HTML default, JS populate 100%.
- [x] **Kolum Aksi** — jadual donor kini ada kolum padam.

## Perancangan Akan Datang (Roadmap v2.0)

- Sistem Pengkalan Data Serentak (Real-time DB / Redis) untuk Pelbagai Pentadbir.
- Integrasi Pembacaan Terus API Komen TikTok (Automatik tambah data ke dalam UI).
- Analisis Sentimen (Sentiment Analysis) dalam komen.
