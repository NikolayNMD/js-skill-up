const entries = JSON.parse(localStorage.getItem("entries")) || [];

function addEntry() {
  const amountInput = document.querySelector(".amount");
  const categoryInput = document.querySelector(".category");
  const dateInput = document.querySelector(".date");
  const typeInput = document.querySelector(".type_of_action");
  console.log(typeInput);

  const amount = amountInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;
  const type = typeInput.value;

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

  amountInput.value = "";
  categoryInput.value = "";
  dateInput.value = new Date().toISOString().split("T")[0];
  typeInput.value = "plus_money";
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

    balance += entry.type === "plus_money" ? entry.amount : -entry.amount;
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
