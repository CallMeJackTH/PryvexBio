# Pryvex Bio (Vercel + Supabase)

ค่าตั้งค่าทั้งหมด (รหัสแอดมิน, คีย์ Supabase) ต้องตั้งเป็น Environment Variables ในระบบโฮสต์ (เช่น Vercel) และห้ามเก็บไว้ใน repo

1. Supabase > SQL Editor: รันไฟล์ supabase.sql หนึ่งครั้ง
2. ตั้ง Environment Variables ตามไฟล์ .env.example (ADMIN_PASSWORD, SESSION_SECRET, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY)
3. อัปโฟลเดอร์นี้ขึ้น GitHub เป็น **Private** แล้ว Import เข้า Vercel (Framework: Other) หรือใช้ Vercel CLI: vercel --prod
4. กดที่รูปโปรไฟล์เพื่อเข้าแอดมิน (รหัสตาม ADMIN_PASSWORD)

ความปลอดภัย (สำคัญ):
- ถ้าคุณเคย commit คีย์จริงไปแล้ว ให้ rotate/regen คีย์ Supabase และลบคีย์เก่า
- ห้ามเปิด repo นี้เป็น Public ถ้าคีย์ยังอยู่ในไฟล์

