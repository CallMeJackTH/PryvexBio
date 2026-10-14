# Pryvex Bio (Vercel)
1. อัปโหลดโฟลเดอร์นี้ขึ้น GitHub แล้ว Import เข้า Vercel (Framework: Other)
2. Vercel > Storage: สร้าง Upstash Redis (ได้ KV_REST_API_URL / KV_REST_API_TOKEN) และ Blob (ได้ BLOB_READ_WRITE_TOKEN) แล้ว Connect เข้าโปรเจกต์
3. Settings > Environment Variables: เพิ่ม ADMIN_PASSWORD (=558899) และ SESSION_SECRET (ข้อความสุ่มยาวๆ)
4. Deploy (หรือ Redeploy หลังตั้งค่า env) แล้วกดที่รูปโปรไฟล์เพื่อเข้าแอดมิน
รหัสผ่านไม่อยู่ใน HTML/โค้ดฝั่งผู้ใช้ — ตรวจที่ /api/login ฝั่งเซิร์ฟเวอร์เท่านั้น
