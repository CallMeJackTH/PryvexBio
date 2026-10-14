-- รันใน Supabase > SQL Editor
create table if not exists site_config (id text primary key, data jsonb not null);
alter table site_config enable row level security;
create policy "public read" on site_config for select using (true);
-- ไม่มี policy เขียน: การเขียนทำผ่านเซิร์ฟเวอร์ด้วย secret key เท่านั้น

insert into storage.buckets (id, name, public) values ('pryvex', 'pryvex', true)
on conflict (id) do nothing;
