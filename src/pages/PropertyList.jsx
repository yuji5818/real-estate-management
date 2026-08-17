import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dummyProperties } from '../data/dummyProperties'

// 家賃を「¥123,000」の形式で表示する
const formatRent = (rent) => `¥${rent.toLocaleString()}`

// 物件一覧画面（ログイン後のトップページ）
export default function PropertyList() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
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

      <div className="property-grid">
        {dummyProperties.map((property) => (
          <div className="property-card" key={property.id}>
            <h2>{property.name}</h2>
            <p className="property-rent">{formatRent(property.rent)} / 月</p>
            <p className="property-area">{property.area}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
