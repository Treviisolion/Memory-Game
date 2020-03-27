const tableSides = 6;
const tableSize = tableSides * tableSides;
const pairs = tableSize / 2;
const unFlippedCard = "star";

document.addEventListener("DOMContentLoaded", function () {

    let highscore = 0;
    const highScore = document.querySelector("#highscore");
    if (typeof (Storage) !== "undefined" && localStorage.getItem("highscore")) {
        highscore = parseInt(localStorage.getItem("highscore"), 10);
        highScore.innerText = "Best Score: " + highscore.toString();
    }

    const menu = document.querySelector("#menu");
    const game = document.querySelector("#game");
    const cards = document.querySelector("#cards");
    const score = document.querySelector("#score");
    const newGame = document.querySelector("#newgame");
    const resetScore = document.querySelector("#resetscore");
    const toMenu = document.querySelector("#tomenu");

    let cardsFlipped = 0;
    let pairsMatched = 0;
    let scoreValue = 0;
    let selectedCard;
    let card1;
    let card2;
    let icon1;
    let icon2;
    let value1;
    let value2;

    newGame.addEventListener("click", function () {

        menu.setAttribute("style", "display:none");
        game.setAttribute("style", "display:block");
        resetScore.setAttribute("style", "display:none");
        toMenu.setAttribute("style", "display:inline");

        cardsFlipped = 0;
        pairsMatched = 0;
        scoreValue = 0;
        selectedCard = null;
        card1 = null;
        card2 = null;
        icon1 = null;
        icon2 = null;
        value1 = null;
        value2 = null;
        score.innerText = "Moves: " + scoreValue.toString();

        let cardRows = cards.children;
        while (cardRows.length > 0) {
            let lastRow = cards.lastElementChild;
            let cardCols = lastRow.children;
            while (cardCols.length > 0) {
                let lastCard = lastRow.lastElementChild;
                lastCard.remove();
            }
            lastRow.remove();
        }

        for (let i = 0; i < tableSides; i++) {

            let newTr = document.createElement("tr");
            newTr.setAttribute("id", "row" + i.toString());

            for (let j = 0; j < tableSides; j++) {

                let newTd = document.createElement("td");
                newTd.setAttribute("class", "card col" + j.toString());
                newTd.setAttribute("data-flipped", "false");

                let unFlippedIcon = document.createElement("i");
                unFlippedIcon.setAttribute("class", "material-icons");
                unFlippedIcon.innerText = unFlippedCard;

                newTd.append(unFlippedIcon);
                newTr.append(newTd);
            }
            cards.append(newTr);
        }

        const cardOrder = [];
        for (let i = 0; i < tableSize; i++) {
            cardOrder.push(i);
        }

        for (let i = 1; i <= pairs; i++) {

            const position1 = cardOrder[Math.floor(Math.random() * cardOrder.length)];
            cardOrder.splice(cardOrder.findIndex(function (indexvalue) { return indexvalue === position1; }), 1);
            const rowid1 = "#row" + (Math.floor(position1 / tableSides)).toString();
            const colid1 = ".col" + (position1 % tableSides).toString();
            const row1 = cards.querySelector(rowid1);
            const col1 = row1.querySelector(colid1);

            const flippedValue1 = document.createElement("p");
            flippedValue1.setAttribute("style", "display:none");
            flippedValue1.innerText = i.toString();
            col1.append(flippedValue1);

            const position2 = cardOrder[Math.floor(Math.random() * cardOrder.length)];
            cardOrder.splice(cardOrder.findIndex(function (indexvalue) { return indexvalue === position2; }), 1);
            const rowid2 = "#row" + (Math.floor(position2 / tableSides)).toString();
            const colid2 = ".col" + (position2 % tableSides).toString();
            const row2 = cards.querySelector(rowid2);
            const col2 = row2.querySelector(colid2);

            const flippedValue2 = document.createElement("p");
            flippedValue2.setAttribute("style", "display:none");
            flippedValue2.innerText = i.toString();
            col2.append(flippedValue2);
        }

        cards.addEventListener("click", function (event) {
            if ((event.target.tagName === "TD" || event.target.tagName === "I") && cardsFlipped < 2) {

                if (event.target.tagName === "TD")
                    selectedCard = event.target;
                else
                    selectedCard = event.target.parentElement;

                if (selectedCard.getAttribute("data-flipped") === "false") {

                    const icon = selectedCard.querySelector("i");
                    icon.setAttribute("style", "display:none");
                    const value = selectedCard.querySelector("p");
                    value.setAttribute("style", "display:inline");

                    selectedCard.setAttribute("data-flipped", "true");

                    if (!card1) {
                        card1 = selectedCard;
                        icon1 = icon;
                        value1 = value;
                    }
                    else {
                        card2 = selectedCard;
                        icon2 = icon;
                        value2 = value;
                    }
                    cardsFlipped++;
                    scoreValue++;
                    score.innerText = "Moves: " + scoreValue.toString();

                    if (cardsFlipped === 2) {
                        if (value1.innerText !== value2.innerText)
                            setTimeout(function () {

                                icon1.setAttribute("style", "display:inline");
                                value1.setAttribute("style", "display:none");

                                card1.setAttribute("data-flipped", "false");

                                card1 = null;

                                icon2.setAttribute("style", "display:inline");
                                value2.setAttribute("style", "display:none");

                                card2.setAttribute("data-flipped", "false");

                                card2 = null;

                                cardsFlipped = 0;
                            }, 1000)
                        else {

                            card1 = null;
                            card2 = null;

                            cardsFlipped = 0;
                            pairsMatched++;

                            if (pairsMatched === pairs) {
                                if (highscore === 0 || highscore > scoreValue) {
                                    highscore = scoreValue;
                                    if (typeof (Storage) !== "undefined") {
                                        if (localStorage.getItem("highscore")) {
                                            localStorage.removeItem("highscore");
                                            localStorage.setItem("highscore", scoreValue.toString());
                                        }
                                        else {
                                            localStorage.setItem("highscore", scoreValue.toString());
                                        }
                                    }
                                    highScore.innerText = "Best Score: " + highscore.toString();
                                }
                            }
                        }
                    }
                }
            }
        })
    })

    resetScore.addEventListener("click", function () {
        highscore = 0;
        highScore.innerText = "Best Score: n/a";
        if (typeof (Storage) !== "undefined" && localStorage.getItem("highscore")) {
            localStorage.removeItem("highscore");
        }
    })

    toMenu.addEventListener("click", function () {
        menu.setAttribute("style", "display:block");
        game.setAttribute("style", "display:none");
        resetScore.setAttribute("style", "display:inline");
        toMenu.setAttribute("style", "display:none");
    })
})

function clearHighScore() {
    localStorage.removeItem("highscore");
}