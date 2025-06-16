
function getCurrentTasks() {
    const email = localStorage.getItem("userEmail");
    return JSON.parse(localStorage.getItem("kanbanTasks_" + email)) || [];
}

function showForm(button) {
    const columnContent = button.parentElement;
    if (columnContent.querySelector('.task-form')) return;

    const form = document.createElement("div");
    form.className = "task-form";

    form.innerHTML = `
    <div class="form-row">
        <input type="text" placeholder="Task name..." class="task-input" />
        <button class="edit-icon" title="Add time & date">🖊</button>
    </div>
    <div class="datetime-fields hidden">
        <input type="date" class="task-date-input" />
        <input type="time" class="task-time-input" />
    </div>
    <textarea class="task-note-input" placeholder="Ghi chú ..."></textarea>
    <input type="text" class="assign-to-input" placeholder="Assign to (email or username)" />
    <button class="add-btn">Add</button>
    <button class="cancel-btn">Cancel</button>
`;


    form.querySelector('.edit-icon').onclick = (e) => {
        e.preventDefault();
        const fields = form.querySelector('.datetime-fields');
        fields.classList.toggle('hidden');
    };

    form.querySelector('.add-btn').onclick = () => {
        const text = form.querySelector('.task-input').value.trim();
        const date = form.querySelector('.task-date-input').value;
        const time = form.querySelector('.task-time-input').value;
        const note = form.querySelector('.task-note-input').value.trim();
        const assignedTo = form.querySelector(".assign-to-input").value.trim();


        if (text) {
            const task = createTaskElement({ text, date, time, note, assignedTo });
            columnContent.insertBefore(task, button);
            sortTasksInColumn(columnContent);
            saveTasksToLocalStorage();

            // Ghi log history
            const columnTitle = columnContent.closest(".column").querySelector(".column-title").innerText;
            logHistory("Task created", text, null, columnTitle);
        }

        console.log({ text, date, time, note, assignedTo });


        form.remove();
    };

    form.querySelector('.cancel-btn').onclick = () => form.remove();
    columnContent.insertBefore(form, button);
}

function editTask(task) {
    const titleEl = task.querySelector(".task-title");
    const dateEl = task.querySelector(".task-date");
    const noteEl = task.querySelector(".task-note");

    const currentTitle = titleEl.innerText;
    let currentDate = "", currentTime = "", currentNote = noteEl ? noteEl.innerText : "";
    let currentAssignedTo = task.querySelector(".task-assignee")?.innerText.replace("👤 ", "") || "";


    if (dateEl) {
        const text = dateEl.innerText;
        const dateMatch = text.match(/📅 (\d{4}-\d{2}-\d{2})/);
        const timeMatch = text.match(/🕒 (\d{2}:\d{2})/);
        if (dateMatch) currentDate = dateMatch[1];
        if (timeMatch) currentTime = timeMatch[1];
    }

    task.innerHTML = `
        <div class="form-row">
            <input type="text" value="${currentTitle}" class="edit-title-input" />
            <button class="edit-icon" title="Edit time & date">🖊</button>
        </div>
        <div class="datetime-fields hidden">
            <input type="date" class="edit-date-input" value="${currentDate}" />
            <input type="time" class="edit-time-input" value="${currentTime}" />
        </div>
        <textarea class="edit-note-input" placeholder="Ghi chú ...">${currentNote}</textarea>
        <input type="text" class="edit-assign-input" placeholder="Assign to..." value="${currentAssignedTo}" />
        <button class="save-btn">Save</button>
        <button class="cancel-edit-btn">Cancel</button>

    `;

    task.querySelector(".edit-icon").onclick = (e) => {
        e.preventDefault();
        const fields = task.querySelector(".datetime-fields");
        fields.classList.toggle("hidden");
    };

    task.querySelector(".save-btn").onclick = () => {
        const newText = task.querySelector(".edit-title-input").value.trim();
        const newDate = task.querySelector(".edit-date-input").value;
        const newTime = task.querySelector(".edit-time-input").value;
        const newNote = task.querySelector(".edit-note-input").value.trim();

        if (newText) {
            const newAssignedTo = task.querySelector(".edit-assign-input")?.value.trim();
            const updatedTask = createTaskElement({ text: newText, date: newDate, time: newTime, note: newNote, assignedTo: newAssignedTo });
            task.replaceWith(updatedTask);
            const columnContent = updatedTask.closest(".column-content");
            sortTasksInColumn(columnContent);
            saveTasksToLocalStorage();
        }
    };

    task.querySelector(".cancel-edit-btn").onclick = () => {
        const restored = createTaskElement({ text: currentTitle, date: currentDate, time: currentTime, note: currentNote, assignedTo: currentAssignedTo });
        task.replaceWith(restored);
    };
}

function createTaskElement({ text, date, time, note, assignedTo }) {
    const task = document.createElement("div");
    task.className = "task";

    let datetimeDisplay = "";
    if (date) {
        datetimeDisplay += `📅 ${date}`;
        if (time) {
            datetimeDisplay += ` 🕒 ${time}`;
        }
    }

    task.innerHTML = `
    <div class="task-title">${text}</div>
    ${assignedTo ? `<div class="task-assignee">👤 ${assignedTo}</div>` : ""}
    ${datetimeDisplay ? `<div class="task-date">${datetimeDisplay}</div>` : ""}
    ${note ? `<div class="task-note">${note}</div>` : ""}
    <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
        <button class="move-btn">Move</button>
    </div>
`;


    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", handleDragStart);
    task.addEventListener("dragend", handleDragEnd);

    task.querySelector(".edit-btn").onclick = () => editTask(task);
    task.querySelector(".delete-btn").onclick = () => {
        showDeleteConfirm(task);
    };

    task.querySelector(".move-btn").onclick = () => moveTask(task);

    const column = task.closest(".column") || findColumnOfTask(task);
    if (column) {
        const colTitle = column.querySelector(".column-title")?.innerText.trim();
        if (colTitle === "Done") {
            task.querySelector(".task-title").style.textDecoration = "line-through";
        }
    }

    if (date && time) {
        const countdownEl = document.createElement("div");
        countdownEl.className = "task-countdown";
        task.insertBefore(countdownEl, task.querySelector(".task-actions"));

        const targetTime = new Date(`${date}T${time}`);

        const interval = setInterval(() => {
            const now = new Date();
            const diff = targetTime - now;

            if (diff <= 0) {
                countdownEl.textContent = "⏰ Hết hạn!";
                countdownEl.classList.remove("warning");
                countdownEl.style.color = "#c0392b";
                clearInterval(interval);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownEl.textContent = `⏳ ${hours}h ${minutes}m ${seconds}s left`;

            if (diff <= 10 * 60 * 1000) {
                countdownEl.classList.add("warning");
            } else {
                countdownEl.classList.remove("warning");
            }
        }, 1000);
    }


    return task;
}

function showDeleteConfirm(task) {
    const overlay = document.getElementById("delete-confirm-overlay");
    overlay.classList.remove("hidden");

    const confirmBtn = document.getElementById("confirm-delete-btn");
    const cancelBtn = document.getElementById("cancel-delete-btn");

    const handleConfirm = () => {
        const taskName = task.querySelector(".task-title").innerText;
        const columnTitle = task.closest(".column").querySelector(".column-title").innerText;

        task.remove();
        saveTasksToLocalStorage();

        // Ghi log history
        logHistory("Task deleted", taskName, columnTitle, null);
        cleanup();
    };

    const cleanup = () => {
        overlay.classList.add("hidden");
        confirmBtn.removeEventListener("click", handleConfirm);
        cancelBtn.removeEventListener("click", cleanup);
    };

    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", cleanup);
}

function findColumnOfTask(task) {
    const allColumns = document.querySelectorAll(".column");
    for (const column of allColumns) {
        if (column.querySelector(".column-content")?.contains(task)) {
            return column;
        }
    }
    return null;
}

function moveTask(task) {
    const currentColumn = task.closest(".column");
    const currentColumnTitle = currentColumn.querySelector(".column-title").innerText;
    const allColumns = Array.from(document.querySelectorAll(".column"));
    const currentIndex = allColumns.indexOf(currentColumn);
    const nextIndex = (currentIndex + 1) % allColumns.length;
    const nextColumn = allColumns[nextIndex].querySelector(".column-content");
    const nextColumnTitle = allColumns[nextIndex].querySelector(".column-title").innerText;

    nextColumn.insertBefore(task, nextColumn.querySelector(".create-task"));

    // Cập nhật gạch chữ
    const titleEl = task.querySelector(".task-title");
    titleEl.style.textDecoration = (nextColumnTitle === "Done") ? "line-through" : "none";

    sortTasksInColumn(nextColumn);
    saveTasksToLocalStorage();

    // Ghi log history
    const taskName = task.querySelector(".task-title").innerText;
    logHistory("Task moved", taskName, currentColumnTitle, nextColumnTitle);
}

function sortTasksInColumn(columnContent) {
    const tasks = Array.from(columnContent.querySelectorAll(".task"));

    tasks.sort((a, b) => {
        const getDateTime = (el) => {
            const dateText = el.querySelector(".task-date")?.innerText || "";
            const dateMatch = dateText.match(/📅 (\d{4}-\d{2}-\d{2})/);
            const timeMatch = dateText.match(/🕒 (\d{2}:\d{2})/);
            const date = dateMatch ? dateMatch[1] : "";
            const time = timeMatch ? timeMatch[1] : "00:00";
            return date ? new Date(`${date}T${time}`) : null;
        };

        const aTime = getDateTime(a);
        const bTime = getDateTime(b);

        if (!aTime && !bTime) return 0;
        if (!aTime) return 1;
        if (!bTime) return -1;

        return aTime - bTime;
    });

    tasks.forEach(task => {
        columnContent.insertBefore(task, columnContent.querySelector(".create-task"));
    });
}

let draggedTask = null;
function handleDragStart(e) {
    draggedTask = e.target;
    setTimeout(() => e.target.style.display = "none", 0);
}
function handleDragEnd(e) {
    setTimeout(() => {
        draggedTask.style.display = "block";
        draggedTask = null;
    }, 0);
}
function handleDragOver(e) {
    e.preventDefault();
}
function handleDrop(e) {
    e.preventDefault();
    const columnContent = e.target.closest(".column-content");
    if (draggedTask && columnContent) {
        columnContent.insertBefore(draggedTask, columnContent.querySelector(".create-task"));

        const titleEl = draggedTask.querySelector(".task-title");
        const colTitle = columnContent.closest(".column").querySelector(".column-title").innerText.trim();
        titleEl.style.textDecoration = (colTitle === "Done") ? "line-through" : "none";

        sortTasksInColumn(columnContent);
        saveTasksToLocalStorage();
    }
}

function saveTasksToLocalStorage() {
    const boardData = [];
    document.querySelectorAll('.column').forEach(column => {
        const title = column.querySelector('.column-title').innerText;
        const tasks = [];
        column.querySelectorAll('.task').forEach(task => {
            const text = task.querySelector('.task-title').innerText;
            const dateEl = task.querySelector('.task-date');
            const noteEl = task.querySelector('.task-note');
            let date = "", time = "", note = noteEl ? noteEl.innerText : "";
            if (dateEl) {
                const matchDate = dateEl.innerText.match(/📅 (\d{4}-\d{2}-\d{2})/);
                const matchTime = dateEl.innerText.match(/🕒 (\d{2}:\d{2})/);
                if (matchDate) date = matchDate[1];
                if (matchTime) time = matchTime[1];
            }
            const assigneeEl = task.querySelector(".task-assignee");
            const assignedTo = assigneeEl ? assigneeEl.innerText.replace("👤 ", "") : "";
            tasks.push({ text, date, time, note, assignedTo });

        });
        boardData.push({ title, tasks });
    });
    const email = localStorage.getItem("userEmail");
    localStorage.setItem("kanbanTasks_" + email, JSON.stringify(boardData));

}

function loadTasksFromLocalStorage() {
    const email = localStorage.getItem("userEmail");
    const data = JSON.parse(localStorage.getItem("kanbanTasks_" + email));
    if (!data) return;

    data.forEach((colData, i) => {
        const column = document.querySelectorAll('.column')[i];
        const container = column.querySelector('.column-content');

        colData.tasks.forEach(taskData => {
            const task = createTaskElement(taskData);
            container.insertBefore(task, container.querySelector(".create-task"));

            const colTitle = column.querySelector(".column-title").innerText.trim();
            if (colTitle === "Done") {
                task.querySelector(".task-title").style.textDecoration = "line-through";
            }
        });

        sortTasksInColumn(container);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // === Giao diện (theme)
    const themeData = JSON.parse(localStorage.getItem("userTheme"));
    if (themeData?.bg) {
        document.body.style.backgroundImage = themeData.bg.startsWith("linear") ? themeData.bg : "none";
        document.body.style.backgroundColor = !themeData.bg.startsWith("linear") ? themeData.bg : "";
    }

    if (localStorage.getItem("darkMode") === "on") {
        document.getElementById("dark-mode-toggle").checked = true;
        document.body.classList.add("dark-mode");
    }

    document.getElementById("dark-mode-toggle").addEventListener("change", function () {
        document.body.classList.toggle("dark-mode", this.checked);
        localStorage.setItem("darkMode", this.checked ? "on" : "off");
    });

    document.getElementById("btn-history").addEventListener("click", () => {
        showHistory();
        setActiveSidebar("btn-history");

    });


    // Sự kiện khi click Calendar
    document.getElementById("btn-calendar").addEventListener("click", () => {
        document.querySelector(".board").style.display = "none";
        document.getElementById("statistics-section").classList.add("hidden");
        document.getElementById("history-section").classList.add("hidden");
        document.getElementById("calendar-section").classList.remove("hidden");
        renderCalendar(currentMonth, currentYear);
        setActiveSidebar("btn-calendar");
    });

    // === Sidebar toggle
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    const sidebar = document.querySelector(".sidebar");
    const wrapper = document.querySelector(".wrapper");
    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        wrapper.style.marginLeft = sidebar.classList.contains("collapsed") ? "80px" : "200px";
    });

    // === Nút Settings
    const settingsPanel = document.getElementById('settings-panel');
    const btnSettings = document.getElementById('btn-settings');

    // Mở panel
    btnSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsPanel.classList.add('active');
    });

    // Đóng panel
    settingsPanel.addEventListener('click', (e) => {
        if (e.target === settingsPanel || e.target.classList.contains('close-btn')) {
            settingsPanel.classList.remove('active');
        }
    });

    // Ngăn click trong panel đóng panel
    document.querySelector('.panel-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Đóng panel khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && e.target !== btnSettings) {
            settingsPanel.classList.remove('active');
        }
    });

    // === Hiển thị thống kê
    document.getElementById("btn-board").addEventListener("click", () => {
        document.querySelector(".board").style.display = "flex";
        document.getElementById("statistics-section").classList.add("hidden");
        document.getElementById("history-section").classList.add("hidden");
        document.getElementById("calendar-section").classList.add("hidden");
        setActiveSidebar("btn-board");
    });


    document.getElementById("btn-statistics").addEventListener("click", () => {
        document.querySelector(".board").style.display = "none";
        document.getElementById("statistics-section").classList.remove("hidden");
        document.getElementById("history-section").classList.add("hidden");
        document.getElementById("calendar-section").classList.add("hidden");
        showStatisticsChart();
        setActiveSidebar("btn-statistics");
    });


    // === Drag & Drop
    document.querySelectorAll(".column-content").forEach(col => {
        col.addEventListener("dragover", handleDragOver);
        col.addEventListener("drop", handleDrop);
    });

    document.getElementById("search-input").addEventListener("input", function () {
        const keyword = this.value.toLowerCase();

        // Lọc task trong bảng
        document.querySelectorAll(".task").forEach(task => {
            const title = task.querySelector(".task-title")?.innerText.toLowerCase() || "";
            const date = task.querySelector(".task-date")?.innerText.toLowerCase() || "";
            const note = task.querySelector(".task-note")?.innerText.toLowerCase() || "";
            const match = title.includes(keyword) || date.includes(keyword) || note.includes(keyword);
            task.style.display = match ? "" : "none";
        });

        // Lọc lịch sử nếu phần history đang hiển thị
        const historySection = document.getElementById("history-section");
        if (!historySection.classList.contains("hidden")) {
            document.querySelectorAll(".history-item").forEach(item => {
                const text = item.innerText.toLowerCase();
                const match = text.includes(keyword);
                item.style.display = match ? "" : "none";
            });
        }
    });


    // === Avatar
    const email = localStorage.getItem("userEmail");
    const savedAvatar = email ? localStorage.getItem("avatar_" + email) : null;
    if (savedAvatar) {
        const avatarEl = document.querySelector(".user-avatar img");
        if (avatarEl) avatarEl.src = savedAvatar;
    }

    const uploadInput = document.getElementById("avatar-upload");
    if (uploadInput) {
        uploadInput.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const dataUrl = event.target.result;
                    document.querySelector(".user-avatar img").src = dataUrl;
                    if (email) {
                        localStorage.setItem("avatar_" + email, dataUrl);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // === Tải task từ local
    loadTasksFromLocalStorage();
    document.getElementById("btn-board").click();

    
});

function showStatisticsChart() {
    const data = getCurrentTasks();
    if (!data) return;

    let todo = 0, inprogress = 0, done = 0;

    data.forEach(col => {
        const count = col.tasks.length;
        if (col.title === "To Do") todo = count;
        else if (col.title === "In Progress") inprogress = count;
        else if (col.title === "Done") done = count;
    });

    const canvas = document.getElementById("pieChart");
    const ctx = canvas.getContext("2d");

    // ❌ Xoá biểu đồ cũ nếu có
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
    }

    // ✅ Tạo mới
    window.pieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['To Do', 'In Progress', 'Done'],
            datasets: [{
                data: [todo, inprogress, done],
                backgroundColor: ['#f39c12', '#3498db', '#2ecc71']
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    renderTaskTable(data); // Cập nhật bảng task
}


function renderTaskTable(data) {
    const tbody = document.querySelector("#task-table tbody");
    tbody.innerHTML = ""; // Clear bảng cũ

    data.forEach(col => {
        col.tasks.forEach(task => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td style="padding: 10px; border: 1px solid #ccc;">${task.text}</td>
                <td style="padding: 10px; border: 1px solid #ccc;">${task.date || "-"}</td>
                <td style="padding: 10px; border: 1px solid #ccc;">${task.time || "-"}</td>
                <td style="padding: 10px; border: 1px solid #ccc;">${task.note || "-"}</td>
                <td style="padding: 10px; border: 1px solid #ccc;">${col.title}</td>
            `;
            tbody.appendChild(row);
        });
    });
}


function toggleUserMenu() {
    document.getElementById("user-menu").classList.toggle("hidden");
}

function changeAvatar() {
    document.getElementById("avatar-upload").click();
}

function logout() {
    const overlay = document.getElementById("logout-modal");
    overlay.classList.remove("hidden");

    const confirmBtn = document.getElementById("confirm-logout-btn");
    const cancelBtn = document.getElementById("cancel-logout-btn");

    const handleConfirm = () => {
        localStorage.removeItem("userEmail");
        window.location.href = "login.html";
    };

    const cleanup = () => {
        overlay.classList.add("hidden");
        confirmBtn.removeEventListener("click", handleConfirm);
        cancelBtn.removeEventListener("click", cleanup);
    };

    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", cleanup);
}

function applyTheme() {
    const left = document.getElementById("left-color")?.value || "#575656";
    const right = document.getElementById("right-color")?.value || "#062e3f";
    const gradient = `linear-gradient(to right, ${left}, ${right})`;

    document.body.style.backgroundImage = gradient;
    localStorage.setItem("userTheme", JSON.stringify({ bg: gradient }));
}

function resetTheme() {
    const defaultGradient = "linear-gradient(100deg, #575656, #062e3f)";
    document.body.style.backgroundImage = defaultGradient;
    document.body.style.backgroundColor = "";
    localStorage.removeItem("userTheme");
}

function showHistory() {
    const historySection = document.getElementById("history-section");
    const historyList = document.getElementById("history-list");
    const historyData = JSON.parse(localStorage.getItem("taskHistory")) || [];

    historyList.innerHTML = "";

    const clearBtn = document.querySelector('#history-section button[onclick="clearHistory()"]');
    if (clearBtn) {
        clearBtn.style.display = historyData.length > 0 ? "inline-block" : "none";
    }

    [...historyData].reverse().forEach(item => {
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";
        historyItem.innerHTML = `
            <div><strong>${item.action}</strong></div>
            <div>Task: ${item.taskName}</div>
            <div>${item.timestamp}</div>
            ${item.fromColumn ? `<div>From: ${item.fromColumn}</div>` : ""}
            ${item.toColumn ? `<div>To: ${item.toColumn}</div>` : ""}
        `;
        historyList.appendChild(historyItem);
    });

    document.querySelector(".board").style.display = "none";
    document.getElementById("statistics-section").classList.add("hidden");
    document.getElementById("history-section").classList.remove("hidden");
    document.getElementById("calendar-section").classList.add("hidden");
    historySection.classList.remove("hidden");
}


function clearHistory() {
    const overlay = document.getElementById("clear-history-overlay");
    overlay.classList.remove("hidden");

    const confirmBtn = document.getElementById("confirm-clear-history-btn");
    const cancelBtn = document.getElementById("cancel-clear-history-btn");

    const handleConfirm = () => {
        localStorage.removeItem("taskHistory");
        document.getElementById("history-list").innerHTML = "";
        overlay.classList.add("hidden");
    };

    const handleCancel = () => {
        overlay.classList.add("hidden");
    };

    confirmBtn.addEventListener("click", handleConfirm, { once: true });
    cancelBtn.addEventListener("click", handleCancel, { once: true });
}



function logHistory(action, taskName, fromColumn = null, toColumn = null) {
    const historyData = JSON.parse(localStorage.getItem("taskHistory")) || [];

    historyData.push({
        action,
        taskName,
        fromColumn,
        toColumn,
        timestamp: new Date().toLocaleString()
    });

    // Giới hạn lịch sử 50 mục gần nhất
    if (historyData.length > 50) {
        historyData.shift();
    }

    localStorage.setItem("taskHistory", JSON.stringify(historyData));
}

const calendarGrid = document.getElementById("calendar-grid");
const calendarMonthLabel = document.getElementById("calendar-month");
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

document.getElementById("calendar-prev").onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
};

document.getElementById("calendar-next").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
};

function renderCalendar(month, year) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    calendarMonthLabel.innerText = `${monthNames[month]} ${year}`;
    calendarGrid.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("div");
        blank.className = "calendar-day";
        calendarGrid.appendChild(blank);
    }

    const tasks = getCurrentTasks();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.className = "calendar-day";
        dayCell.innerHTML = `<div class="day-number">${day}</div>`;

        const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        tasks.forEach(col => {
            col.tasks.forEach(task => {
                if (task.date === fullDate) {
                    const taskDiv = document.createElement("div");
                    taskDiv.className = "calendar-task";
                    taskDiv.innerText = task.text;
                    dayCell.appendChild(taskDiv);
                }
            });
        });

        calendarGrid.appendChild(dayCell);
    }
}

function setActiveSidebar(id) {
    document.querySelectorAll(".sidebar .sidebar-top button").forEach(btn => {
        btn.classList.remove("active");
    });

    const activeBtn = document.getElementById(id);
    if (activeBtn) activeBtn.classList.add("active");
}
