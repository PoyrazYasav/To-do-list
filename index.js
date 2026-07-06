const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");

button.addEventListener("click", function () {

    if (input.value === "") {
        alert("Görev giriniz!");
        return;
    }

    const li = document.createElement("li");
    li.textContent = input.value;

    li.addEventListener("click", function () {
        li.classList.toggle("completed");
    });

    const sil = document.createElement("button");
    sil.textContent = "Sil";
    sil.className = "delete-btn";

    sil.onclick = function () {
        li.remove();
    };

    li.appendChild(sil);
    list.appendChild(li);

    input.value = "";
});