const saveList = document.getElementById("save-list");
const create = document.getElementById("create");
const notes = document.getElementById("notes");
const display = document.getElementById("display");
const keyboardShortcuts = document.getElementById("keyboard-shortcuts");
// const notesList = document.getElementById("notes-list")
const listStatus = document.getElementById("list-status");
const detailsEls = document.getElementsByTagName("details");
const summaryEls = document.getElementsByTagName("summary");
const contents = document.getElementsByClassName("content");
const textareaEls = document.getElementsByTagName("textarea");

const backups = document.getElementById("backups")
const backupBtn = document.getElementById("backup-btn");

let isSaved = true;

create.addEventListener("click", createList);
function createList() {
  const detailsEl = document.createElement("details");
  const summaryEl = document.createElement("summary");
  const summaryText = document.createElement("span");
  const content = document.createElement("textarea");
  summaryText.textContent = "Double-click to rename";
  summaryText.classList.add("summary-text");
  content.textContent = "Enter text here...";
  content.classList.add("content");
  // Array.from(detailsEls).forEach((detailsEl) => {
  //   detailsEl.open = false;
  // }); // OR
  for (const detailsEl of detailsEls) {
    detailsEl.open = false;
  }
  detailsEl.name = "list";
  detailsEl.open = true;

  summaryEl.appendChild(summaryText);
  detailsEl.append(summaryEl, content);
  notes.appendChild(detailsEl);

  notes.scrollTop = notes.scrollHeight;

  summaryText.addEventListener("dblclick", renameEl);
  content.addEventListener("dblclick", renameEl);

  unsaved();
  refreshLists();
}

// function autoResize(textarea) {
//   textarea.style.height = 'auto'
//   textarea.style.height = textarea.scrollHeight + 'px'
// }
// for (const textareaEl of textareaEls) {
//   textareaEl.addEventListener('input', autoResize(this))
// }
function renameEl() {
  const originalText = this.textContent;
  const input = document.createElement("input");

  input.type = "text";
  input.value = originalText;
  input.style.width = "fit-content";

  this.textContent = "";
  this.appendChild(input);
  input.focus();
  input.select();

  let finished = false;

  const save = (text) => {
    if (finished) return;
    finished = true;
    this.textContent = text.trim() || originalText;
    unsaved();
  };

  input.onblur = () => save(input.value);

  input.onkeydown = (e) => {
    if (e.key === "Enter") input.blur(); // Triggers save()
    if (e.key === "Escape") {
      finished = true; // Block the onblur save
      this.textContent = originalText;
    }
  };
}

saveList.addEventListener("click", saveLists);
function saveLists() {
  const notesData = [];

  // Select all details elements currently in the notes div
  const allNotes = notes.querySelectorAll("details");

  allNotes.forEach((note) => {
    notesData.push({
      title: note.querySelector("summary").textContent,
      body: note.querySelector(".content").value,
    });
  });

  localStorage.setItem("myNotesApp", JSON.stringify(notesData));
  alert("Notes saved successfully!");
  saved();
    console.log(notes.innerHTML);
}

function loadNotes() {
  const savedData = localStorage.getItem("myNotesApp");
  if (!savedData) return;

  const notesData = JSON.parse(savedData);

  notesData.forEach((data) => {
    const detailsEl = document.createElement("details");
    const summaryEl = document.createElement("summary");
    const content = document.createElement("textarea");

    summaryEl.textContent = data.title;
    content.textContent = data.body;
    content.classList.add("content");

    detailsEl.append(summaryEl, content);
    notes.appendChild(detailsEl);

    // Re-attach the double click events
    summaryEl.addEventListener("dblclick", renameEl);
    content.addEventListener("dblclick", renameEl);
  });

  const savedBackup = localStorage.getItem("myNotesAppBackup")
  
  const backupData = JSON.parse(savedBackup);
  backupData.forEach((backup) => {
    backups.innerHTML = backup
  })
  console.log(backupData.lists)
  refreshLists();
}

// Call it on startup
loadNotes();

document.getElementById("delete-all").addEventListener("click", deleteAll);
function deleteAll() {
  if (confirm("Are you sure you want to delete all notes?")) {
    localStorage.removeItem("myNotesApp");
    notes.innerHTML = ""; // Clears the UI
    saved();
  }
}

document.getElementById("delete").addEventListener("click", deleteList);
function deleteList() {
  for (const detailsEl of detailsEls) {
    if (detailsEl.open) {
      detailsEl.remove();
      unsaved();
    }
  }
}

// Keyboard functions
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "n") {
    e.preventDefault();
    createList();
  }
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    saveLists();
  }
  if (e.key === "Delete") {
    e.preventDefault();
    deleteList();
  }
  if (e.ctrlKey && e.key === "Delete") {
    e.preventDefault();
    deleteAll();
  }
  if (e.ctrlKey && e.key === "?") {
    e.preventDefault();
    mouseEnter;
  }
});

// Keyboard auto-hide

// keyboardShortcuts.addEventListener("mouseenter", mouseEnter)
// function mouseEnter(event) {
//   if (event.target === keyboardShortcuts) {
//     setTimeout(function () {
//       keyboardShortcuts.style.right = "20px";
//     }, 0);
//   }
// };

// keyboardShortcuts.addEventListener("mouseleave", mouseLeave)
// function mouseLeave (event) {
//   if (event.target === keyboardShortcuts) {
//     setTimeout(function () {
//       keyboardShortcuts.style.right = "-180px";
//     }, 2000);
//   }
// };

// status message
function unsaved() {
  listStatus.style.display = "flex";
  listStatus.textContent = "You have unsaved changes";
  isSaved = false;
}
function saved() {
  listStatus.style.display = "none";
  isSaved = true;
}

function refreshLists() {
  for (const detailsEl of detailsEls) {
    detailsEl.addEventListener("keydown", function () {
      unsaved();
    });
  }
}

// Sidebar 
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");

sidebarToggle.addEventListener("click", toggleSidebar);
function toggleSidebar() {
  const collapseSidebar = sidebar.getAttribute("collapseSidebar");
  const sidebarIcon = document.getElementById("sidebar-icon");
  if (collapseSidebar === "true") {
    sidebarIcon.style.rotate = "-90deg";
    sidebar.removeAttribute("collapseSidebar");
  } else {
    sidebarIcon.style.rotate = "0deg";
    sidebar.setAttribute("collapseSidebar", "true");
    console.log("Sidebar");
  }
}

const backup = []
backupBtn.addEventListener("click", backupList);
function backupList() {
  const backupInput = document.getElementById("backup-input");
  if (backupInput.value) {
    backup.push({
      name: backupInput.value,
      lists: notes.innerHTML
    }
  )
  saveBackup()
  console.log(backup)
  } else {
    alert("Enter a name for the current lists");
  }
}
function saveBackup() {
  localStorage.setItem("myNotesAppBackup", JSON.stringify(backup));
}