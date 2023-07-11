let score = 0;

b.innerHTML = `<style>
  #b {
    font: 2em system-ui;
    display: inline-grid;
    grid: auto-flow dense / repeat(3, auto);
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

const scoreSectionElement = document.createElement('fieldset');
const scoreSectionLabel = document.createElement('legend');
const scoreSectionInner = document.createElement('code');
scoreSectionElement.append(scoreSectionLabel, scoreSectionInner);
b.append(scoreSectionElement);
scoreSectionElement.style.cssText = `
  display: grid;
  grid: auto-flow dense / repeat(6, 1fr);
  grid-column: 1 / -1;
`;
scoreSectionLabel.innerHTML = 'Score';
scoreSectionInner.innerHTML = score;

const diceSectionElement = document.createElement('fieldset');
const diceSectionLabel = document.createElement('legend');
const diceSectionInner = document.createElement('div');
diceSectionElement.append(diceSectionLabel, diceSectionInner);
b.append(diceSectionElement);
diceSectionInner.style.cssText = `

  display: grid;
  grid: auto-flow dense / repeat(6, 1fr);
`;
diceSectionLabel.innerHTML = 'Dice';

const critterSectionElement = document.createElement('fieldset');
const critterSectionLabel = document.createElement('legend');
const critterSectionInner = document.createElement('div');
critterSectionElement.append(critterSectionLabel, critterSectionInner);
b.append(critterSectionElement);
critterSectionInner.style.cssText = `
  display: grid;
  grid: auto-flow dense / repeat(4, 2ch);
`;
critterSectionLabel.innerHTML = 'Critters';

const shopSectionElement = document.createElement('fieldset');
const shopSectionLabel = document.createElement('legend');
const shopSectionInner = document.createElement('div');
shopSectionElement.append(shopSectionLabel, shopSectionInner);
b.append(shopSectionElement);
shopSectionInner.style.cssText = `
  width: 180px;
  display: grid;
`;
shopSectionLabel.innerHTML = 'Shop';

// const diceAnimationFrames = ['◩', '⬘', '⬔', '⬗', '◪', '⬙', '⬕', '⬖']; // Unused because wonky sizes and takes up more space(?)
const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const addNewDice = () => {
  const newDice = document.createElement('button');
  newDice.inner = document.createElement('div');
  newDice.inner.innerHTML = '⚅';
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
      scoreSectionInner.innerHTML = score;
      newDice.overlay.innerHTML = '';

      for (let i = shopSectionInner.children.length; i--;) {
        shopSectionInner.children[i].disabled = score < shopSectionInner.children[i].cost;
      }
    }, 4000);
  }
  diceSectionInner.append(newDice);
};

const buyNewDice = document.createElement('button');
buyNewDice.cost = 6;
buyNewDice.innerHTML = `⚅ (${buyNewDice.cost})`;
buyNewDice.style.cssText = `

`;
buyNewDice.onclick = () => {
  score -= buyNewDice.cost;
  scoreSectionInner.innerHTML = score;
  buyNewDice.cost = ~~(buyNewDice.cost**1.1);
  buyNewDice.innerHTML = `⚅ (${buyNewDice.cost})`;
  for (let i = shopSectionInner.children.length; i--;) {
    shopSectionInner.children[i].disabled = score < shopSectionInner.children[i].cost;
  }
  addNewDice();
}
shopSectionInner.append(buyNewDice);

const addNewPlusDice = () => {
  const newPlusDice = document.createElement('button');
  newPlusDice.style.cssText = `
    grid-column: span 2;
  `;
  newPlusDice.inner = document.createElement('div');
  newPlusDice.inner1 = document.createElement('div');
  newPlusDice.inner1.innerHTML = '⚅';
  newPlusDice.inner1.style.display = 'inline-block';
  newPlusDice.inner2 = document.createElement('div');
  newPlusDice.inner2.innerHTML = ' + ';
  newPlusDice.inner2.style.display = 'inline-block';
  newPlusDice.inner3 = document.createElement('div');
  newPlusDice.inner3.innerHTML = '⚅';
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
      scoreSectionInner.innerHTML = score;
      newPlusDice.overlay.innerHTML = '';

      for (let i = shopSectionInner.children.length; i--;) {
        shopSectionInner.children[i].disabled = score < shopSectionInner.children[i].cost;
      }
    }, 4000);
  }
  diceSectionInner.append(newPlusDice);
};

const buyNewPlusDice = document.createElement('button');
buyNewPlusDice.cost = 30;
buyNewPlusDice.style.cssText = `
  display: flex;
  justify-content: space-between;
  padding: 2px 8px;
`;
buyNewPlusDice.viewElement = document.createElement('div');
buyNewPlusDice.viewElement.innerHTML = '⚅+⚅';
buyNewPlusDice.costElement = document.createElement('div');
buyNewPlusDice.costElement.style.cssText = `
  font: 1em monospace;
`;
buyNewPlusDice.costElement.innerHTML = buyNewPlusDice.cost;
buyNewPlusDice.append (buyNewPlusDice.viewElement, buyNewPlusDice.costElement);
buyNewPlusDice.onclick = () => {
  score -= buyNewPlusDice.cost;
  scoreSectionInner.innerHTML = score;
  buyNewPlusDice.cost = ~~(buyNewPlusDice.cost**1.1);
  buyNewPlusDice.costElement.innerHTML = buyNewPlusDice.cost;
  for (let i = shopSectionInner.children.length; i--;) {
    shopSectionInner.children[i].disabled = score < shopSectionInner.children[i].cost;
  }
  addNewPlusDice();
}
shopSectionInner.append(buyNewPlusDice);

const buyNewRat = document.createElement('button');
buyNewRat.cost = 120;
buyNewRat.innerHTML = `🐀 (${buyNewRat.cost})`;
buyNewRat.onclick = () => {
  score -= buyNewRat.cost;
  scoreSectionInner.innerHTML = score;
  buyNewRat.cost = ~~(buyNewRat.cost**1.1);
  buyNewRat.innerHTML = `🐀 (${buyNewRat.cost})`;
  for (let i = shopSectionInner.children.length; i--;) {
    shopSectionInner.children[i].disabled = score < shopSectionInner.children[i].cost;
  }
  const newRat = document.createElement('div');
  newRat.innerHTML = '🐀';
  critterSectionInner.append(newRat);
  setInterval(() => {
    const activeDice = diceSectionInner.querySelectorAll('button:not([disabled])');
    if (activeDice) {
      const autoRollDice = activeDice[~~(Math.random() * activeDice.length)];
      autoRollDice.overlay.innerHTML = '🐀';
      autoRollDice.click();
      newRat.style.opacity = .5;
      setTimeout(() => {
        newRat.style.opacity = '';
      }, 4000);
    }
  }, 8000);
}
shopSectionInner.append(buyNewRat);

for (let i = shopSectionInner.children.length; i--;) {
  shopSectionInner.children[i].disabled = score < shopSectionInner.children[i].cost;
}

addNewDice();


// const testButton1 = document.createElement('button');
// testButton1.innerHTML = '⚀🐀'
// testButton1.style.font = '2em system-ui';
// b.append(testButton1);

// const testButton2 = document.createElement('button');
// testButton2.innerHTML = '⚁ + ⚁'
// testButton2.style.font = '2em system-ui';
// b.append(testButton2);

// const testButton3 = document.createElement('button');
// testButton3.innerHTML = '⚂ × ⚂'
// testButton3.style.font = '2em system-ui';
// b.append(testButton3);

// const testButton4 = document.createElement('button');
// testButton4.innerHTML = '⚃ ** ⚃'
// testButton4.style.font = '2em system-ui';
// b.append(testButton4);

// const testButton5 = document.createElement('button');
// testButton5.innerHTML = '⚄²'
// testButton5.style.font = '2em system-ui';
// b.append(testButton5);

// const testButton6 = document.createElement('button');
// testButton6.innerHTML = '⚅³'
// testButton6.style.font = '2em system-ui';
// b.append(testButton6);
