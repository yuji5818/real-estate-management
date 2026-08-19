import { useEffect, useState } from 'react'

const emptyForm = { name: '', rent: '', area: '', layout: '' }

// 物件の新規登録・編集で共通利用するフォーム
// initialValueがあれば編集モード、なければ新規登録モードとして振る舞う
export default function PropertyForm({ initialValue, submitting, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValue ?? emptyForm)

  // 編集対象が切り替わったらフォームの内容も切り替える
  useEffect(() => {
    setForm(
      initialValue
        ? {
            name: initialValue.name,
            rent: initialValue.rent,
            area: initialValue.area,
            layout: initialValue.layout,
          }
        : emptyForm
    )
  }, [initialValue])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      name: form.name,
      rent: Number(form.rent),
      area: form.area,
      layout: form.layout,
    })
  }

  const isEditing = Boolean(initialValue)

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? '物件を編集' : '物件を新規登録'}</h2>

      <div className="property-form-grid">
        <label className="form-field">
          <span>物件名</span>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            required
            placeholder="例: サンシャイン渋谷"
          />
        </label>

        <label className="form-field">
          <span>家賃（円）</span>
          <input
            type="number"
            min="0"
            step="1"
            value={form.rent}
            onChange={handleChange('rent')}
            required
          />
        </label>

        <label className="form-field">
          <span>エリア</span>
          <input
            type="text"
            value={form.area}
            onChange={handleChange('area')}
            required
            placeholder="例: 東京都渋谷区"
          />
        </label>

        <label className="form-field">
          <span>間取り</span>
          <input
            type="text"
            value={form.layout}
            onChange={handleChange('layout')}
            required
            placeholder="例: 1LDK"
          />
        </label>
      </div>

      <div className="property-form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : isEditing ? '更新する' : '登録する'}
        </button>
        {isEditing && (
          <button type="button" className="button-secondary" onClick={onCancel} disabled={submitting}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
