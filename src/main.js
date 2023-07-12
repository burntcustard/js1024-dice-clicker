let score = 10000;

b.style.cssText = `
  display: inline-grid;
  font: 20px system-ui;
  grid: auto-flow dense / repeat(3, auto);
`;

const scoreSectionElement = document.createElement('fieldset');
const scoreSectionInner = document.createElement('div');
scoreSectionElement.append(scoreSectionInner);
b.append(scoreSectionElement);
scoreSectionElement.style.cssText = `
  display: inline-grid;
  grid-column: 1 / -1;
`;
scoreSectionInner.innerHTML = `•${score}`;

const diceSectionElement = document.createElement('fieldset');
const diceSectionLabel = document.createElement('legend');
const diceSectionInner = document.createElement('div');
diceSectionElement.append(diceSectionLabel, diceSectionInner);
b.append(diceSectionElement);
diceSectionInner.style.cssText = `
  display: inline-grid;
  font: 32px system-ui;
  grid: auto-flow dense 48px / repeat(6, 48px);
`;
diceSectionLabel.innerHTML = 'Dice';

const critterSectionElement = document.createElement('fieldset');
const critterSectionLabel = document.createElement('legend');
const critterSectionInner = document.createElement('div');
critterSectionElement.append(critterSectionLabel, critterSectionInner);
b.append(critterSectionElement);
critterSectionInner.style.cssText = `
  display: inline-grid;
  font: 32px system-ui;
  grid: auto-flow dense 32px / repeat(4, 48px);
`;
critterSectionLabel.innerHTML = 'Critters';

const shopSectionElement = document.createElement('fieldset');
const shopSectionLabel = document.createElement('legend');
const shopSectionInner = document.createElement('div');
shopSectionElement.append(shopSectionLabel, shopSectionInner);
b.append(shopSectionElement);
shopSectionInner.style.cssText = `
  display: inline-grid;
  font: 32px system-ui;
  grid: auto-flow dense 48px / repeat(1, 192px);
`;
shopSectionLabel.innerHTML = 'Shop';

// const diceAnimationFrames = ['◩', '⬘', '⬔', '⬗', '◪', '⬙', '⬕', '⬖']; // Unused because wonky sizes and takes up more space(?)
const diceFaces = [...'⚀⚁⚂⚃⚄⚅'];

const refreshShop = () => {
  for (let i = shopSectionInner.children.length; i--;) {
    shopSectionInner.children[i].disabled = score < shopSectionInner.children[i].cost;
  }
};

const buyItem = (item) => {
  score -= item.cost;
  scoreSectionInner.innerHTML = `•${score}`;
  item.cost = ~~(item.cost*1.2);
  item.costElement.innerHTML = `•${item.cost}`;
  refreshShop();
};

const initDiceType = (
  cost,
  separator,
  callback,
) => {
  const buyNewDice = document.createElement('button');
  buyNewDice.cost = cost;
  buyNewDice.style.cssText = `
    display: flex;
    font: 32px system-ui;
    padding: 2px 8px;
  `;

  buyNewDice.viewElement = document.createElement('div');
  buyNewDice.viewElement.innerHTML = separator ? `⚅${separator}⚅` : '⚅';
  buyNewDice.costElement = document.createElement('div');
  buyNewDice.costElement.style.cssText = `
    font: 16px monospace;
    margin-left: auto;
  `;
  buyNewDice.costElement.innerHTML = `•${buyNewDice.cost}`;
  buyNewDice.append(buyNewDice.viewElement, buyNewDice.costElement);
  shopSectionInner.append(buyNewDice);
  buyNewDice.new = () => {
    const newDice = document.createElement('button');
    newDice.style.cssText = `
      display: flex;
      align-items: center;
      font: 32px system-ui;
      padding: 2px 8px;
      position: relative;
      grid-column: span ${separator ? '2' : '1'};
    `;
    newDice.inner1 = document.createElement('div');
    newDice.inner1.innerHTML = '⚅';
    newDice.inner1.style.cssText = `
      display: inline-block;
      transition: .5s all;
    `;
    newDice.append(newDice.inner1);
    if (separator) {
      newDice.inner2 = document.createElement('div');
      newDice.inner2.innerHTML = separator;
      newDice.inner3 = document.createElement('div');
      newDice.inner3.innerHTML = '⚅';
      newDice.inner3.style.cssText = `
        display: inline-block;
        transition: .5s all;
      `;
      newDice.append(newDice.inner2, newDice.inner3);
    }
    newDice.overlay = document.createElement('div');
    // 'red' uses reused characters so is < '#000', and the actual color
    // doesn't matter because it's always an emoji with it's own colors
    newDice.overlay.style.cssText = `
      position: absolute;
      bottom: 0;
      right: 0;
      color: red;
      font: 20px monospace;
    `;
    newDice.append(newDice.overlay);
    newDice.onclick = () => {
      newDice.disabled = true;
      diceFaces.concat(diceFaces).forEach((_, i) => setTimeout(() => {
        newDice.result1 = ~~(Math.random() * 6); // It's 0-indexed
        newDice.inner1.innerHTML = diceFaces[newDice.result1];
        newDice.inner1.style.rotate = `${Math.random()}turn`;
      }, 300 * i));
      if (separator) {
        diceFaces.concat(diceFaces).forEach((_, i) => setTimeout(() => {
          newDice.result2 = ~~(Math.random() * 6); // It's 0-indexed
          newDice.inner3.innerHTML = diceFaces[newDice.result2];
          newDice.inner3.style.rotate = `${Math.random()}turn`;
        }, 300 * i));
      }
      setTimeout(() => {
        newDice.disabled = false;
        score += separator ? callback(newDice.result1 + 1, newDice.result2 + 1) : newDice.result1 + 1;
        scoreSectionInner.innerHTML = `•${score}`;
        newDice.overlay.innerHTML = '';
        refreshShop();
      }, 4000);
    }
    diceSectionInner.append(newDice);
  }
  buyNewDice.onclick = () => {
    buyItem(buyNewDice);
    buyNewDice.new();
  };

  return buyNewDice.new;
}

initDiceType(6)();


const buyNewRat = document.createElement('button');
buyNewRat.cost = 30;
buyNewRat.style.cssText = `
  display: flex;
  font: 32px system-ui;
  padding: 2px 8px;
`;
buyNewRat.viewElement = document.createElement('div');
buyNewRat.viewElement.innerHTML = '🐀';
buyNewRat.costElement = document.createElement('div');
buyNewRat.costElement.style.cssText = `
  font: 16px monospace;
  margin-left: auto;
`;
buyNewRat.costElement.innerHTML = `•${buyNewRat.cost}`;
buyNewRat.append(buyNewRat.viewElement, buyNewRat.costElement);
buyNewRat.onclick = () => {
  buyItem(buyNewRat);
  const newRat = document.createElement('div');
  newRat.style.cssText = `
    display: grid;
    font: 32px system-ui;
    place-items: center;
  `;
  newRat.innerHTML = '🐀';
  critterSectionInner.append(newRat);
  const nudgeDice = () => {
    const activeDice = [...diceSectionInner.children].filter(d => !d.disabled);
    if (activeDice.length) {
      const autoRollDice = activeDice[~~(Math.random() * activeDice.length)];
      autoRollDice.overlay.innerHTML = '🐀';
      autoRollDice.click();
      newRat.style.opacity = .5;
      setTimeout(() => {
        newRat.style.opacity = '';
      }, 4000);
    }
    setTimeout(nudgeDice, 8000);
  };
  setTimeout(nudgeDice, 800);
}
shopSectionInner.append(buyNewRat);

initDiceType(90, '+', (num1, num2) => num1 + num2);

initDiceType(360, '×', (num1, num2) => num1 * num2);

initDiceType(720, '^', (num1, num2) => num1 ** num2);

refreshShop();
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
