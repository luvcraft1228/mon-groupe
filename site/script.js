const inputs = document.querySelectorAll("#inputs div>*");
const nameInput = inputs[0];
const xpInput = inputs[1];
const avatarUrlInput = inputs[2]; 
const classesInput = inputs[3];
const submit = inputs[4];
const modif = inputs[5];

const addNode = document.querySelector("thead");

submit.addEventListener("click", readInputs);
modif.addEventListener("click", commitChanges);
/* ---- Local Storage ---- */

let characterStorage = window.localStorage;
let characters = [
  {
    id: 0,
    avatarUrl:
      "https://i.pinimg.com/236x/2a/b2/bf/2ab2bf57c9326c85f1805f08bb21e3e1.jpg",
    name: "Billy",
    xp: 10600,
    classes: ["voleur"],
  },
  {
    id: 1,
    avatarUrl:
      "https://i.pinimg.com/originals/cf/61/d5/cf61d563013cf829deb56e10b32e681b.jpg",
    name: "Jess",
    xp: 1500,
    classes: ["bard", "sorcerer"],
  },
  {
    id: 2,
    avatarUrl:
      "https://www.hireanillustrator.com/i/images/2018/07/Melanie_gnomeportrait_finalsm-600x750.jpg",
    name: "Sammy the wise",
    xp: 6040,
    classes: ["wizard", "arcanist", "librarian"],
  },
  {
    id: 3,
    avatarUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy5IBwH6CkVL-aNYpAXAkNvE2RsKDVmCTx0NSKzo-uEidh1wFwlLRdfdDgEgcxIIHw1_8&usqp=CAU",
    name: "Sir Killalot",
    xp: 10560,
    classes: ["figther", "dragon priest"],
  },
  {
    id: 4,
    avatarUrl:
      "https://i.pinimg.com/originals/aa/a1/f4/aaa1f44fe31bd58585a124970bc0c93b.jpg",
    name: "Grum",
    xp: 22000,
    classes: ["barbarian", "war chief"],
  },
];

/*---- verification de premiere utilisation ----*/
if (characterStorage.getItem("characters") == null) {
    alert("null");
  writeToLocalStorage();
}else{
  characters = JSON.parse(characterStorage.getItem("characters"))
}


function writeToLocalStorage(){
    let charactersSerialized = JSON.stringify(characters);
    characterStorage.setItem("characters", charactersSerialized);
    
}


/*--- initialisation du tableau avec les donnee stocker ---*/
characters.forEach(element => print(element))

/*---- ajout d'un character a la liste ---- */

function add(character){
  characters.push(character);
  writeToLocalStorage(); 
}

/* ---- Creation d'une ligne ---- */
function print(character){
   
  
   let newTR = document.createElement("tr");
   let lvlCount = levelCount(character.xp);
   let lvl = lvlCount.lvl;
   let toNextLvl = (character.xp/lvlCount.xpAcc*100); 
   newTR.id = character.id;
    newTR.innerHTML = `
    <td><img src="${character.avatarUrl}" alt=""></td>
    <td>${character.name}</td>
    <td>${character.classes}</td>
    <td>${lvl}</td>
    <td>${character.xp}</td>
    <td><div class="progress-bar" ><div class="progress" style="width:${toNextLvl}%"></div></div></td>
    <td><i class="fas fa-cog" onclick="modify(this)"></i></td>
    <td><i class="fas fa-times"></i></td>
    `;

    addNode.appendChild(newTR);
};

/* ---- Lecture des entrees & appel fonction affichage ----*/
function readInputs(){
  if(validateInputs()){

    let newCharacter = {
      id : characters.length-1,
        name : nameInput.value,
        xp : xpInput.value,
        avatarUrl : avatarUrlInput.value,
        classes : classesReader()
    };
    
    add(newCharacter);
    print(newCharacter);
    clear();
  }
    
}

function classesReader(){
    let classString = classesInput.value;
    let classes = classString.split("\n");
   
   return classes;
}

function clear(){
  inputs.forEach(input =>input.value = "");
}

/* ---- Calculs et validations ---*/
const nameValidation = new RegExp(/^[A-Za-z\s]+$/);
const urlValidation = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&=]*)/gm);

function validateInputs(){
  let valid = true;
    if(!nameInput.value.match(nameValidation)){ //name
      valid = false;
      nameInput.classList.add("invalid");
    }else nameInput.classList.remove("invalid");
    
    if (isNaN(xpInput.value)||xpInput.value <=0) {//xp
      valid = false;
      xpInput.classList.add("invalid");
    } else xpInput.classList.remove("invalid");
    
    if(!avatarUrlInput.value.match(urlValidation)){ //url avatar
      valid = false;
      avatarUrlInput.classList.add("invalid");
    }else avatarUrlInput.classList.remove("invalid");
    return valid;
    
}
///Compte le niveau auquel le personnage est rendu par 
///rapport au nombre d'xp accumule 
///retourne le niveau et l'experience total necessaire au prochain niveau
function levelCount(xp){
let count = {
  lvl : 1,
  xpAcc : 0
}
 do{
  count.xpAcc+=count.lvl*1000;
  
  if (count.xpAcc>xp) return count;
  count.lvl++; 
 }while(count.xpAcc<=xp);
}

/*---- Modifier une ligne --- */

function modify(element){
 let id = element.parentElement.parentElement.id;
 let affectedChar = characters.find(element => element.id == id)
 
  nameInput.value = affectedChar.name;
  xpInput.value = affectedChar.xp;
  avatarUrlInput.value = affectedChar.avatarUrl;
  classesInput.value = "";
  affectedChar.classes.forEach((element)=>{classesInput.value+=`${element}\n`})
  submit.classList.add("hidden");
  modif.classList.remove("hidden");
  modif.value = id;
}
function commitChanges(){
  let id = this.value;
  if(validateInputs()){
    modifyCharacter(id);
    writeToLocalStorage();
    modifyRow(id);
    submit.classList.remove("hidden");
    modif.classList.add("hidden");
    clear();
  }
}
function modifyCharacter(id){
  characters[id].name = nameInput.value;
  characters[id].xp = xpInput.value;
  characters[id].avatarUrl = avatarUrlInput.value;
}
function modifyRow(id){
 trToModify = document.getElementById(id);
 let lvlCount = levelCount(characters[id].xp);
 let lvl = lvlCount.lvl;
 let toNextLvl = (characters[id].xp / lvlCount.xpAcc) * 100;
 trToModify.innerHTML = `
    <td><img src="${characters[id].avatarUrl}" alt=""></td>
    <td>${characters[id].name}</td>
    <td>${characters[id].classes}</td>
    <td>${lvl}</td>
    <td>${characters[id].xp}</td>
    <td><div class="progress-bar" ><div class="progress" style="width:${toNextLvl}%"></div></div></td>
    <td><i class="fas fa-cog" onclick="modify(this)"></i></td>
    <td><i class="fas fa-times"></i></td>
    `;
}

