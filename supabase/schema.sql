-- ==============================================================
-- 不動産管理アプリ: propertiesテーブルの作成
-- Supabaseダッシュボードの SQL Editor で実行してください。
-- ==============================================================

-- 物件テーブル
-- ・物件名、家賃、エリア名、間取りを保存する
-- ・user_idで「誰が登録した物件か」を記録する
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  rent integer not null check (rent >= 0),
  area text not null,
  layout text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- user_idでの絞り込みを高速化するインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- 更新時にupdated_atを自動更新する関数
create or replace function public.set_properties_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row
  execute function public.set_properties_updated_at();

-- ------------------------------------------------------------
-- RLS（Row Level Security）の設定
-- 「自分が登録した物件のみ表示・編集・削除できる」ようにする
-- ------------------------------------------------------------
alter table public.properties enable row level security;

-- 参照: 自分が登録した物件のみ取得できる
drop policy if exists "Users can view their own properties" on public.properties;
create policy "Users can view their own properties"
  on public.properties
  for select
  using (auth.uid() = user_id);

-- 登録: 自分のuser_idとしてのみ登録できる
drop policy if exists "Users can insert their own properties" on public.properties;
create policy "Users can insert their own properties"
  on public.properties
  for insert
  with check (auth.uid() = user_id);

-- 更新: 自分が登録した物件のみ更新できる
drop policy if exists "Users can update their own properties" on public.properties;
create policy "Users can update their own properties"
  on public.properties
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 削除: 自分が登録した物件のみ削除できる
drop policy if exists "Users can delete their own properties" on public.properties;
create policy "Users can delete their own properties"
  on public.properties
  for delete
  using (auth.uid() = user_id);
