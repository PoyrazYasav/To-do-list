const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const themeBtn = document.getElementById("themeBtn");
const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const activeBtn = document.getElementById("activeBtn");
const sortSelect = document.getElementById("sortSelect");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect"); // YENİ
const dueDate = document.getElementById("dueDate");

// JSON Dışa/İçe Aktar Butonları (YENİ)
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

let currentFilter = "all";
let draggedIndex = null;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

showTasks();

button.addEventListener("click", function(){
    if(input.value.trim() === ""){
        alert("Görev giriniz!");
        return;
    }

    tasks.push({
        text: input.value,
        completed: false,
        pinned: false,
        date: new Date().toLocaleString("tr-TR",{
            day: "2-digit",
            month:"2-digit",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit"
        }),
        category: categorySelect.value,
        priority: prioritySelect.value, // YENİ: Öncelik kaydediliyor
        dueDate: dueDate.value,
        createdAt: Date.now()
    });

    saveTasks();
    showTasks();
    input.value = "";
});

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks(){
    list.innerHTML = "";

    if(tasks.length === 0){
        list.innerHTML = "<p>Henüz görev eklenmedi.</p>";
    }

    tasks.sort((a,b)=>{
        if(a.pinned !== b.pinned){
            return b.pinned - a.pinned;
        }
        switch(sortSelect.value){
            case "az": return a.text.localeCompare(b.text);
            case "za": return b.text.localeCompare(a.text);
            case "old": return a.createdAt - b.createdAt;
            default: return b.createdAt - a.createdAt;
        }
    });

    tasks.forEach((task,index)=>{
        if(currentFilter === "completed" && !task.completed) return;
        if(currentFilter === "active" && task.completed) return;

        const li = document.createElement("li");
        li.draggable = true;

        if (task.dueDate) {
            const today = new Date();
            const due = new Date(task.dueDate);
            today.setHours(0, 0, 0, 0);
            due.setHours(0, 0, 0, 0);

            if (due < today && !task.completed) {
                li.classList.add("overdue");
            }
        }

        if(task.completed){
            li.classList.add("completed");
        }

        // Öncelik Sınıfını Belirleme (YENİ)
        let priorityClass = "priority-düsük";
        if (task.priority === "Orta") priorityClass = "priority-orta";
        if (task.priority === "Yüksek") priorityClass = "priority-yüksek";

        const span = document.createElement("span");
        // HTML yapısına Öncelik (Priority) eklendi
        span.innerHTML = `
            <strong>${task.text}</strong><br>
            <small>Eklenme: ${task.date}</small><br>
            <small>Son Tarih: ${task.dueDate || "Belirtilmedi"}</small><br>
            <small class="category">${task.category}</small>
            <small class="priority ${priorityClass}">${task.priority || "Düşük"} Öncelik</small>
        `;

        span.onclick = function(){
            task.completed = !task.completed;
            saveTasks();
            showTasks();
        };

        const pin = document.createElement("button");
        pin.textContent = task.pinned ? "📌" : "📍";
        pin.className = "pin-btn";
        pin.onclick = function(){
            task.pinned = !task.pinned;
            saveTasks();
            showTasks();
        };

        const edit = document.createElement("button");
        edit.textContent = "Düzenle";
        edit.className = "edit-btn";
        edit.onclick = function(){
            const newTask = prompt("Görevi düzenle:", task.text);
            if(newTask){
                task.text = newTask;
                saveTasks();
                showTasks();
            }
        };

        const del = document.createElement("button");
        del.textContent = "Sil";
        del.className = "delete-btn";
        del.onclick = function(){
            tasks.splice(index,1);
            saveTasks();
            showTasks();
        };

        li.appendChild(span);
        li.appendChild(pin);
        li.appendChild(edit);
        li.appendChild(del);

        li.addEventListener("dragstart", function () {
            draggedIndex = index;
        });
        
        list.appendChild(li);
    });

    document.getElementById("taskCount").textContent = "Toplam Görev: " + tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    document.getElementById("completedCount").textContent = "Tamamlanan: " + completed;
}

input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        button.click();
    }
});

clearAllBtn.addEventListener("click", function(){
    if(tasks.length === 0){
        alert("Silinecek görev yok!");
        return;
    }
    const confirmDelete = confirm("Tüm görevleri silmek istediğine emin misin?");
    if(confirmDelete){
        tasks = [];
        saveTasks();
        showTasks();
    }
});

themeBtn.addEventListener("click", function(){
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){
        themeBtn.textContent = "☀️ Light Mode";
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
    }
});

allBtn.addEventListener("click", function(){
    currentFilter = "all";
    showTasks();
});

completedBtn.addEventListener("click", function(){
    currentFilter = "completed";
    showTasks();
});

activeBtn.addEventListener("click", function(){
    currentFilter = "active";
    showTasks();
});

sortSelect.addEventListener("change", function(){
    showTasks();
});

// YENİ: JSON Dışa Aktarma (Export) İşlemi
exportBtn.addEventListener("click", function() {
    if (tasks.length === 0) {
        alert("Dışa aktarılacak görev bulunmuyor!");
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "gorevlerim.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

// YENİ: JSON İçe Aktarma (Import) İşlemi
importBtn.addEventListener("click", function() {
    importFile.click(); 
});

importFile.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTasks = JSON.parse(e.target.result);
            if (Array.isArray(importedTasks)) {
                // Mevcut görevlerle birleştirmek istersen `tasks = tasks.concat(importedTasks)` yapabilirsin, 
                // şu an olanın üzerine yazıyoruz.
                tasks = importedTasks; 
                saveTasks();
                showTasks();
                alert("Görevler başarıyla içe aktarıldı!");
            } else {
                alert("Geçersiz dosya formatı!");
            }
        } catch (error) {
            alert("Dosya okunurken bir hata oluştu!");
        }
    };
    reader.readAsText(file);
    importFile.value = ""; // Aynı dosyayı tekrar seçebilmek için input'u sıfırlıyoruz.
});