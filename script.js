//initializing stats
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// bringing elements over from html
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// available weapons in store
const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

// monsters in the game
const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];

// locations the player can be in
const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button function": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"store\".",
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button function": [buyHealth, buyWeapon, goTown],
        text: "Go to town square.",
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "button function": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters"
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button function": [attack, dodge, goTown],
        text: "You are fighting a monster!"
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button function": [goTown, goTown, easterEgg],
        text: "The monster screams, \"Arg!\", as it dies. You gain xp and find gold."
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button function": [restart, restart, restart],
        text: "You died."
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button function": [restart, restart, restart],
        text: "You defeated the dragon! YOU WIN THE GAME!"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square"],
        "button function": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number from above. Ten numbers will be randomly chosen between 0 and 10. If the number you chose matches the random number, you win!"
    },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
    monsterStats.style.display = "none";

    text.innerText = location.text;
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];

    button1.onclick = location["button function"][0];
    button2.onclick = location["button function"][1];
    button3.onclick = location["button function"][2];
}

function goTown() {
    update(locations[0]);
}

// store logic
function goStore() {
    update(locations[1]);
}

function buyHealth() {

    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You do not have enough gold to buy health."
    }

}

function buyWeapon() {

    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon += 1;
            goldText.innerText = gold;

            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory + ".";
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }

}

function sellWeapon() {

    if (inventory.length > 1) {
        gold += 15;
        gold.innerText = gold;

        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory + ".";
    } else {
        text.innerText = "Don't sell your only weapon!"
    }

}

// cave logic
function goCave() {
    update(locations[2]);
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";

    if (isMonsterHit()) {
        health -= getMonsterAttackValue(monsters[fighting].level);
    } else {
        text.innerText += " You miss."
    }

    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;

    if (health <= 0) {
        health = 0;
        healthText.innerText = health;
        lose();
    } else if (monsterHealth <= 0) {
        fighting === 2 ? winGame() : defeatMonster();
    }

    if (Math.random() <= 0.1 && inventory.length > 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentWeapon -= 1;
    }

}

function getMonsterAttackValue(monsterLevel) {
    let hit = (monsterLevel * 5) - (Math.floor(Math.random() * xp));

    return hit;
}

function isMonsterHit() {
    return Math.random() > 0.2 || health < 20;
}

function dodge() {
    text.innerText = "You dodge the attack from " + monsters[fighting].name + ".";
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;

    update(locations[4]);
}

// bonus guessing game hidden behind a return to town button
function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    let numbers = [];

    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(guess) !== -1) {
        text.innerText += "Right! You win 20 gold!";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!";
        health -= 10;
        healthText.innerText = health;

        if (health <= 0) {
            health = 0;
            healthText.innerText = health;
            lose();
        }
    }
}

//game over logic
function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    xpText.innerText = xp;
    health = 100;
    healthText.innerText = health;
    gold = 50;
    goldText.innerText = gold;
    currentWeapon = 0;
    inventory = ["stick"];
    goTown();
}