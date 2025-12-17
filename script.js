const addbtn = document.getElementById("addbtn");
const dateinp = document.getElementById("dateinp");
const nameinp = document.getElementById("nameinp");
const list = document.getElementById("list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function savetasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addbtn.addEventListener("click", () => {
  const name = nameinp.value.trim();
  const date = dateinp.value;
  nameinp.value = "";
  dateinp.value = "";

  const task = {
    id: Date.now(),
    name,
    date,
    status: "in progress",
  };

  if (name && date) {
    tasks.push(task);
  } else {
    alert("fill the inputs");
  }
  savetasks();
  rendert();
});
const filt = document.getElementById("filt");
function rendert() {
  list.innerHTML = "";
  let filted = [...tasks];

  if (filt.value === "done") {
    filted = filted.filter((t) => t.status === "done");
  } else if (filt.value === "inpro") {
    filted = filted.filter((t) => t.status === "in progress" && !isWasted(t));
  }
  filted.forEach((task) => {
    const li = document.createElement("li");

    const di1 = document.createElement("div");
    di1.innerHTML = `
    <strong>${task.name} •</strong>
    <small>Deadline: ${task.date}</small>
    `;
    const st = document.createElement("small");

    if (task.status === "done") {
      st.style.color = "green";
    } else if (task.status === "in progress") {
      st.style.color = "orange";
    }
    if (isWasted(task)) {
      st.textContent = "Wasted";
      st.style.color = "red";
    } else {
      st.textContent = "Status: " + task.status;
    }
    di1.append(st);

    const btns = document.createElement("div");
    const dellbtn = document.createElement("button");
    dellbtn.textContent = "Dell";
    dellbtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      rendert();
      savetasks();
    });

    const toggle = document.createElement("button");
    toggle.textContent = "toggle";
    toggle.addEventListener("click", () => {
      task.status = task.status === "done" ? "in progress" : "done";
      rendert();
      savetasks();
    });
    if (!isWasted(task)) {
      btns.append(toggle);
    }
    btns.append(dellbtn);
    li.append(di1, btns);
    list.append(li);
  });
}
function isWasted(note) {
  return new Date(note.date) < new Date() && note.status !== "done";
}

filt.addEventListener("change", rendert);
rendert();
