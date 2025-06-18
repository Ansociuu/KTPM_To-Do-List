function submitEmail() {
  const email = document.getElementById("email").value;
  if (!email.trim()) {
    alert("Vui lòng nhập email.");
    return;
  }

  fetch('https://glorious-space-system-jj56vp4qpjj6fpw5x-3000.app.github.dev/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })
  .then(res => res.ok ? alert("Đăng ký thành công!") : alert("Có lỗi xảy ra."))
  .catch(() => alert("Lỗi kết nối đến máy chủ."));
}

// Hiệu ứng chữ gõ (typewriter)
const textElement = document.getElementById("typing-text");
const typingText = "Quản lý công việc hiệu quả cùng Task Force";
let index = 0;

function typeWriter() {
  if (index < typingText.length) {
    textElement.innerHTML += typingText.charAt(index);
    index++;
    setTimeout(typeWriter, 60);
  }
}

typeWriter();

// Dark mode toggle
function toggleMode() {
  document.documentElement.classList.toggle("dark");
}
