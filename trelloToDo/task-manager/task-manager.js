//* Task *//

class Task {
  constructor(name, description, priority) {
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.status = "нова";
  }
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.querySelectorAll(".task_list");
  taskList.forEach((list) => {
    const status = list.getAttribute("status");
    const filteredTasks = tasks.filter((task) => task.status === status);

    if (filteredTasks.length > 0) {
      list.innerHTML = filteredTasks
        .map((task, index) => {
          const taskIndex = tasks.indexOf(task);
          return `
          <div class="task" 
               draggable="true" 
               priority="${task.priority}" 
               index="${taskIndex}" 
               onclick="showDetails(${taskIndex})">
            <strong>${task.name}</strong><br>
            <p>${task.description}</p>
          </div>`;
        })
        .join("");
    } else {
      list.innerHTML = "<span class='empty_message'>Немає завдань</span>";
    }
  });

  saveToLocalStorage();
}

function sortTasks(status, order) {
  tasks = tasks.sort((a, b) => {
    const priorities = { високий: 1, середній: 2, низький: 3 };
    if (a.status === status && b.status === status) {
      return order === "asc"
        ? priorities[a.priority] - priorities[b.priority]
        : priorities[b.priority] - priorities[a.priority];
    }
    return 0;
  });

  renderTasks();
}

//* Modal Create *//

const modalCreate = document.querySelector(".modal_create");
const modalBackdrop = document.querySelector(".modal_backdrop");

function openCreateModal() {
  modalCreate.classList.remove("is-hidden");
  modalBackdrop.classList.remove("is-hidden");
}

function closeCreateModal() {
  modalCreate.classList.add("is-hidden");
  modalBackdrop.classList.add("is-hidden");

  document.querySelector(".create_title").value = "";
  document.querySelector(".create_description").value = "";
  document.querySelector(".create_priority").value = "високий";
}

function createTask() {
  const name = document.querySelector(".create_title").value;
  const description = document.querySelector(".create_description").value;
  const priority = document.querySelector(".create_priority").value;
  tasks.push(new Task(name, description, priority, "нова"));
  closeCreateModal();
  renderTasks();
}

renderTasks();
