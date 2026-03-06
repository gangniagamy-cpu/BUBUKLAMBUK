# Arahan Ejen AI (AGENTS.md)

Fail ini adalah sumber kebenaran (Source of Truth) terutamanya kepada ejen LLM (Large Language Model) seperti OpenClaw, Claudebot The NiagaBot, Gemini, dan lain-lain ejen yang diarahkan untuk mengurus, menyunting, dan meningkatkan tahap kebergunaan (maintainability) repositori kod ini.

## Prinsip Global untuk Ejen

1. **Pemeliharaan Struktur Vanilla**: Dilarang meletakkan perpustakaan NPM melainkan diarahkan dengan sangat spesifik. Ini projek `Vanilla JS`, pertahankan ia.
2. **Jangan Ganggu Warna Korporat**: Aplikasi *harus* mematuhi arahan tema Raudhah:
    * Teal (Utama)
    * Ivory (Latar belakang cerah)
    * Gold (Elemen Overtime, Tarikan Penting). Rujuk `styles.css`.
3. **Kesedaran Penuh terhadap Kajian TikTok**: Apabila ejen ditanya atau diarahkan mengubah logik kempen (SOP, Masa, CTA), sentiasa rujuk dokumentasi `docs/DEEP-RESEARCH-KHAIRUL-AMING.md` dan `docs/RESEARCH-TIKTOK-LIVE.md` terlebih dahulu.

## Panduan Pembangunan Pantas Ejen

Ejen yang menyentuh `n:\BUBURLAMBUK\app.js` perlu prihatin terhadap:

1. **Pengiraan Semula (Recalculation)**: Jika anda ubah nilai logik pertambahan `donors`, pastikan anda tidak memecahkan `currentPax` yang wajib mengira formula => `startPax + sum(donor.pax)`.
2. **Pemformatan Output Excel**: Ejen dilarang memadam fungsi pengaman (escaping mechanism) formula `=` di dalam fungsi `exportCSV()`.
3. **Animasi Canggih `styles.css`**: Rujuk kelas `.progress-ring-wrapper.overtime` dan `.target-achieved-banner.active`. Pastikan gaya utama overtime tidak dibuang.

## Sekiranya Pindah Platform

Jika *USER* bersetuju beralih kepada rekaan yang lebih canggih, rujuk `architecture.md` untuk gambaran data aliran. Mulakan tugas dengan membina rangka (skeleton) Next.js, tapi sentiasa simpan folder asas (vanilla) ini untuk rujukan versi paling pantas (fallback version).
