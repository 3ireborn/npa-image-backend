# 🧠 NPA Image Backend (Vercel)

Backend ringan untuk NPA Image Lab.  
Fungsi: menerima prompt dari frontend (GitHub Pages) → kirim ke OpenAI DALL·E → kembalikan base64 image.

---

### 🔧 Deploy di Vercel
1. Buat repo baru di GitHub (nama: `npa-image-backend`)
2. Upload file:
   - `package.json`
   - `vercel.json`
   - `api/generate-image.js`
   - `README.md`
3. Masuk ke [https://vercel.com](https://vercel.com)
4. Klik **“Add New Project → Import from GitHub”**
5. Tambah **Environment Variable**:
