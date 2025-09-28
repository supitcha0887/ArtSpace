export const mockActivities = [
  {
    id: 1,
    title: "เวิร์กช็อปเขียนเรื่องสั้น",
    host: "Writer Hub",
    orgAvatar: "/img/img1.png",
    rating: 4.7,
    description: "กิจกรรมการเรียนรู้การเขียนเรื่องสั้นสำหรับผู้เริ่มต้น พร้อมกับการแสดงผลงานในงานศิลปะ",
    category: "Writing",
    img: "/img/img1.png",
    startDate: "2025-09-23",
    startTime: "18:00",
    endDate: "2025-09-30",
    endTime: "17:00",
    location: "ห้องคอนเสิร์ต ชั้น 3 อาคารศิลปกรรม",
    capacity: 25,
    joined: 19,
    deadline: "2025-09-29",
    deadlineTime: "18:00"
  },
  {
    id: 2,
    title: "ถ่ายภาพกลางคืนยามเก้า",
    host: "Photo Club",
    orgAvatar: "/img/img1.png",
    rating: 4.7,
    description: "เรียนรู้เทคนิคการถ่ายภาพในช่วงแสงทอง และการจัดองค์ประกอบที่สวยงาม",
    category: "Photography",
    img: "/img/img1.png",
    startDate: "2025-09-23",
    startTime: "18:00",
    endDate: "2025-09-23",
    endTime: "22:00",
    location: "ลานหน้าอาคารหลัก",
    capacity: 10,
    joined: 7,
    deadline: "2025-09-22",
    deadlineTime: "12:00"
  },
  {
    id: 3,
    title: "วาดภาพสีน้ำ",
    host: "Art Studio",
    orgAvatar: "/img/img1.png",
    rating: 4.5,
    description: "เรียนรู้เทคนิคการวาดภาพสีน้ำแบบเบื้องต้น เหมาะสำหรับผู้ที่สนใจศิลปะ",
    category: "Visual Arts",
    img: "/img/img1.png",
    startDate: "2025-10-01",
    startTime: "09:00",
    endDate: "2025-10-01",
    endTime: "16:00",
    location: "ห้องศิลปะ อาคาร A",
    capacity: 15,
    joined: 8,
    deadline: "2025-09-30",
    deadlineTime: "23:59"
  },
  {
    id: 4,
    title: "กิตาร์โปร่ง สำหรับมือใหม่",
    host: "Music Corner",
    orgAvatar: "/img/img1.png",
    rating: 4.8,
    description: "เรียนรู้พื้นฐานการเล่นกิตาร์โปร่ง ตั้งแต่การถือกีตาร์ การเล่นคอร์ดพื้นฐาน",
    category: "Music",
    img: "/img/img1.png",
    startDate: "2025-10-05",
    startTime: "14:00",
    endDate: "2025-10-05",
    endTime: "17:00",
    location: "ห้องดนตรี ชั้น 2",
    capacity: 12,
    joined: 5,
    deadline: "2025-10-04",
    deadlineTime: "18:00"
  }
];

// Helper functions สำหรับดึงข้อมูล
export const getActivityById = (id) => {
  return mockActivities.find(activity => activity.id === parseInt(id));
};

export const getActivitiesByCategory = (category) => {
  if (!category) return mockActivities;
  return mockActivities.filter(activity => activity.category === category);
};

export const searchActivities = (query) => {
  if (!query) return mockActivities;
  const searchTerm = query.toLowerCase();
  return mockActivities.filter(activity => 
    activity.title.toLowerCase().includes(searchTerm) ||
    activity.host.toLowerCase().includes(searchTerm) ||
    activity.description.toLowerCase().includes(searchTerm)
  );
};