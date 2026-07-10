const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const themeBtn = document.getElementById("themeBtn");
const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const activeBtn = document.getElementById("activeBtn");
const sortSelect = document.getElementById("sortSelect");

let currentFilter = "all";


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

        return b.pinned-a.pinned;

    }

    switch(sortSelect.value){

        case "az":

            return a.text.localeCompare(b.text);

        case "za":

            return b.text.localeCompare(a.text);

        case "old":

            return a.createdAt - b.createdAt;

        default:

            return b.createdAt - a.createdAt;

    }

});

    tasks.forEach((task,index)=>{

        if(currentFilter === "completed" && ! task.completed){
            return;
        }
        if(currentFilter === "active" && task.completed){
            return;
        }

        const li = document.createElement("li");

        if(task.completed){
            li.classList.add("completed");
        }

        const span = document.createElement("span");
        span.innerHTML = `
            <strong>${task.text}</strong><br>
            <small>${task.date}</small>
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
    }else{
        themeBtn.textContent = "🌙 Dark Mode";
    }

});

allBtn.addEventListener("click",function(){
    currentFilter="all";
    showTasks();
});

completedBtn.addEventListener("click",function(){
    currentFilter="completed";
    showTasks();
});

activeBtn.addEventListener("click",function(){
    currentFilter="active";
    showTasks();
});
sortSelect.addEventListener("change",function(){

    showTasks();

});