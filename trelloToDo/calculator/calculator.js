const entries = JSON.parse(localStorage.getItem("entries")) || [];

function addEntry() {
  const amount = document.querySelector(".amount").value;
  const category = document.querySelector(".category").value;
  const date = document.querySelector(".date").value;
  const type = document.querySelector(".type_of_action").value;

  if (!amount || !category || !date) {
    alert("Заповніть всі поля!");
    return;
  }

  const entry = {
    amount: parseFloat(amount),
    category: category,
    date: date,
    type: type,
  };
  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  renderCalendar();
}

function renderCalendar() {
  let balance = 0;
  const historyDiv = document.querySelector(".history_of_budget_container");
  historyDiv.innerHTML = "";

  entries.forEach((entry, index) => {
    let div = document.createElement("div");
    div.className = `entry ${entry.type}`;
    div.innerHTML = `<p class="${entry.type}">${entry.amount} грн</p> 
                         <p>${entry.category}</p> 
                         <p>${entry.date}</p>
                         <button class="delete_btn" onclick="deleteEntry(${index})">🗑️</button>`;
    historyDiv.appendChild(div);

    balance += entry.type === "income" ? entry.amount : -entry.amount;
  });

  document.querySelector(".balance span").textContent = balance;
}

function deleteEntry(index) {
  entries.splice(index, 1);
  localStorage.setItem("entries", JSON.stringify(entries));
  renderCalendar();
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".date").value = new Date()
    .toISOString()
    .split("T")[0];

  renderCalendar();
});
