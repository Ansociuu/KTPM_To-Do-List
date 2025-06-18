import { loginUser, logoutUser, registerUser } from './api/auth.js';
import { getUser, updateUser } from './api/user.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Demo: đăng ký
  // const result = await registerUser({
  //   email: 'test@example.com',
  //   password: '123456'
  // });

  // Demo: đăng nhập
  const loginResult = await loginUser({
    email: 'test@example.com',
    password: '123456'
  });
  console.log('Login result:', loginResult);

  // Demo: lấy thông tin user
  if (loginResult.user && loginResult.user.id) {
    const userInfo = await getUser(loginResult.user.id);
    console.log('User info:', userInfo);
  }

  // Demo: cập nhật thông tin user
  // await updateUser(loginResult.user.id, { name: 'Tên mới' });

  // Đăng xuất
  // logoutUser();
});
