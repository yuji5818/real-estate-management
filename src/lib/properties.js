import { supabase } from './supabaseClient'

// 物件一覧を取得する
// RLSにより自分（ログイン中のユーザー）が登録した物件のみが返ってくる
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 物件を新規登録する
export async function createProperty({ name, rent, area, layout }, userId) {
  const { data, error } = await supabase
    .from('properties')
    .insert({ name, rent, area, layout, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

// 物件を更新する（RLSにより自分が登録した物件のみ更新可能）
export async function updateProperty(id, { name, rent, area, layout }) {
  const { data, error } = await supabase
    .from('properties')
    .update({ name, rent, area, layout })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// 物件を削除する（RLSにより自分が登録した物件のみ削除可能）
export async function deleteProperty(id) {
  const { error } = await supabase.from('properties').delete().eq('id', id)

  if (error) throw error
}
