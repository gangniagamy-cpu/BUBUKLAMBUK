# 💰 TEMPLATE KEWANGAN & REKOD LIVE

## Misi 2000 Pax Bubur Lambuk

---

## 1. HEADER SHEET (Google Sheets / Excel)

### Tab 1: REKOD PENYUMBANG

| Column | Header | Format | Contoh |
|--------|--------|--------|--------|
| A | No | Auto-number | 1, 2, 3... |
| B | Tarikh Masa | DD/MM/YYYY HH:MM:SS | 06/03/2026 21:15:34 |
| C | Nama | Text | Puan Aminah |
| D | Pax | Number | 10 |
| E | RM | Formula: =D×5 | 50 |
| F | Ref Transaksi | Text | TNG-12345 |
| G | Status | Dropdown | Pending / Verified |
| H | Disahkan Oleh | Text | Mod Aiman |
| I | Disebut Live | Y/N | Y |
| J | Catatan | Text | Niat arwah bapa |

### Tab 2: DASHBOARD (Auto-formula)

| Metrik | Formula | Contoh |
|--------|---------|--------|
| Jumlah Penyumbang | =COUNTA(C:C)-1 | 45 |
| Jumlah Pax | =SUM(D:D) | 780 |
| Jumlah RM | =SUM(E:E) atau =Jumlah Pax × 5 | 3,900 |
| Target Pax | Manual | 2000 |
| Baki Pax | =Target - Jumlah Pax | 720 |
| Baki RM | =Baki Pax × 5 | 3,600 |
| % Siap | =Jumlah Pax / Target × 100 | 52% |
| Purata Pax/Donor | =Jumlah Pax / Jumlah Penyumbang | 17.3 |
| Verified | =COUNTIF(G:G,"Verified") | 42 |
| Pending | =COUNTIF(G:G,"Pending") | 3 |

### Tab 3: PERBELANJAAN BAHAN

| Column | Header | Contoh |
|--------|--------|--------|
| A | Bahan | Beras |
| B | Kuantiti | 30 kg |
| C | Harga Seunit | RM3.50/kg |
| D | Jumlah | RM105 |
| E | Resit # | R001 |
| F | Tarikh Beli | 6/3/2026 |

**Jumlah Perbelanjaan** = SUM(D:D)
**Baki Dana** = Jumlah RM Kutipan - Jumlah Perbelanjaan

---

## 2. FORMULA PENTING

```
Jumlah Pax = Jumlah RM / 5
Baki Pax = Target Pax - Pax Terkumpul
Baki RM = Baki Pax × 5
% Siap = (Pax Terkumpul / Target Pax) × 100
KPI Kelajuan = Pax Terkumpul Sekarang / Minit Live Berlalu
Anggaran Masa Siap = Baki Pax / KPI Kelajuan (minit)
```

---

## 3. SOP ALIRAN KEWANGAN

### Aliran Kutipan

```
VIEWER komen "DONE 10"
    ↓
MOD CHAT reply: "Terima kasih, sila transfer RM50 ke [QR/AKAUN]"
    ↓
VIEWER transfer RM50
    ↓
FINANCE cek akaun → RM50 masuk ✅
    ↓
FINANCE update sheet: Status = VERIFIED
    ↓
MOD CHAT reply: "VERIFIED ✅ Terima kasih!"
    ↓
HOST sebut nama + pax live
    ↓
SCOREBOARD update dashboard
```

### Aliran Perbelanjaan

```
BAHAN diperlukan
    ↓
OPS beli bahan → simpan resit
    ↓
FINANCE rekod dalam Tab Perbelanjaan
    ↓
Foto resit disimpan dalam folder /bukti-resit/
    ↓
Report akhir: Kutipan - Perbelanjaan = Baki dana
```

---

## 4. TEMPLATE LAPORAN HARIAN

```markdown
## 📊 LAPORAN KUTIPAN — [TARIKH]

### Ringkasan
- Target: [X] pax
- Terkumpul: [Y] pax ([Z]%)
- Baki: [W] pax
- Jumlah RM: RM[A]
- Jumlah Penyumbang: [B] orang
- Purata: [C] pax/donor

### Perbelanjaan
- Jumlah beli bahan: RM[D]
- Baki dana: RM[E]

### Status Agihan
- [ ] Masak siap
- [ ] Packaging siap
- [ ] Agihan bermula
- [ ] Agihan selesai
- [ ] Bukti dipost

### Bukti
- Foto bahan: [link]
- Video masak: [link]
- Foto agihan: [link]
- Screenshot transaksi: [link]
```

---

## 5. CHANNEL PEMBAYARAN

### Setup QR

- **1 akaun sahaja** untuk elak kekeliruan
- Pilihan: Touch 'n Go eWallet / Bank Islam / Maybank QR
- QR mestilah:
  - Jelas & besar (boleh scan dari skrin live)
  - Ada nama penerima yang sama dengan nama kempen
  - Test scan sebelum live

### Info untuk Dipaparkan

```
INFAQ BUBUR LAMBUK
Akaun: [NAMA AKAUN]
Bank: [NAMA BANK]
No: [NOMBOR AKAUN]
QR: [GAMBAR QR]
```

---

## 6. AUDIT CHECKLIST (Selepas Live)

- [ ] Total dalam sheet = Total dalam akaun bank
- [ ] Semua transaksi ada status (Verified/Pending)
- [ ] Tiada transaksi Pending yang belum diselesaikan
- [ ] Screenshot final dashboard disimpan
- [ ] CSV exported dan disimpan
- [ ] Resit pembelian bahan lengkap
- [ ] Laporan harian disiapkan dan dipost
