const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

showTasks();

button.addEventListener("click", function(){

    if(input.value.trim() === ""){

        alert("Görev giriniz!");

        return;

    }

    tasks.push({

        text: input.value,

        completed: false

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

    tasks.forEach((task,index)=>{

        const li = document.createElement("li");

        if(task.completed){
            li.classList.add("completed");
        }

        const span = document.createElement("span");
        span.textContent = task.text;

        span.onclick = function(){

            task.completed = !task.completed;

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