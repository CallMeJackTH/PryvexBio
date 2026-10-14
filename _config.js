// ไฟล์ตั้งค่ารวม (ฝั่งเซิร์ฟเวอร์เท่านั้น ไม่ถูกส่งไปที่เบราว์เซอร์)
// ห้ามนำไฟล์นี้ขึ้น GitHub แบบ public
const C = {
  ADMIN_PASSWORD: '558899',
  SESSION_SECRET: '87b5ab1631aa985f7f12d33573eb58d438fdc142c1f0b03f',
  SUPABASE_URL: 'https://bfoqxsjlucmjvepbiycm.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_dRiNAwktfCr9tLCaIIbC-A_MUdMmMnL',
  SUPABASE_SECRET_KEY: 'sb_secret_-9PKXbKbJh29Mb4Mct4Zxw_QyVb3gT1',
};
// ถ้าตั้ง Environment Variable ใน Vercel ไว้ จะใช้ค่านั้นก่อน
module.exports = (k) => process.env[k] || C[k];
