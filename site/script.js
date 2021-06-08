const inputs = document.querySelectorAll("#inputs div>*");
const nameInput = inputs[0];
const xpInput = inputs[1];
const avatarUrlInput = inputs[2];
const classesInput = inputs[3];
const buttons = document.querySelectorAll("#inputs button");
const submit = buttons[0];
const modif = buttons[1];
const cancel = buttons[2];

const addNode = document.querySelector("tbody");

submit.addEventListener("click", readInputs);
modif.addEventListener("click", commitChanges);
cancel.addEventListener("click", cancelChanges);

/*--- initialisation du tableau avec les donnee stockees ---*/

data.characters.forEach((element) => print(element));

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
  let toNextLvl = (character.xp / lvlCount.xpAcc) * 100;
  return `
    <td><img src="${character.avatarUrl}" alt=""></td>
    <td>${character.name}</td>
    <td>${character.classes}</td>
    <td>${lvl}</td>
    <td>${character.xp}</td>
    <td><div class="progress-bar" ><div class="progress" style="width:${toNextLvl}%"></div></div></td>
    <td><i class="fas fa-cog" onclick="modify(this)"></i></td>
    <td><i class="fas fa-times"onclick="deleteRow(this)"></i></td>
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
  }
}

function classesParser() {
  //classes parser
  let classString = classesInput.value;
  let classes = classString.split("\n");

  return classes;
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

//this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')

nameInput.addEventListener("keydown", validateName);
xpInput.addEventListener("input", validateXp);

function validateName(event) {
  console.log(event.key.match(nameValidation));
  if (event.key.match(nameValidation) == null) {
    event.preventDefault();
  }
}
function validateXp() {
  this.value = this.value.replace(/[^0-9]/g, "").replace(/(\..*?)\..*/g, "$1");
}

function validateInputs() {
  //let valid = true;
  if (!nameInput.reportValidity()) {
    nameInput.classList.add("invalid");
    return false;
  } else nameInput.classList.remove("invalid");
  if (!xpInput.reportValidity()) {
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
  clearErrors();
  modif.value = id;
}
function cancelChanges() {
  clear();
  buttonToggle();
  modif.value = 0;
}
function commitChanges() {
  let id = this.value;
  if (validateInputs()) {
    modifyCharacter(id);
    writeToLocalStorage();
    modifyRow(id);
    buttonToggle();
    clear();
  }
}

function buttonToggle() {
  submit.classList.toggle("hidden"); //affichage des boutons
  modif.classList.toggle("hidden");
  cancel.classList.toggle("hidden");
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
  if (confirmDelete(element)) {
    deleteById(elementToDelete.id);
    elementToDelete.remove();
    writeToLocalStorage();
  }
}

function confirmDelete(row) {
    let name = getById(row.id).name;
    window.prompt(`Voulez-vous vraiment supprimer ${name}?`)
}
function validTrue(){

}
/*--- fonctions utiles ---*/
function getById(id) {
  return data.characters.find((element) => element.id == id);
}
function deleteById(id) {
  data.characters = data.characters.filter((ele) => ele.id != id);
}
