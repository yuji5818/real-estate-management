import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyForm from '../components/PropertyForm'
import { useAuth } from '../context/AuthContext'
import { createProperty, deleteProperty, fetchProperties, updateProperty } from '../lib/properties'

// 家賃を「¥123,000」の形式で表示する
const formatRent = (rent) => `¥${Number(rent).toLocaleString()}`

// 物件一覧画面（ログイン後のトップページ）
// Supabaseのpropertiesテーブルに対してCRUD操作を行う
export default function PropertyList() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null) // null: 新規登録モード
  const [deletingId, setDeletingId] = useState(null)

  // 物件一覧を取得する（SELECT）
  const loadProperties = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch {
      setErrorMessage('物件一覧の取得に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  // 新規登録（INSERT）・編集（UPDATE）を共通で処理する
  const handleSubmit = async (values) => {
    setSubmitting(true)
    setErrorMessage('')
    try {
      if (editingProperty) {
        const updated = await updateProperty(editingProperty.id, values)
        setProperties((prev) => prev.map((property) => (property.id === updated.id ? updated : property)))
        setEditingProperty(null)
      } else {
        const created = await createProperty(values, user.id)
        setProperties((prev) => [created, ...prev])
      }
    } catch {
      setErrorMessage('保存に失敗しました。入力内容をご確認ください。')
    } finally {
      setSubmitting(false)
    }
  }

  // 物件の削除（DELETE）
  const handleDelete = async (id) => {
    const confirmed = window.confirm('この物件を削除しますか？')
    if (!confirmed) return

    setDeletingId(id)
    setErrorMessage('')
    try {
      await deleteProperty(id)
      setProperties((prev) => prev.filter((property) => property.id !== id))
      if (editingProperty?.id === id) {
        setEditingProperty(null)
      }
    } catch {
      setErrorMessage('削除に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="properties-page">
      <header className="properties-header">
        <div>
          <h1>物件一覧</h1>
          <p className="logged-in-user">ログイン中: {user?.email}</p>
        </div>
        <button type="button" onClick={handleLogout}>
          ログアウト
        </button>
      </header>

      <PropertyForm
        key={editingProperty?.id ?? 'new'}
        initialValue={editingProperty}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => setEditingProperty(null)}
      />

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      {loading ? (
        <p className="page-hint">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="page-hint">登録されている物件がありません。上のフォームから登録してください。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <h2>{property.name}</h2>
              <p className="property-rent">{formatRent(property.rent)} / 月</p>
              <p className="property-area">{property.area}</p>
              <p className="property-layout">{property.layout}</p>

              <div className="property-card-actions">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setEditingProperty(property)}
                >
                  編集
                </button>
                <button
                  type="button"
                  className="button-danger"
                  onClick={() => handleDelete(property.id)}
                  disabled={deletingId === property.id}
                >
                  {deletingId === property.id ? '削除中...' : '削除'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
