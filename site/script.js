const inputs = document.querySelectorAll("#inputs div>*");
const nameInput = inputs[0];
const xpInput = inputs[1];
const avatarUrlInput = inputs[2];
const classesInput = inputs[3];
const buttons = document.querySelectorAll("buttons>*");
const submit = buttons[0];
const modif = buttons[1];
const cancel = buttons[2];
const order = document.querySelector("#orderByLevel");
const addNode = document.querySelector("tbody");

submit.addEventListener("click", readInputs);
modif.addEventListener("click", commitChanges);
cancel.addEventListener("click", cancelChanges);

inputs.forEach((input) => input.addEventListener("input", writeCache));
nameInput.addEventListener("paste", e => e.preventDefault());
xpInput.addEventListener("paste", (e) => e.preventDefault());
classesInput.addEventListener("paste", (e) => e.preventDefault());


/*--- Gestion de l'ordre ---*/
order.addEventListener("click", () => {
  if (cache.orderBy < 2) {
    cache.orderBy++;
  } else cache.orderBy = 0;
  writeCache();

  addNode.innerHTML = "";
  loadPage(data.characters);
});

/*--- initialisation du tableau avec les donnee stockees ---*/
loadCache();

function loadPage(arr) {
  switch (cache.orderBy) {
    case 0: {
      console.log("case 0 " + arr[0].name);
      arr.forEach((element) => print(element));
      break;
    }
    case 1: {
      let asc = JSON.parse(JSON.stringify(arr));

      asc.sort((a, b) => {
        return a.xp < b.xp ? -1 : a.xp > b.xp ? 1 : 0;
      });
      asc.forEach((element) => print(element));
      console.log("case 1 " + asc[0].name);
      break;
    }
    case 2: {
      let desc = JSON.parse(JSON.stringify(arr));

      desc = desc.sort((a, b) => {
        return a.xp < b.xp ? 1 : a.xp > b.xp ? -1 : 0;
      });
      desc.forEach((element) => print(element));
      console.log("case 2 " + desc[0].name);
      break;
    }
    default:
      alert("erreure: OrderBy est hors des valeurs");
  }
}

loadPage(data.characters);
if (cache.disable) disable();
if (cache.modifMode) buttonToggle();
/*---- ajout d'un character a la liste ---- */

function add(character) {
  data.characters.push(character);

  writeToLocalStorage();
}

/* ---- Creation d'une ligne ---- */
function print(character) {
  let newTR = document.createElement("tr");
  newTR.id = character.id;
  newTR.innerHTML = writeInnerHTML(character);
  addNode.appendChild(newTR);
}

function writeInnerHTML(character) {
  let lvlCount = levelCount(character.xp);
  let lvl = lvlCount.lvl;
  let xpPreviousLvl = lvlCount.xpAcc - lvl*1000; 
  let lvlPercent = ((character.xp-xpPreviousLvl) / (lvl*1000)) * 100;
  let htmlClasses = classesToHtml(character.classes);

  let accordion = `
    <div class="classes-header">
      <p>${character.classes[0]}</p>
      <i class="fas fa-chevron-down" onclick="extend(this)"></i>
      </div>
      <div class="classes hidden">
       <i class="fas fa-chevron-up" onclick="extend(this)"></i>
        ${htmlClasses}
        </div>`;
  return `
 
  <td><img src="${character.avatarUrl}" alt=""></td>
    <td>${character.name}</td>
    <td>${accordion}</td>
    <td>${lvl}</td>
    <td>${character.xp}</td>
    <td><div class="progress-bar" ><div class="progress" style="width:${lvlPercent}%"></div></div></td>
    <td><i id = "modify" class="fas fa-cog" onclick="modify(this)"></i></td>
    <td><i id = "delete" class="fas fa-times"onclick="deleteRow(this)" ></i></td>
    `;
}

/* ---- Lecture des entrees & appel fonction affichage ----*/
function readInputs() {
  if (validateInputs()) {
    let newCharacter = {
      id: data.nextId++,
      name: nameInput.value,
      xp: xpInput.value,
      avatarUrl: avatarUrlInput.value,
      classes: classesParser(),
    };

    add(newCharacter);
    print(newCharacter);
    clear();
    writeCache();
  }
}

function classesParser() {
  let classString = classesInput.value;
  let classes = classString.split("\n");

  return classes;
}
function classesToHtml(classes) {
  let classesHTML = "";
  classes.forEach((c) => (classesHTML += `<p>${c}</p>`));
  return classesHTML;
}
function extend(ele) {
  let affectedTd = ele.parentElement.parentElement;

  let classesHeader = affectedTd.children[0];
  let classesContainer = affectedTd.children[1];
  classesHeader.classList.toggle("hidden");
  classesContainer.classList.toggle("hidden");
}
function clear() {
  inputs.forEach((input) => (input.value = ""));
}

function clearErrors() {
  inputs.forEach((i) => i.classList.remove("invalid"));
}

/* ---- Calculs et validations ---*/

const nameValidation = new RegExp(/^[A-Za-z\s]+$/);
const urlValidation = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&=]*)/gm
);

nameInput.addEventListener("keydown", validateName);
xpInput.addEventListener("input", validateXp);

function validateName(event) {
  if (event.key.match(nameValidation) == null) {
    event.preventDefault();
  }
}
function validateXp() {
  this.value = this.value.replace(/[^0-9]/g, "").replace(/(\..*?)\..*/g, "$1");
}

function validateInputs() {
  

  if (!nameInput.reportValidity()) {
    nameInput.classList.add("invalid");
    return false;
  } else nameInput.classList.remove("invalid");
  if (!xpInput.reportValidity() ) {
    xpInput.classList.add("invalid");
    return false;
  } else xpInput.classList.remove("invalid");
  
  if (!avatarUrlInput.value.match(urlValidation)) {
    avatarUrlInput.classList.add("invalid");
    return false;
  } else avatarUrlInput.classList.remove("invalid");
  return true;
 

}


///Compte le niveau auquel le personnage est rendu par
///rapport au nombre d'xp accumule
///retourne le niveau et l'experience total necessaire au prochain niveau
function levelCount(xp) {
  let count = {
    lvl: 1,
    xpAcc: 0,
  };
  do {
    count.xpAcc += count.lvl * 1000;
    console.log(count);
    if (count.xpAcc > xp) return count;
    count.lvl++;
  } while (count.xpAcc <= xp);
}

/*---- Modifier une ligne --- */

function modify(element) {
  let id = element.parentElement.parentElement.id;
  let affectedChar = data.characters.find((element) => element.id == id);
  nameInput.value = affectedChar.name;
  xpInput.value = affectedChar.xp;
  avatarUrlInput.value = affectedChar.avatarUrl;
  classesInput.value = "";
  affectedChar.classes.forEach((element) => {
    classesInput.value += `${element}\n`;
  });
  buttonToggle();
  disable();

  clearErrors();
  modif.value = id;
  cache.modifMode = true;

  writeCache();
}

//Dirty
inputs.forEach((i) => i.addEventListener("input", isDirty));

function isDirty() {
  if (modif.disabled == true) modif.disabled = false;

  if (submit.disabled == true) submit.disabled = false;
}

function cancelChanges() {
  clear();
  buttonToggle();
  enable();
  modif.value = 0;
  cache.modifMode = false;
  writeCache();
}
function commitChanges() {
  let id = this.value;
  if (validateInputs()) {
    modifyCharacter(id);
    writeToLocalStorage();
    modifyRow(id);
    buttonToggle();
    enable();
    clear();
  }
}

function buttonToggle() {
  submit.classList.toggle("hidden"); //affichage des boutons
  modif.classList.toggle("hidden");
  cancel.classList.toggle("hidden");
}

function disable() {
  let deleteButtons = document.querySelectorAll("#delete");
  let modifyButtons = document.querySelectorAll("#modify");

  buttons.forEach((btn) => (btn.disabled = true));
  for (btn of deleteButtons) {
    btn.onclick = "null";
  }
  for (btn of modifyButtons) {
    btn.onclick = "null";
  }
  cache.disable = true;
  cancel.disabled = false;
  writeCache();
}

function enable() {
  let deleteButtons = document.querySelectorAll("#delete");
  let modifyButtons = document.querySelectorAll("#modify");
  buttons.forEach((btn) => (btn.disabled = false));

  for (btn of deleteButtons) {
    btn.outerHTML = `<i id="delete" class="fas fa-times" onclick="deleteRow(this)" aria-hidden="true"></i>`;
  }
  for (btn of modifyButtons) {
    btn.outerHTML = `<i id="modify" class="fas fa-cog" onclick="modify(this)" aria-hidden="true"></i>`;
  }
  cache.disable = false;
  writeCache();
}
function modifyCharacter(id) {
  getById(id).name = nameInput.value;
  getById(id).xp = xpInput.value;
  getById(id).avatarUrl = avatarUrlInput.value;
  getById(id).classes = classesParser();
  writeToLocalStorage();
}
function modifyRow(id) {
  let charToModify = getById(id);
  trToModify = document.getElementById(id);
  trToModify.innerHTML = writeInnerHTML(charToModify);
}
/*---- Supprimer une ligne ---*/

function deleteRow(element) {
  let elementToDelete = element.parentElement.parentElement;
  if (confirmDelete(elementToDelete)) {
    deleteById(elementToDelete.id);
    elementToDelete.remove();
    writeToLocalStorage();
  }
}

function confirmDelete(row) {
  let name = getById(row.id).name;
  return window.confirm(`Voulez-vous vraiment supprimer ${name}?`);
}
function validTrue() {}
/*--- fonctions utiles ---*/
function getById(id) {
  return data.characters.find((element) => element.id == id);
}
function deleteById(id) {
  data.characters = data.characters.filter((ele) => ele.id != id);
}
