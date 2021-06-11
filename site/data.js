let characterStorage = window.localStorage;

let data = {
  nextId: 5,
  characters: [
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
  ],
};

//writeToLocalStorage();
/*---- verification de premiere utilisation ----*/
if (characterStorage.getItem("data") == null) {
  writeToLocalStorage();
} else {
  data = JSON.parse(characterStorage.getItem("data"));
}

function writeToLocalStorage() {
  let dataSerialized = JSON.stringify(data);
  characterStorage.setItem("data", dataSerialized);
}

let cache = {
  nom:null,
  xp:null,
  avatar:null,
  classes:null,
  bouton:null,
  modifMode : false,
  orderBy: 0,
  disable: false
}
function writeCache(){
  cache.name = nameInput.value;
  cache.xp = xpInput.value;
  cache.avatar = avatarUrlInput.value;
  cache.classes = classesInput.value;
  cache.bouton = modif.value;
  let cacheString = JSON.stringify(cache);
  characterStorage.setItem("cache",cacheString);
}



function loadCache(){
  
  cacheString = characterStorage.getItem("cache");
  if(cacheString != null){

    cache = JSON.parse(cacheString);
    nameInput.value = cache.name;
    xpInput.value = cache.xp;
    avatarUrlInput.value = cache.avatar;
    classesInput.value = cache.classes;
    modif.value = cache.bouton;
   
  }
}

function resetDb(){
  characterStorage.removeItem("data");
  characterStorage.removeItem("cache");
  location.reload();
}
