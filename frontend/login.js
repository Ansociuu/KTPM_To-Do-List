// Xử lý đăng nhập
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
        localStorage.setItem("userEmail", email);
        window.location.href = "todolist.html";
    } else {
        alert("Please enter email and password.");
    }
}

// Gỡ hiệu ứng gõ "Great experience"
window.addEventListener("load", () => {
    const title = document.querySelector(".experience-text");
    if (title) {
        setTimeout(() => {
            title.style.borderRight = "none";
            title.style.animation = "typing 2.5s steps(20, end) 1s 1 normal both";
        }, 3500);
    }

});

// Thêm vào file login.js
function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const agreeTerms = document.querySelector("input[type='checkbox']").checked;

    // Kiểm tra điều kiện đăng ký
    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (!agreeTerms) {
        alert("You must agree to the terms & conditions.");
        return;
    }

    // Lưu thông tin người dùng và chuyển hướng
    localStorage.setItem("userEmail", email);
    window.location.href = "todolist.html";
}