document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image");
  const todosContainer = document.querySelector(".todos-container");
  const progressBar = document.getElementById("progress");
  const progressNumbers = document.getElementById("numbers");
  const form = document.querySelector(".input-area");

  const toggleEmptyState = () => {
    const hasTasks = taskList.children.length > 0;
    emptyImage.style.display = hasTasks ? "none" : "block"; todosContainer.style.width = hasTasks ? "100%" : "50%";
  };

  const updateProgress = () => {
    const total = taskList.children.length;
    const completed = taskList.querySelectorAll(".checkbox:checked").length;

    progressNumbers.textContent = `${completed} / ${total}`;
    progressBar.style.width = total ? `${(completed / total) * 100}%` : "0%";

    if (total > 0 && completed === total) {
      Confetti();
    }
  };

  const saveTasks = () => {
    const tasks = [...taskList.children].map((li) => ({
      text: li.querySelector("span").textContent, completed: li.querySelector(".checkbox").checked }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(({ text, completed }) => addTask(text, completed));
    toggleEmptyState();
    updateProgress();
  };

  const addTask = (text = null, completed = false) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
                    <span>${taskText}</span>
                    <div class="task-buttons">
                      <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                      <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </div>`;

    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    if (completed) {
      li.classList.add("completed");
      editBtn.disabled = true;
      editBtn.style.opacity = "0.5";
      editBtn.style.pointerEvents = "none";
    }

    checkbox.addEventListener("change", () => {
      const checked = checkbox.checked;
      li.classList.toggle("completed", checked);
      editBtn.disabled = checked;
      editBtn.style.opacity = checked ? "0.5" : "1";
      editBtn.style.pointerEvents = checked ? "none" : "auto";

      updateProgress();
      saveTasks();
    });

    editBtn.addEventListener("click", () => {
      if (checkbox.checked) return;

      taskInput.value = li.querySelector("span").textContent;
      taskInput.focus();

      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTasks();
    });

    deleteBtn.addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTasks();
    });

    taskList.appendChild(li);
    updateProgress();  

    taskInput.value = "";
    toggleEmptyState();
    updateProgress();  
    saveTasks();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
  });

  loadTasks();
});

const Confetti = () => {
  const count = 200;
  const defaults = { origin: { y: 0.7 } };

  const fire = (ratio, options) => {
    confetti({
      ...defaults,
      ...options,
      particleCount: Math.floor(count * ratio),
    });
  };

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};
