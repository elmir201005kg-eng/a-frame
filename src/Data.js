export const initialData = {
  users: [
    {
      id: 1,
      name: "Азамат Токтосунов",
      email: "azamat@mail.com",
      phone: "+996 700 111 222",
      role: "USER",
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Нурбек Садыков",
      email: "nurbek@mail.com",
      phone: "+996 555 333 444",
      role: "OWNER",
      status: "ACTIVE",
    },
    {
      id: 3,
      name: "Айжан Бекова",
      email: "aizhan@mail.com",
      phone: "+996 770 555 666",
      role: "USER",
      status: "BLOCKED",
    },
  ],

  cabins: [
    {
      id: 1,
      title: "Mountain View A-Frame",
      owner: "Нурбек Садыков",
      region: "Иссык-Куль",
      location: "Чолпон-Ата",
      price: 8500,
      guests: 4,
      rating: 4.9,
      status: "PUBLISHED",
      image:
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      title: "Forest House",
      owner: "Нурбек Садыков",
      region: "Чуй",
      location: "Чон-Кемин",
      price: 6500,
      guests: 3,
      rating: 4.7,
      status: "PENDING",
      image:
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      title: "Ala-Archa Peak",
      owner: "Айбек Осмонов",
      region: "Чуй",
      location: "Ала-Арча",
      price: 10000,
      guests: 6,
      rating: 4.8,
      status: "PUBLISHED",
      image:
        "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=900&q=80",
    },
  ],

  bookings: [
    {
      id: 1001,
      user: "Азамат Токтосунов",
      cabin: "Mountain View A-Frame",
      checkIn: "2026-09-14",
      checkOut: "2026-09-17",
      guests: 2,
      total: 25500,
      status: "CONFIRMED",
    },
    {
      id: 1002,
      user: "Айжан Бекова",
      cabin: "Forest House",
      checkIn: "2026-09-20",
      checkOut: "2026-09-22",
      guests: 3,
      total: 13000,
      status: "PENDING",
    },
    {
      id: 1003,
      user: "Марат Алиев",
      cabin: "Ala-Archa Peak",
      checkIn: "2026-08-10",
      checkOut: "2026-08-12",
      guests: 4,
      total: 20000,
      status: "COMPLETED",
    },
  ],

  reviews: [
    {
      id: 1,
      user: "Азамат Токтосунов",
      cabin: "Mountain View A-Frame",
      rating: 5,
      text: "Отличный домик и красивый вид.",
      status: "PUBLISHED",
    },
    {
      id: 2,
      user: "Айжан Бекова",
      cabin: "Forest House",
      rating: 4,
      text: "Очень уютное место.",
      status: "PENDING",
    },
  ],

  regions: [
    {
      id: 1,
      name: "Иссык-Куль",
      slug: "issyk-kul",
      active: true,
    },
    {
      id: 2,
      name: "Чуй",
      slug: "chuy",
      active: true,
    },
    {
      id: 3,
      name: "Нарын",
      slug: "naryn",
      active: true,
    },
    {
      id: 4,
      name: "Ош",
      slug: "osh",
      active: true,
    },
  ],

  amenities: [
    {
      id: 1,
      name: "Wi-Fi",
      icon: "📶",
      active: true,
    },
    {
      id: 2,
      name: "Парковка",
      icon: "🚗",
      active: true,
    },
    {
      id: 3,
      name: "Кухня",
      icon: "🍳",
      active: true,
    },
    {
      id: 4,
      name: "Отопление",
      icon: "🔥",
      active: true,
    },
  ],

  promotions: [
    {
      id: 1,
      title: "Осенняя скидка",
      cabin: "Mountain View A-Frame",
      discount: 15,
      active: true,
    },
    {
      id: 2,
      title: "Выходные",
      cabin: "Forest House",
      discount: 10,
      active: true,
    },
  ],
};

export function loadData() {
  const saved = localStorage.getItem("aframe_admin_data");

  if (!saved) {
    localStorage.setItem(
      "aframe_admin_data",
      JSON.stringify(initialData)
    );

    return initialData;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return initialData;
  }
}

export function saveData(data) {
  localStorage.setItem(
    "aframe_admin_data",
    JSON.stringify(data)
  );
}