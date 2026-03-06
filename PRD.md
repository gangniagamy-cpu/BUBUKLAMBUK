# Product Requirements Document (PRD)

**Nama Projek**: Dashboard Live TikTok Misi Bubur Lambuk Sedekah Ramadan 2026
**Tujuan Umum**: Meningkatkan penglibatan (*engagement*) penonton live, membina kredibiliti telus, dan mempercepatkan kutipan infaq sehingga sasaran utama **2000 Pax (RM10,000)** dicapai dalam masa 1 jam.

## Objektif Perniagaan (Business Goals)

1. **Meningkatkan Penukaran (Conversion)**: Gunakan kesan psikologi "FOMO" melalui paparan sasaran secara langsung.
2. **Ketelusan (Transparency)**: Semua penyumbang dapat melihat *real-time* jumlah dan nama mereka disebut oleh hos.
3. **Bebas Ralat & Sekuriti**: Data wajib kekal walaupun halaman *di-refresh* dan bebas dari serangan `CSV Injection`.
4. **Audio & Visual Cues (Khairul Aming Model)**: Menyampaikan bunyi "ka-ching" dan kesan glow animasi supaya tiada "dead aircell".

## Keperluan Berfungsi (Functional Requirements)

### Paparan Utama (Live Dashboard)

* **Akaun Terkumpul**: Menggabungkan `Start Pax` (angka benih awal) dan jumlah semua derma semasa (`currentPax`).
* **Meter Progres**: Bulatan kemajuan visual (Progress Ring) dan Penunjuk Bar yang bergerak sejajar dengan sasaran.
* **Overtime Mode (Stretch Target)**: Apabila `currentPax` > `targetPax`, keseluruhan sistem perlu bercahaya Emas (Gold Glow) dan memaparkan sepanduk "TARGET ACHIEVED".
* **Senarai Penderma Cepat**: Tatalan langsung nama-nama penyumbang secara automatik.

### Papan Pentadbir (Admin Panel)

* **Tambah Sumbangan Cepat**: Input untuk `Nama` dan butang pantas (`1/5/10/20/50/100 pax`).
* **Penggera Bunyi (Audio Tiers)**:
  * Sumbangan < 10 pax (Tier 1 Sound - Pendek/Ringan)
  * Sumbangan 10+ pax (Tier 2 Sound - Sederhana)
  * Sumbangan 50+ pax (Tier 3 Sound - Gamat/Meriah)
* **Butang Panik (Boost to 2000!)**: Menetapkan terus sasaran baharu kepada 2000 secara manual sekiranya momentum sedang laju.
* **Sesi Dinamik**: Tarikh/masa agihan dan lokasi boleh dikemaskini dari Admin Panel tanpa edit kod.

## Keperluan Teknikal (Non-Functional Requirements)

* Sokongan Pelayar Klasik & Moden.
* Penyimpanan data secara *Offline* dalam LocalStorage.
* Eksport ke format *.csv* untuk simpanan audit kewangan.
* Pengendalian Ralat: Format CSV mesti terhindar dari pemprosesan formula (`=`, `+`, `-`, `@`).
