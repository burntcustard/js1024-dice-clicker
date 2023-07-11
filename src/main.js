let score = 50;

b.innerHTML = `<style>
  #b {
    font: 2em system-ui;
    display: flex;
  }

  button {
    font: 1em system-ui;
    padding: 2px 6px;
    position: relative;
  }

  button * {
    transition: .5s all;
  }
</style>`;

const leftElement = document.createElement('p');

const scoreElement = document.createElement('pre');
scoreElement.innerHTML = score;

const diceContainer = document.createElement('fieldset');
diceContainer.style.width = '200px';
leftElement.append(scoreElement, diceContainer);

const centerElement = document.createElement('fieldset');

const shopElement = document.createElement('fieldset');

const shopLabel = document.createElement('legend');
shopLabel.innerText = 'Shop';
shopElement.append(shopLabel);

// const diceAnimationFrames = ['◩', '⬘', '⬔', '⬗', '◪', '⬙', '⬕', '⬖']; // Unused because wonky sizes and takes up more space(?)
const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const addNewDice = () => {
  const newDice = document.createElement('button');
  newDice.inner = document.createElement('div');
  newDice.inner.innerText = '⚅';
  newDice.overlay = document.createElement('small');
  newDice.overlay.style.cssText = `position: absolute; bottom: 0; right: 0;`;
  newDice.append(newDice.inner, newDice.overlay);
  newDice.onclick = () => {
    newDice.disabled = true;
    diceFaces.concat(diceFaces).forEach((_, i) => setTimeout(() => {
      newDice.result = ~~(Math.random() * 6); // It's 0-indexed
      newDice.inner.innerHTML = diceFaces[newDice.result];
      newDice.inner.style.rotate = `${Math.random()}turn`;
    }, 300 * i));
    setTimeout(() => {
      newDice.disabled = false;
      score += newDice.result + 1;
      scoreElement.innerText = score;
      newDice.overlay.innerText = '';

      for (let i = shopElement.children.length; i--;) {
        shopElement.children[i].disabled = score < shopElement.children[i].cost;
      }
    }, 4000);
  }
  diceContainer.append(newDice);
};

const buyNewDice = document.createElement('button');
buyNewDice.cost = 6;
buyNewDice.innerHTML = `⚅ (${buyNewDice.cost})`;
buyNewDice.onclick = () => {
  score -= buyNewDice.cost;
  scoreElement.innerHTML = score;
  buyNewDice.cost = ~~(buyNewDice.cost**1.1);
  buyNewDice.innerHTML = `⚅ (${buyNewDice.cost})`;
  for (let i = shopElement.children.length; i--;) {
    shopElement.children[i].disabled = score < shopElement.children[i].cost;
  }
  addNewDice();
}
shopElement.append(buyNewDice);

const addNewPlusDice = () => {
  const newPlusDice = document.createElement('button');
  newPlusDice.inner = document.createElement('div');
  newPlusDice.inner1 = document.createElement('div');
  newPlusDice.inner1.innerText = '⚅';
  newPlusDice.inner1.style.display = 'inline-block';
  newPlusDice.inner2 = document.createElement('div');
  newPlusDice.inner2.innerText = ' + ';
  newPlusDice.inner2.style.display = 'inline-block';
  newPlusDice.inner3 = document.createElement('div');
  newPlusDice.inner3.innerText = '⚅';
  newPlusDice.inner3.style.display = 'inline-block';
  newPlusDice.inner.append(newPlusDice.inner1, newPlusDice.inner2, newPlusDice.inner3);
  newPlusDice.overlay = document.createElement('small');
  newPlusDice.overlay.style.cssText = `position: absolute; bottom: 0; right: 0;`;
  newPlusDice.append(newPlusDice.inner, newPlusDice.overlay);
  newPlusDice.onclick = () => {
    newPlusDice.disabled = true;
    diceFaces.concat(diceFaces).forEach((_, i) => setTimeout(() => {
      newPlusDice.result1 = ~~(Math.random() * 6); // It's 0-indexed
      newPlusDice.inner1.innerHTML = diceFaces[newPlusDice.result1];
      newPlusDice.inner1.style.rotate = `${Math.random()}turn`;
    }, 300 * i));
    diceFaces.concat(diceFaces).forEach((_, i) => setTimeout(() => {
      newPlusDice.result2 = ~~(Math.random() * 6); // It's 0-indexed
      newPlusDice.inner3.innerHTML = diceFaces[newPlusDice.result2];
      newPlusDice.inner3.style.rotate = `${Math.random()}turn`;
    }, 300 * i));
    setTimeout(() => {
      newPlusDice.disabled = false;
      score += newPlusDice.result1 + 1 + newPlusDice.result2 + 1;
      scoreElement.innerText = score;
      newPlusDice.overlay.innerText = '';

      for (let i = shopElement.children.length; i--;) {
        shopElement.children[i].disabled = score < shopElement.children[i].cost;
      }
    }, 4000);
  }
  diceContainer.append(newPlusDice);
};

const buyNewPlusDice = document.createElement('button');
buyNewPlusDice.cost = 6;
buyNewPlusDice.innerHTML = `⚅+⚅ (${buyNewPlusDice.cost})`;
buyNewPlusDice.onclick = () => {
  score -= buyNewPlusDice.cost;
  scoreElement.innerHTML = score;
  buyNewPlusDice.cost = ~~(buyNewPlusDice.cost**1.1);
  buyNewPlusDice.innerHTML = `⚅ + ⚅ (${buyNewPlusDice.cost})`;
  for (let i = shopElement.children.length; i--;) {
    shopElement.children[i].disabled = score < shopElement.children[i].cost;
  }
  addNewPlusDice();
}
shopElement.append(buyNewPlusDice);

const buyNewRat = document.createElement('button');
buyNewRat.cost = 5;
buyNewRat.innerHTML = `🐀 (${buyNewRat.cost})`;
buyNewRat.onclick = () => {
  score -= buyNewRat.cost;
  scoreElement.innerHTML = score;
  buyNewRat.cost = ~~(buyNewRat.cost**1.1);
  buyNewRat.innerHTML = `🐀 (${buyNewRat.cost})`;
  for (let i = shopElement.children.length; i--;) {
    shopElement.children[i].disabled = score < shopElement.children[i].cost;
  }
  const newRat = document.createElement('div');
  newRat.innerHTML = '🐀';
  centerElement.append(newRat);
  setInterval(() => {
    const activeDice = diceContainer.querySelectorAll('button:not([disabled])');
    const autoRollDice = activeDice[~~(Math.random() * activeDice.length)];
    autoRollDice.overlay.innerText = '🐀';
    autoRollDice.click();
    newRat.style.opacity = .5;
    setTimeout(() => {
      newRat.style.opacity = '';
    }, 4000);
  }, 5000);
}
shopElement.append(buyNewRat);

for (let i = shopElement.children.length; i--;) {
  shopElement.children[i].disabled = score < shopElement.children[i].cost;
}

addNewDice();

b.append(leftElement, centerElement, shopElement);

// const testButton1 = document.createElement('button');
// testButton1.innerText = '⚀🐀'
// testButton1.style.font = '2em system-ui';
// b.append(testButton1);

// const testButton2 = document.createElement('button');
// testButton2.innerText = '⚁ + ⚁'
// testButton2.style.font = '2em system-ui';
// b.append(testButton2);

// const testButton3 = document.createElement('button');
// testButton3.innerText = '⚂ × ⚂'
// testButton3.style.font = '2em system-ui';
// b.append(testButton3);

// const testButton4 = document.createElement('button');
// testButton4.innerText = '⚃ ** ⚃'
// testButton4.style.font = '2em system-ui';
// b.append(testButton4);

// const testButton5 = document.createElement('button');
// testButton5.innerText = '⚄²'
// testButton5.style.font = '2em system-ui';
// b.append(testButton5);

// const testButton6 = document.createElement('button');
// testButton6.innerText = '⚅³'
// testButton6.style.font = '2em system-ui';
// b.append(testButton6);
