const readline = require("readline");

const HANGMAN_DRAWINGS = [`
  +---+
  |   |
      |
      |
      |
      |
=========`, `
  +---+
  |   |
  O   |
      |
      |
      |
=========`, `
  +---+
  |   |
  O   |
  |   |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`, `
  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`, `
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`];

const WORDS_LIST = ["bell", "santa", "star", "time", "bear", "box", "chocolate", "tree", "kitty", "man", "night", "seed", "dog",
    "father", "garden", "door", "hand", "letter", "bed", "chicken", "story", "way", "farm", "friend", "ground", "name", "baby", "thing",
    "top", "nest", "paper", "song", "apple", "cake", "water", "back", "birth", "bread", "brother", "christmas", "day", "boat", "snow", "sun",
    "soy", "car", "egg", "head", "book", "boy", "doll", "rabbit", "stick", "window", "house", "ring", "street", "child", "duck", "fish",
    "money", "bath", "chair", "eye", "wood", "morning", "rain", "shoe", "table", "picture", "school", "smile", "coat", "cow", "goodbye",
    "grass", "leg", "robin", "girl", "hill", "milk", "sheep", "sister", "watch", "ball", "squirrel", "wind", "fire", "floor", "horse",
    "home", "mother", "party", "flower", "game", "pig", "bird", "vat", "corn", "foot"
];
const WORDS_LIST_HARD = ["abruptly", "absurd", "abyss", "affix", "askew", "avenue", "awkward", "axiom", "azure", "bagpipes", "bandwagon",
    "banjo", "bayou", "beekeeper", "bikini", "blitz", "blizzard", "boggle", "bookworm", "boxcar", "boxful", "buckaroo", "buffalo",
    "buffoon", "buxom", "buzzard", "buzzing", "buzzwords", "caliph", "cobweb", "cockiness", "croquet", "crypt", "curacao", "cycle",
    "daiquiri", "dirndl", "disavow", "dizzying", "duplex", "dwarves", "embezzle", "equip", "espionage", "euouae", "exodus", "faking",
    "fishhook", "fixable", "fjord", "flapjack", "flopping", "fluffiness", "flyby", "foxglove", "frazzled", "frizzled", "fuchsia",
    "funny", "gabby", "galaxy", "galvanize", "gazebo", "giaour", "gizmo", "glowworm", "glyph", "gnarly", "gnostic", "gossip",
    "grogginess", "haiku", "haphazard", "hyphen", "iatrogenic", "icebox", "injury", "ivory", "ivy", "jackpot", "jaundice",
    "jawbreaker", "jaywalk", "jazziest", "jazzy", "jelly", "jigsaw", "jinx", "jiujitsu", "jockey", "jogging", "joking",
    "jovial", "joyful", "juicy", "jukebox", "jumbo", "kayak", "kazoo", "keyhole", "khaki", "kilobyte", "kiosk", "kitsch",
    "kiwifruit", "klutz", "knapsack", "larynx", "lengths", "lucky", "luxury", "lymph", "marquis", "matrix", "megahertz",
    "microwave", "mnemonic", "mystify", "naphtha", "nightclub", "nowadays", "numbskull", "nymph", "onyx", "ovary", "oxidize",
    "oxygen", "pajama", "peekaboo", "phlegm", "pixel", "pizazz", "pneumonia", "polka", "pshaw", "psyche", "puppy", "puzzling",
    "quartz", "queue", "quips", "quixotic", "quiz", "quizzes", "quorum", "razzmatazz", "rhubarb", "rhythm", "rickshaw", "schnapps",
    "scratch", "shiv", "snazzy", "sphinx", "spritz", "squawk", "staff", "strength", "strengths", "stretch", "stronghold", "stymied",
    "subway", "swivel", "syndrome", "thriftless", "thumbscrew", "topaz", "transcript", "transgress", "transplant", "triphthong",
    "twelfth", "twelfths", "unknown"
];

let isLetter = (str) => str.length === 1 && str.match(/[a-z]/i);


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getInput() {
    return new Promise((resolve, reject) => {
        rl.question("Write a letter: ", inputLetter => {
            if (!isLetter(inputLetter))
                return reject(new Error("Invalid input! Write a letter only!"));

            resolve(inputLetter);
        });
    });
}

let game = {
    state: "playing",
    word: "",
    guessedLetters: [],
    chances: 5,
    difficulty: "medium", // easy, medium or hard
    wordListObject: {
        easy: WORDS_LIST,
        medium: WORDS_LIST,
        hard: WORDS_LIST_HARD
    }
};

function printHangman() {
    switch (game.chances) {
        case 5:
            console.log(HANGMAN_DRAWINGS[0]);
            break;
        case 4:
            console.log(HANGMAN_DRAWINGS[1]);
            break;
        case 3:
            console.log(HANGMAN_DRAWINGS[2]);
            break;
        case 2:
            console.log(HANGMAN_DRAWINGS[3]);
            break;
        case 1:
            console.log(HANGMAN_DRAWINGS[4]);
            break;
        case 0:
            console.log(HANGMAN_DRAWINGS[5]);
            break;
        case -1:
            console.log(HANGMAN_DRAWINGS[6]);
            break;
    }
}

function numberOfMatches(input) {
    const splitString = game.word.split(input);
    const count = splitString.length - 1;
    return count;
}

let gameNotFinished = () => game.state === "playing";

function checkWinning() {
    const chars = game.word.split(""); // convert the string to an array of characters
    return chars.every(char => game.guessedLetters.includes(char)); // check if every character is in the array
}

function checkLetterMatching(matchNumber, input) {
    if (matchNumber > 0) {
        if (game.guessedLetters.includes(input)) {
            console.log("You have already picked this letter!");
        } else {
            game.guessedLetters.push(input);
        }
    } else {
        game.chances--;
        console.log(`Wrong! You got ${game.chances} left`);
    }
}

function updateState(input) {
    if (game.state === "playing" && game.chances > 0) {
        const matchNumber = numberOfMatches(input);
        checkLetterMatching(matchNumber, input);
    } else if (game.chances === 0) {
        game.chances = -1;
        game.state = "finished";
    }
}

function renderGame() {
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);

    let str = [];

    for (let i = 0; i < game.word.length; i++) {
        if (game.guessedLetters.includes(game.word[i])) {
            str.push(game.word[i]);
        } else {
            str.push("_");
        }
    }

    printHangman();

    console.log(str.join(" "));
}

function checkParam(paramPair) {
    if (paramPair[0] !== "difficulty") {
        throw "Invalid argument! you should write \'difficulty\'";
    }
    if (!(paramPair[1] in game.wordListObject)) {
        throw "Error in writing difficulty! you should write: easy/medium/hard";
    }
}

function updateGameDifficultyAndGenerateWord() {
    const args = process.argv.slice(2); // remove the first two elements from process.argv => node.js + filepath
    if (args.length > 0) {
        for (arg of args) {
            let paramPair = arg.split("=");
            checkParam(paramPair);
            game[paramPair[0]] = paramPair[1];
        }
    }

    game.word = game.wordListObject[game.difficulty][Math.floor(Math.random() * game.wordListObject[game.difficulty].length)];
    if (game.difficulty === "easy") {
        const randomLetter = game.word.charAt(Math.floor(Math.random() * game.word.length));
        game.guessedLetters.push(randomLetter);
    }
}

function clean() {
    rl.close();
}

async function main() {
    updateGameDifficultyAndGenerateWord()

    while (gameNotFinished()) {
        renderGame();

        let input;
        try {
            input = await getInput();
        } catch (e) {
            console.log(e.message);
            continue;
        }

        updateState(input);

        if (checkWinning()) {
            game.state = "finished";
            console.log("You have won!");
        }
    }

    if (game.chances === -1) {
        renderGame();
        console.log(`You have lost!`);
    }

    console.log(`The word was: ${game.word}`);
};

main().finally(clean);