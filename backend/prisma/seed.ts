import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.template.createMany({
    data: [
      {
        name: 'Học bài 25 phút',
        content: 'Bắt đầu Pomodoro và học 25 phút không gián đoạn.',
        userId: 1,      //userId của admin (admin ban đầu tạo trước 1 acc để tạo template)
        isPublic: true,         //public cho mọi người dùng (đối với user khác có thể tạo template mà không public)
      },
      {
        name: 'Tập thể dục',
        content: 'Khởi động 5 phút + chạy bộ 15 phút + giãn cơ',
        userId: 1,
        isPublic: true,
      },
      {
        name: 'Lên kế hoạch ngày mới',
        content: 'Ghi lại 3 việc quan trọng hôm nay.',
        userId: 1,
        isPublic: true,
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
