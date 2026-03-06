# Architecture

Projek ini menggunakan seni bina *single-page app* berasaskan Vanilla (HTML + CSS + JavaScript) untuk operasi live yang pantas, ringan, dan tanpa build step.

## Teknologi

- **UI Structure**: HTML5 semantik.
- **Styling**: Vanilla CSS + CSS variables.
- **Logic Layer**: Vanilla JavaScript (ES6+), tiada framework.
- **Storage**: `window.localStorage` sebagai persistence tempatan.

## State Model

Objek `state` ialah sumber kebenaran tunggal untuk dashboard:

```javascript
{
  target: 2000,
  startPax: 500,
  currentPax: 500, // dikira semula dari startPax + sum(donors.pax)
  donors: [
    { id, name, pax, ref, time, verified }
  ],
  isLive: false,
  distributionAt: "2026-03-07T08:00:00.000Z",
  location: "Taman Melawati",
  campaignName: "Misi Bubur Lambuk",
  createdAt: "2026-03-06T12:00:00.000Z"
}
```

## Data Flow Utama

1. **Hydration**: `loadState()` + `hydrateState()` membaca dan normalisasi state dari LocalStorage.
2. **Mutation**: `addDonor()`, `deleteDonor()`, `restoreDonor()`, `updateTarget()`, `updateSessionMeta()` ubah state dan trigger render.
3. **Integrity**: `recalculateCurrentPax()` memastikan `currentPax` sentiasa canonical. `checkStorageWarning()` amaran jika > 3000 donors.
4. **Render Cycle**: `renderAll()` kemas kini metadata sesi, progress, stats, donor feed/table, live badge, dan amaran storan.
5. **Persistence**: `saveState()` simpan state selepas setiap perubahan.
6. **Undo**: Toast UNDO (8 saat window) membolehkan `restoreDonor()` memulihkan donor yang dipadam.

## Countdown & Session

- Countdown tidak lagi hardcoded tarikh tunggal.
- `startCountdown()` membaca `state.distributionAt` dan boleh dikemas kini dari Admin Panel (input `datetime-local`).
- Sokongan unit "Hari" jika tarikh agihan > 24 jam dari sekarang.
- Header live turut dipacu state (`distributionAt` + `location`), jadi mudah guna semula untuk kempen harian.

## Keselamatan & Audit

- `exportCSV()` ada perlindungan CSV injection (`=`, `+`, `-`, `@` diprefix `'`).
- Validasi input: nama max 100 aksara, pax max 10,000.
- CSV kini simpan:
  - Tarikh + masa lokal (MYT)
  - ISO timestamp
  - Ringkasan sesi (lokasi, tarikh agihan, target, baki)

## Roadmap v2

- Multi-admin real-time sync (Supabase/Firebase/Redis).
- Integrasi komen TikTok live secara automatik.
- Pipeline laporan harian automatik (dashboard + bukti agihan).
