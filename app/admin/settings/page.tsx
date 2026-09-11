export default function SettingsPage() {
  return (
    <div>
      <div className="admin-form">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
          Настройки системы
        </h2>

        <div className="admin-form-group">
          <label className="admin-form-label">Название сайта</label>
          <input
            type="text"
            className="admin-form-input"
            defaultValue="A-FRAME KG"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Email администратора</label>
          <input
            type="email"
            className="admin-form-input"
            defaultValue="admin@aframe.kg"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Комиссия сервиса (%)</label>
          <input
            type="number"
            className="admin-form-input"
            defaultValue="15"
            min="0"
            max="100"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Валюта</label>
          <select className="admin-form-select">
            <option value="KGS">Сом (KGS)</option>
            <option value="USD">Доллар (USD)</option>
            <option value="EUR">Евро (EUR)</option>
          </select>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">
            <input type="checkbox" defaultChecked style={{ marginRight: '0.5rem' }} />
            Модерация отзывов
          </label>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">
            <input type="checkbox" defaultChecked style={{ marginRight: '0.5rem' }} />
            Автоматическое подтверждение бронирований
          </label>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">
            <input type="checkbox" style={{ marginRight: '0.5rem' }} />
            Режим технического обслуживания
          </label>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary">Сохранить изменения</button>
          <button className="admin-btn admin-btn-secondary">Отмена</button>
        </div>
      </div>

      <div className="admin-form" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
          Опасная зона
        </h2>

        <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          <strong>Очистка кэша</strong>
          <p style={{ fontSize: '0.875rem', color: '#991b1b', margin: '0.5rem 0' }}>
            Очистит все кэшированные данные. Может временно замедлить работу сайта.
          </p>
          <button className="admin-btn admin-btn-danger">Очистить кэш</button>
        </div>

        <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem' }}>
          <strong>Экспорт базы данных</strong>
          <p style={{ fontSize: '0.875rem', color: '#991b1b', margin: '0.5rem 0' }}>
            Создать резервную копию базы данных.
          </p>
          <button className="admin-btn admin-btn-secondary">Экспорт БД</button>
        </div>
      </div>
    </div>
  );
}
