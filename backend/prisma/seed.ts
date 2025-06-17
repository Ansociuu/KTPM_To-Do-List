import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Tạo admin user 
  const adminUser = await prisma.user.upsert({
    where: { email: 'nk.anbmtabc@gmail.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'nk.anbmtabc@gmail.com',
      password: 'password',
      language: 'vi',
    },
  });
  const adminId = adminUser.id;

  // Seed template phổ biến
  await prisma.template.create({
    data: {
      name: 'Một ngày của tôi',
      content: 'Dùng để bắt đầu ngày mới hiệu quả',
      isPublic: true,
      userId: adminId,
      tasks: {
        create: [
          {
            title: 'Học bài',
            description: 'Tập trung học môn chính',
            subTasks: {
              create: [
                { title: 'Toán', description: 'Ôn chương 2', userId: adminId },
                { title: 'Lý', description: 'Làm bài tập trang 30', userId: adminId },
              ],
            },
            userId: adminId,
          },
          {
            title: 'Làm việc nhà',
            subTasks: {
              create: [
                { title: 'Rửa bát', userId: adminId },
                { title: 'Quét nhà', userId: adminId },
              ],
            },
            userId: adminId,
          },
          {
            title: 'Trông em',
            description: 'Chơi với em bé 1 giờ',
            userId: adminId,
          },
        ],
      },
    },
  });

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());