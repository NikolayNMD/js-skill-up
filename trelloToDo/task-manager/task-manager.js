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

let draggedTaskIndex = null;

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.querySelectorAll(".task_list");
  taskList.forEach((list) => {
    const status = list.getAttribute("data-status");
    const filteredTasks = tasks.filter((task) => task.status === status);

    if (filteredTasks.length > 0) {
      list.innerHTML = filteredTasks
        .map((task, index) => {
          const taskIndex = tasks.indexOf(task);
          return `
          <div class="task" 
               draggable="true" 
               priority="${task.priority}" 
               data-index="${taskIndex}"
               onclick="openInformationModal(${index})">
            <strong>${task.name}</strong><br>
            <p>${task.description}</p>
          </div>`;
        })
        .join("");

      list.querySelectorAll(".task").forEach((task) => {
        task.addEventListener("dragstart", () => {
          draggedTaskIndex = task.dataset.index;
        });
        task.addEventListener("dragend", () => {
          draggedTaskIndex = null;
        });
      });
    } else {
      list.innerHTML = "<span class='empty_message'>Немає завдань</span>";
    }
  });

  saveToLocalStorage();
}

function sortTasks(status, order) {
  tasks = tasks.sort((a, b) => {
    const PRIORITIES = {
      високий: 1,
      середній: 2,
      низький: 3,
    };
    if (a.status === status && b.status === status) {
      return order === "asc"
        ? PRIORITIES[a.priority] - PRIORITIES[b.priority]
        : PRIORITIES[b.priority] - PRIORITIES[a.priority];
    }
    return 0;
  });

  renderTasks();
}

//* Modal Create *//

const modalCreate = document.querySelector(".modal_create");
const modalBackdrop = document.querySelector(".modal_backdrop");
const createBtn = document.querySelector(".create");
const create_title = document.querySelector(".create_title");
const create_description = document.querySelector(".create_description");
createBtn.disabled = true;

function openCreateModal() {
  modalCreate.classList.remove("is-hidden");
  modalBackdrop.classList.remove("is-hidden");
}

function closeCreateModal() {
  modalCreate.classList.add("is-hidden");
  modalBackdrop.classList.add("is-hidden");

  create_title.value = "";
  create_description.value = "";
  document.querySelector(".create_priority").value = "високий";
}

function createTask() {
  const name = create_title.value;
  const description = create_description.value;
  const priority = document.querySelector(".create_priority").value;
  tasks.push(new Task(name, description, priority, "нова"));
  closeCreateModal();
  renderTasks();
}

create_title.addEventListener("input", () => {
  createBtn.disabled = !(
    create_title.value.trim() && create_description.value.trim()
  );
});

create_description.addEventListener("input", () => {
  createBtn.disabled = !(
    create_title.value.trim() && create_description.value.trim()
  );
});

//* Modal Information *//

const modalInformation = document.querySelector(".modal_information");
const saveBtn = document.querySelector(".save");
const task_name = document.querySelector(".task_name");
const task_description = document.querySelector(".task_description");
saveBtn.disabled = false;

function openInformationModal(index) {
  const task = tasks[index];
  currentTaskIndex = index;

  task_name.value = task.name;
  task_description.value = task.description;
  document.querySelector(".task_priority").value = task.priority;
  document.querySelector(".task_status").value = task.status;

  modalInformation.classList.remove("is-hidden");
  modalBackdrop.classList.remove("is-hidden");
}

function closeInformationModal() {
  modalInformation.classList.add("is-hidden");
  modalBackdrop.classList.add("is-hidden");
}

function saveTask() {
  const task = tasks[currentTaskIndex];
  task.name = task_name.value;
  task.description = task_description.value;
  task.priority = document.querySelector(".task_priority").value;
  task.status = document.querySelector(".task_status").value;

  renderTasks();
  closeInformationModal();
}

task_name.addEventListener("input", () => {
  saveBtn.disabled = !(task_name.value.trim() && task_description.value.trim());
});

task_description.addEventListener("input", () => {
  saveBtn.disabled = !(task_name.value.trim() && task_description.value.trim());
});

function deleteTask() {
  if (currentTaskIndex !== null) {
    tasks.splice(currentTaskIndex, 1);
    renderTasks();
    closeInformationModal();
  }
}

//* Dragging Tasks *//

document.querySelectorAll(".task_list").forEach((list) => {
  list.addEventListener("dragover", (e) => e.preventDefault());
  list.addEventListener("drop", (e) => {
    e.preventDefault();
    const status = list.dataset.status;
    const draggedIndex = parseInt(draggedTaskIndex, 10);

    if (!isNaN(draggedIndex)) {
      tasks[draggedIndex].status = status;
      renderTasks();
    }
  });
});

renderTasks();
