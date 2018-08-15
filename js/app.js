/*
 * Globals
*/

const cards = document.querySelectorAll('.card');
const deck = document.querySelector('.deck');
const movesText = document.getElementById('moves');
const repeat = document.querySelector('.fa-repeat');
const stars = document.querySelectorAll('.stars li');
const timer = document.getElementById('timer');

let matched = [];
let moveNum = 0;
let openCards = [];
let starCount = 3;
let time = 0;
let timerID;
let timerOff = true;

/*
 * Shuffle and Restart Game
*/

shuffleDeck();

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    };
    return array;
};

function shuffleDeck(){
  const cardShuffling = Array.from(document.querySelectorAll('.card'))
  const shuffled = shuffle(cardShuffling);
  for (card of shuffled) {
    deck.appendChild(card);
  };
  openCards = [];
};

repeat.addEventListener('click', event => {
  resetGame();
});

function resetGame() {
  if (openCards.length == 1){
    toggleCards(openCards[0]);
    openCards = [];
  }else{
    for (match of matched) {
      match.classList.toggle('match');
      match.classList.toggle('show');
      match.classList.toggle('open');
      matched = [];
    };
  };
  shuffleDeck();
  moveNum = 0;
  movesText.innerHTML = moveNum;
  time = 0;
  timerOff = true;
};

/*
 * Moves and Stars
*/

function addMove() {
  moveNum++;
  movesText.innerHTML = moveNum;
};

function hideStar() {
  for (star of stars){
    if (star.style.display !== 'none'){
      star.style.display = 'none';
      starCount--;
      console.log(starCount);
      break;
    };
  };
};

function checkScore() {
  if (moveNum === 48){
    hideStar();
  }else if(moveNum === 32) {
    hideStar();
  };
};

/*
 * Timer
*/

function startTimer() {
  timerID = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
};

function displayTime() {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  if (sec < 10) {
    timer.innerHTML = `${min}:0${sec}`;
  } else {
    timer.innerHTML = `${min}:${sec}`;
  };
};

function stopTimer() {
  clearInterval(timerID);
};

/*
 * open, close, and match cards
 */

deck.addEventListener('click', event => {
  const clickTarget = event.target; //selects the element that triggered the event
  if (clickValid(clickTarget)){
    toggleCards(clickTarget);
    addCards(clickTarget);
    if (timerOff) {
      startTimer();
      timerOff = false;
    };
    if (openCards.length === 2){
      checkMatch(clickTarget);
      checkScore();
    };
  };
});

function clickValid(clickTarget) {
  return(
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    openCards.length < 2 &&
    !openCards.includes(clickTarget)
  );
};

function toggleCards(clickTarget){
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
};

function addCards(clickTarget){
    openCards.push(clickTarget);
    addMove();
};

function checkMatch(){
  if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className){
    openCards[0].classList.toggle('match');
    openCards[1].classList.toggle('match');
    matched.push(...openCards);
    openCards = [];
    if (matched.length === 16) {
      toggleModal();
      writeModal();
    };
  } else {
    setTimeout(() => {
      toggleCards(openCards[0]);
      toggleCards(openCards[1]);
      openCards = [];
    }, 600);
  };
};

/*
 * Modal Pop-up when game ends
 */

function toggleModal() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
  stopTimer();
};

function writeModal() {
  const timeStat = document.querySelector('.modal_time');
  const finalTime = timer.innerHTML;
  const movesStat = document.querySelector('.modal_moves');
  movesStat.innerHTML = `Moves Taken: ${moveNum}`;
  timeStat.innerHTML = `Time Spent: ${finalTime}`;
  starModal();
};

function starModal() {
  let starScore = [].slice.call(document.querySelectorAll('.modal_stars'));
  for (s = 3; s > starCount; s--){
    starScore[0].style.display ='none';
    let firstStar = starScore.shift();
    starScore.splice(2, 0, firstStar);
  };
};

document.querySelector('.modal_cancel').addEventListener('click', () => {
  toggleModal();
});

document.querySelector('.modal_replay').addEventListener('click', () => {
  resetGame();
  toggleModal();
});

document.querySelector('.modal_close').addEventListener('click', () => {
  toggleModal();
});
