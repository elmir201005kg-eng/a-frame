import React, { useState } from "react";

import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { initialData, loadData, saveData } from "./data";

const menu = [
  {
    icon: "📊",
    title: "Dashboard",
    path: "/admin",
  },
  {
    icon: "🏠",
    title: "Домики",
    path: "/admin/cabins",
  },
  {
    icon: "📅",
    title: "Бронирования",
    path: "/admin/bookings",
  },
  {
    icon: "👥",
    title: "Пользователи",
    path: "/admin/users",
  },
  {
    icon: "⭐",
    title: "Отзывы",
    path: "/admin/reviews",
  },
  {
    icon: "📍",
    title: "Регионы",
    path: "/admin/regions",
  },
  {
    icon: "🛏️",
    title: "Удобства",
    path: "/admin/amenities",
  },
  {
    icon: "🎁",
    title: "Акции",
    path: "/admin/promotions",
  },
];

const labels = {
  ACTIVE: "Активен",
  INACTIVE: "Неактивен",
  BLOCKED: "Заблокирован",

  PUBLISHED: "Опубликован",
  PENDING: "На проверке",
  DRAFT: "Черновик",

  CONFIRMED: "Подтверждено",
  CANCELLED: "Отменено",
  COMPLETED: "Завершено",
  REJECTED: "Отклонено",

  HIDDEN: "Скрыт",

  USER: "Пользователь",
  OWNER: "Владелец",
  ADMIN: "Администратор",
};

function App() {
  const [data, setData] = useState(loadData);

  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("aframe_admin_auth") === "true"
  );

  function updateData(newData) {
    setData(newData);
    saveData(newData);
  }

  function login() {
    localStorage.setItem("aframe_admin_auth", "true");
    setIsAdmin(true);
  }

  function logout() {
    localStorage.removeItem("aframe_admin_auth");
    setIsAdmin(false);
  }

  if (!isAdmin) {
    return (
      <Routes>
        <Route
          path="*"
          element={<Login onLogin={login} />}
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Layout logout={logout}>
            <AdminRoutes
              data={data}
              updateData={updateData}
            />
          </Layout>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/admin" replace />}
      />
    </Routes>
  );
}

/* =========================
        LOGIN
========================= */

function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@aframe.kg");
  const [password, setPassword] = useState("admin123");

  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();

    if (
      email === "admin@aframe.kg" &&
      password === "admin123"
    ) {
      onLogin();
    } else {
      setError("Неверный email или пароль");
    }
  }

  return (
    <div className="login-page">
      <form
        className="login-card"
        onSubmit={submit}
      >
        <div className="login-logo">A</div>

        <h1>
          A-FRAME <span>KG</span>
        </h1>

        <p>Панель администратора</p>

        <label>
          Email

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </label>

        <label>
          Пароль

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button className="primary full">
          Войти
        </button>

        <small>
          Демо: admin@aframe.kg / admin123
        </small>
      </form>
    </div>
  );
}

/* =========================
        LAYOUT
========================= */

function Layout({ children, logout }) {
  const location = useLocation();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const current =
    menu.find(
      (item) =>
        location.pathname === item.path ||
        (item.path !== "/admin" &&
          location.pathname.startsWith(
            item.path
          ))
    ) || menu[0];

  return (
    <div className="app">
      <aside
        className={
          mobileMenu
            ? "sidebar open"
            : "sidebar"
        }
      >
        <div className="brand">
          <div className="brand-logo">
            A
          </div>

          <div>
            <strong>A-FRAME</strong>
            <span>KG ADMIN</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() =>
                setMobileMenu(false)
              }
              className={
                location.pathname === item.path ||
                (item.path !== "/admin" &&
                  location.pathname.startsWith(
                    item.path
                  ))
                  ? "active"
                  : ""
              }
            >
              <span>{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <Link to="/admin/settings">
            ⚙️ Настройки
          </Link>

          <button onClick={logout}>
            🚪 Выйти
          </button>
        </div>
      </aside>

      {mobileMenu && (
        <div
          className="overlay"
          onClick={() =>
            setMobileMenu(false)
          }
        />
      )}

      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            ☰
          </button>

          <div>
            <h2>{current.title}</h2>
            <p>
              Управление платформой A-FRAME KG
            </p>
          </div>

          <div className="admin-user">
            👤 Администратор
          </div>
        </header>

        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
}

/* =========================
        ROUTES
========================= */

function AdminRoutes({
  data,
  updateData,
}) {
  return (
    <Routes>
      <Route
        index
        element={<Dashboard data={data} />}
      />

      <Route
        path="cabins"
        element={
          <Cabins
            data={data}
            updateData={updateData}
          />
        }
      />

      <Route
        path="bookings"
        element={
          <Bookings
            data={data}
            updateData={updateData}
          />
        }
      />

      <Route
        path="users"
        element={
          <Users
            data={data}
            updateData={updateData}
          />
        }
      />

      <Route
        path="reviews"
        element={
          <Reviews
            data={data}
            updateData={updateData}
          />
        }
      />

      <Route
        path="regions"
        element={
          <SimpleManager
            title="Регионы"
            dataKey="regions"
            data={data}
            updateData={updateData}
            fields={["name", "slug"]}
          />
        }
      />

      <Route
        path="amenities"
        element={
          <SimpleManager
            title="Удобства"
            dataKey="amenities"
            data={data}
            updateData={updateData}
            fields={["name", "icon"]}
          />
        }
      />

      <Route
        path="promotions"
        element={
          <Promotions
            data={data}
            updateData={updateData}
          />
        }
      />

      <Route
        path="settings"
        element={<Settings />}
      />

      <Route
        path="*"
        element={
          <Navigate to="/admin" replace />
        }
      />
    </Routes>
  );
}

/* =========================
        DASHBOARD
========================= */

function Dashboard({ data }) {
  const revenue = data.bookings
    .filter(
      (booking) =>
        booking.status !== "CANCELLED"
    )
    .reduce(
      (sum, booking) =>
        sum + Number(booking.total),
      0
    );

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Dashboard</h1>

          <p>
            Обзор платформы A-FRAME KG
          </p>
        </div>
      </div>

      <div className="stats">
        <Stat
          icon="🏠"
          title="Домиков"
          value={data.cabins.length}
          text="Всего объектов"
        />

        <Stat
          icon="📅"
          title="Бронирований"
          value={data.bookings.length}
          text="Всего бронирований"
        />

        <Stat
          icon="👥"
          title="Пользователей"
          value={data.users.length}
          text="Зарегистрировано"
        />

        <Stat
          icon="💰"
          title="Оборот"
          value={`${revenue.toLocaleString()} сом`}
          text="По текущим данным"
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>
                Последние бронирования
              </h3>

              <p>
                Последние операции клиентов
              </p>
            </div>

            <Link
              to="/admin/bookings"
              className="link"
            >
              Все →
            </Link>
          </div>

          <BookingTable
            data={data.bookings
              .slice(-5)
              .reverse()}
          />
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>
                Домики на проверке
              </h3>

              <p>
                Требуют решения
              </p>
            </div>

            <Link
              to="/admin/cabins"
              className="link"
            >
              Все →
            </Link>
          </div>

          {data.cabins
            .filter(
              (cabin) =>
                cabin.status ===
                "PENDING"
            )
            .map((cabin) => (
              <div
                className="mini-row"
                key={cabin.id}
              >
                <img
                  src={cabin.image}
                  alt=""
                />

                <div>
                  <strong>
                    {cabin.title}
                  </strong>

                  <span>
                    {cabin.owner}
                  </span>
                </div>

                <Status
                  value={cabin.status}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

function Stat({
  icon,
  title,
  value,
  text,
}) {
  return (
    <div className="stat">
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

/* =========================
        CABINS
========================= */

function Cabins({
  data,
  updateData,
}) {
  const [search, setSearch] =
    useState("");

  const [modal, setModal] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const cabins = data.cabins.filter(
    (cabin) =>
      `${cabin.title} ${cabin.owner} ${cabin.region} ${cabin.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  function remove(id) {
    if (!confirm("Удалить домик?")) {
      return;
    }

    updateData({
      ...data,
      cabins: data.cabins.filter(
        (cabin) => cabin.id !== id
      ),
    });
  }

  function changeStatus(id) {
    updateData({
      ...data,

      cabins: data.cabins.map(
        (cabin) =>
          cabin.id === id
            ? {
                ...cabin,
                status:
                  cabin.status ===
                  "PUBLISHED"
                    ? "BLOCKED"
                    : "PUBLISHED",
              }
            : cabin
      ),
    });
  }

  function saveCabin(cabin) {
    let cabins;

    if (editing) {
      cabins = data.cabins.map(
        (item) =>
          item.id === editing.id
            ? cabin
            : item
      );
    } else {
      cabins = [
        ...data.cabins,
        {
          ...cabin,
          id: Date.now(),
          rating: 0,
        },
      ];
    }

    updateData({
      ...data,
      cabins,
    });

    setModal(false);
    setEditing(null);
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>A-frame домики</h1>

          <p>
            Всего: {cabins.length}
          </p>
        </div>

        <button
          className="primary"
          onClick={() => {
            setEditing(null);
            setModal(true);
          }}
        >
          ＋ Добавить домик
        </button>
      </div>

      <div className="toolbar">
        <div className="search">
          🔎

          <input
            placeholder="Поиск домика..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      <div className="cabin-grid">
        {cabins.map((cabin) => (
          <div
            className="cabin-card"
            key={cabin.id}
          >
            <img
              src={
                cabin.image ||
                "https://via.placeholder.com/600x400"
              }
              alt={cabin.title}
            />

            <div className="cabin-body">
              <div className="between">
                <Status
                  value={cabin.status}
                />

                <span>
                  ⭐ {cabin.rating}
                </span>
              </div>

              <h3>{cabin.title}</h3>

              <p>
                📍 {cabin.region},{" "}
                {cabin.location}
              </p>

              <p>
                👥 До {cabin.guests} гостей
              </p>

              <p>
                💰{" "}
                {Number(
                  cabin.price
                ).toLocaleString()}{" "}
                сом / ночь
              </p>

              <div className="owner">
                👤 {cabin.owner}
              </div>

              <div className="actions">
                <button
                  onClick={() => {
                    setEditing(cabin);
                    setModal(true);
                  }}
                >
                  ✏️
                </button>

                <button
                  onClick={() =>
                    changeStatus(
                      cabin.id
                    )
                  }
                >
                  {cabin.status ===
                  "PUBLISHED"
                    ? "⛔"
                    : "✅"}
                </button>

                <button
                  className="danger"
                  onClick={() =>
                    remove(cabin.id)
                  }
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <CabinModal
          item={editing}
          onClose={() => {
            setModal(false);
            setEditing(null);
          }}
          onSave={saveCabin}
        />
      )}
    </>
  );
}

/* =========================
        CABIN MODAL
========================= */

function CabinModal({
  item,
  onClose,
  onSave,
}) {
  const [form, setForm] =
    useState(
      item || {
        title: "",
        owner: "",
        region: "Иссык-Куль",
        location: "",
        price: 5000,
        guests: 2,
        status: "PENDING",
        image: "",
      }
    );

  function change(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  }

  function submit() {
    onSave({
      ...form,
      price: Number(form.price),
      guests: Number(form.guests),
    });
  }

  return (
    <Modal
      title={
        item
          ? "Редактировать домик"
          : "Добавить домик"
      }
      onClose={onClose}
    >
      <div className="form-grid">
        <label>
          Название

          <input
            name="title"
            value={form.title}
            onChange={change}
          />
        </label>

        <label>
          Владелец

          <input
            name="owner"
            value={form.owner}
            onChange={change}
          />
        </label>

        <label>
          Регион

          <select
            name="region"
            value={form.region}
            onChange={change}
          >
            <option>
              Иссык-Куль
            </option>

            <option>Чуй</option>

            <option>Нарын</option>

            <option>Ош</option>
          </select>
        </label>

        <label>
          Локация

          <input
            name="location"
            value={form.location}
            onChange={change}
          />
        </label>

        <label>
          Цена за ночь

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={change}
          />
        </label>

        <label>
          Максимум гостей

          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={change}
          />
        </label>

        <label>
          Фото URL

          <input
            name="image"
            value={form.image}
            onChange={change}
          />
        </label>

        <label>
          Статус

          <select
            name="status"
            value={form.status}
            onChange={change}
          >
            <option>
              PENDING
            </option>

            <option>
              PUBLISHED
            </option>

            <option>
              BLOCKED
            </option>

            <option>DRAFT</option>
          </select>
        </label>
      </div>

      <div className="modal-actions">
        <button onClick={onClose}>
          Отмена
        </button>

        <button
          className="primary"
          onClick={submit}
        >
          Сохранить
        </button>
      </div>
    </Modal>
  );
}

/* =========================
        BOOKINGS
========================= */

function Bookings({
  data,
  updateData,
}) {
  const [search, setSearch] =
    useState("");

  const bookings =
    data.bookings.filter((booking) =>
      `${booking.id} ${booking.user} ${booking.cabin} ${booking.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  function changeStatus(
    id,
    status
  ) {
    updateData({
      ...data,

      bookings:
        data.bookings.map(
          (booking) =>
            booking.id === id
              ? {
                  ...booking,
                  status,
                }
              : booking
        ),
    });
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Бронирования</h1>

          <p>
            Всего: {bookings.length}
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          🔎

          <input
            placeholder="Поиск бронирования..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Клиент</th>
              <th>Домик</th>
              <th>Даты</th>
              <th>Гости</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Изменить</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map(
              (booking) => (
                <tr key={booking.id}>
                  <td>
                    <b>
                      #{booking.id}
                    </b>
                  </td>

                  <td>
                    {booking.user}
                  </td>

                  <td>
                    {booking.cabin}
                  </td>

                  <td>
                    {booking.checkIn}
                    <br />
                    →
                    <br />
                    {booking.checkOut}
                  </td>

                  <td>
                    {booking.guests}
                  </td>

                  <td>
                    <b>
                      {Number(
                        booking.total
                      ).toLocaleString()}{" "}
                      сом
                    </b>
                  </td>

                  <td>
                    <Status
                      value={
                        booking.status
                      }
                    />
                  </td>

                  <td>
                    <select
                      value={
                        booking.status
                      }
                      onChange={(e) =>
                        changeStatus(
                          booking.id,
                          e.target.value
                        )
                      }
                    >
                      <option>
                        PENDING
                      </option>

                      <option>
                        CONFIRMED
                      </option>

                      <option>
                        COMPLETED
                      </option>

                      <option>
                        CANCELLED
                      </option>

                      <option>
                        REJECTED
                      </option>
                    </select>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function BookingTable({ data }) {
  return (
    <table className="compact">
      <thead>
        <tr>
          <th>№</th>
          <th>Клиент</th>
          <th>Домик</th>
          <th>Сумма</th>
          <th>Статус</th>
        </tr>
      </thead>

      <tbody>
        {data.map((booking) => (
          <tr key={booking.id}>
            <td>
              #{booking.id}
            </td>

            <td>
              {booking.user}
            </td>

            <td>
              {booking.cabin}
            </td>

            <td>
              {Number(
                booking.total
              ).toLocaleString()}{" "}
              сом
            </td>

            <td>
              <Status
                value={
                  booking.status
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* =========================
        USERS
========================= */

function Users({
  data,
  updateData,
}) {
  const [search, setSearch] =
    useState("");

  const users =
    data.users.filter((user) =>
      `${user.name} ${user.email} ${user.phone} ${user.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  function toggleUser(id) {
    updateData({
      ...data,

      users: data.users.map(
        (user) =>
          user.id === id
            ? {
                ...user,
                status:
                  user.status ===
                  "BLOCKED"
                    ? "ACTIVE"
                    : "BLOCKED",
              }
            : user
      ),
    });
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Пользователи</h1>

          <p>
            Всего: {users.length}
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          🔎

          <input
            placeholder="Поиск пользователя..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Телефон</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Действие</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <b>{user.name}</b>
                  <br />

                  <small>
                    {user.email}
                  </small>
                </td>

                <td>
                  {user.phone}
                </td>

                <td>
                  <span className="role">
                    {labels[
                      user.role
                    ]}
                  </span>
                </td>

                <td>
                  <Status
                    value={
                      user.status
                    }
                  />
                </td>

                <td>
                  <button
                    onClick={() =>
                      toggleUser(
                        user.id
                      )
                    }
                  >
                    {user.status ===
                    "BLOCKED"
                      ? "🔓 Разблокировать"
                      : "🔒 Заблокировать"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* =========================
        REVIEWS
========================= */

function Reviews({
  data,
  updateData,
}) {
  function changeStatus(
    id,
    status
  ) {
    updateData({
      ...data,

      reviews: data.reviews.map(
        (review) =>
          review.id === id
            ? {
                ...review,
                status,
              }
            : review
      ),
    });
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Отзывы</h1>

          <p>
            Модерация отзывов
          </p>
        </div>
      </div>

      <div className="reviews">
        {data.reviews.map(
          (review) => (
            <div
              className="panel review"
              key={review.id}
            >
              <div className="between">
                <div>
                  <b>
                    {review.user}
                  </b>

                  <span>
                    {review.cabin}
                  </span>
                </div>

                <div className="stars">
                  {"★".repeat(
                    review.rating
                  )}

                  {"☆".repeat(
                    5 - review.rating
                  )}
                </div>
              </div>

              <p>
                {review.text}
              </p>

              <div className="review-bottom">
                <Status
                  value={
                    review.status
                  }
                />

                <div>
                  <button
                    onClick={() =>
                      changeStatus(
                        review.id,
                        "PUBLISHED"
                      )
                    }
                  >
                    ✅ Опубликовать
                  </button>

                  <button
                    onClick={() =>
                      changeStatus(
                        review.id,
                        "HIDDEN"
                      )
                    }
                  >
                    🙈 Скрыть
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}

/* =========================
        REGIONS / AMENITIES
========================= */

function SimpleManager({
  title,
  dataKey,
  data,
  updateData,
  fields,
}) {
  const [modal, setModal] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [form, setForm] =
    useState({});

  function open(item = null) {
    setEditing(item);

    setForm(
      item ||
        Object.fromEntries(
          fields.map((field) => [
            field,
            "",
          ])
        )
    );

    setModal(true);
  }

  function save() {
    const item = {
      ...form,
      id:
        editing?.id ||
        Date.now(),
      active: true,
    };

    const list = editing
      ? data[dataKey].map(
          (x) =>
            x.id === editing.id
              ? item
              : x
        )
      : [
          ...data[dataKey],
          item,
        ];

    updateData({
      ...data,
      [dataKey]: list,
    });

    setModal(false);
  }

  function remove(id) {
    if (!confirm("Удалить запись?")) {
      return;
    }

    updateData({
      ...data,

      [dataKey]:
        data[dataKey].filter(
          (item) =>
            item.id !== id
        ),
    });
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>{title}</h1>

          <p>
            Всего:{" "}
            {data[dataKey].length}
          </p>
        </div>

        <button
          className="primary"
          onClick={() => open()}
        >
          ＋ Добавить
        </button>
      </div>

      <div className="simple-grid">
        {data[dataKey].map(
          (item) => (
            <div
              className="simple-card"
              key={item.id}
            >
              <div className="simple-icon">
                {item.icon || "📍"}
              </div>

              <div>
                <h3>
                  {item.name}
                </h3>

                <small>
                  {item.slug ||
                    "A-FRAME KG"}
                </small>
              </div>

              <div className="actions">
                <button
                  onClick={() =>
                    open(item)
                  }
                >
                  ✏️
                </button>

                <button
                  className="danger"
                  onClick={() =>
                    remove(item.id)
                  }
                >
                  🗑️
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {modal && (
        <Modal
          title={
            editing
              ? "Редактировать"
              : "Добавить"
          }
          onClose={() =>
            setModal(false)
          }
        >
          <div className="form-grid">
            {fields.map(
              (field) => (
                <label key={field}>
                  {field ===
                  "name"
                    ? "Название"
                    : field ===
                      "slug"
                    ? "Slug"
                    : "Иконка"}

                  <input
                    value={
                      form[field] ||
                      ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [field]:
                          e.target
                            .value,
                      })
                    }
                  />
                </label>
              )
            )}
          </div>

          <div className="modal-actions">
            <button
              onClick={() =>
                setModal(false)
              }
            >
              Отмена
            </button>

            <button
              className="primary"
              onClick={save}
            >
              Сохранить
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

/* =========================
        PROMOTIONS
========================= */

function Promotions({
  data,
  updateData,
}) {
  const [modal, setModal] =
    useState(false);

  const [form, setForm] =
    useState({
      title: "",
      cabin: "",
      discount: 10,
    });

  function addPromotion() {
    updateData({
      ...data,

      promotions: [
        ...data.promotions,
        {
          ...form,
          id: Date.now(),
          discount: Number(
            form.discount
          ),
          active: true,
        },
      ],
    });

    setModal(false);

    setForm({
      title: "",
      cabin: "",
      discount: 10,
    });
  }

  function remove(id) {
    updateData({
      ...data,

      promotions:
        data.promotions.filter(
          (item) =>
            item.id !== id
        ),
    });
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Акции</h1>

          <p>
            Специальные предложения
          </p>
        </div>

        <button
          className="primary"
          onClick={() =>
            setModal(true)
          }
        >
          ＋ Добавить акцию
        </button>
      </div>

      <div className="promo-grid">
        {data.promotions.map(
          (promotion) => (
            <div
              className="promo-card"
              key={promotion.id}
            >
              <div className="discount">
                -{promotion.discount}%
              </div>

              <h3>
                {promotion.title}
              </h3>

              <p>
                {promotion.cabin}
              </p>

              <button
                className="danger"
                onClick={() =>
                  remove(
                    promotion.id
                  )
                }
              >
                🗑️ Удалить
              </button>
            </div>
          )
        )}
      </div>

      {modal && (
        <Modal
          title="Новая акция"
          onClose={() =>
            setModal(false)
          }
        >
          <div className="form-grid">
            <label>
              Название

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Домик

              <input
                value={form.cabin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cabin:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Скидка %

              <input
                type="number"
                value={
                  form.discount
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    discount:
                      e.target.value,
                  })
                }
              />
            </label>
          </div>

          <div className="modal-actions">
            <button
              onClick={() =>
                setModal(false)
              }
            >
              Отмена
            </button>

            <button
              className="primary"
              onClick={
                addPromotion
              }
            >
              Создать
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

/* =========================
        SETTINGS
========================= */

function Settings() {
  const [saved, setSaved] =
    useState(false);

  return (
    <div className="panel settings">
      <h1>Настройки</h1>

      <p>
        Основные настройки
        администратора.
      </p>

      <label>
        Название проекта

        <input defaultValue="A-FRAME KG" />
      </label>

      <label>
        Email администратора

        <input defaultValue="admin@aframe.kg" />
      </label>

      <label>
        Валюта

        <select defaultValue="KGS">
          <option value="KGS">
            Кыргызский сом
          </option>
        </select>
      </label>

      <button
        className="primary"
        onClick={() => {
          setSaved(true);

          setTimeout(
            () => setSaved(false),
            1500
          );
        }}
      >
        Сохранить
      </button>

      {saved && (
        <div className="success">
          Настройки сохранены
        </div>
      )}
    </div>
  );
}

/* =========================
        COMPONENTS
========================= */

function Status({ value }) {
  return (
    <span
      className={`status status-${String(
        value
      ).toLowerCase()}`}
    >
      {labels[value] || value}
    </span>
  );
}

function Modal({
  title,
  onClose,
  children,
}) {
  return (
    <div
      className="modal-background"
      onMouseDown={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default App;