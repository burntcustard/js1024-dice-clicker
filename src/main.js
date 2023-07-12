let score = 0;

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
  [...shopSectionInner.children].map((item) => item.disabled = score < item.cost);
};

const addNewShopItem = (icon, cost, buyCallback) => {
  const item = document.createElement('button');

  item.cost = cost;
  item.style.cssText = `
    display: flex;
    font: 32px system-ui;
    padding: 2px 8px;
    align-items: end;
  `;
  item.viewElement = document.createElement('div');
  item.viewElement.innerHTML = icon;
  item.costElement = document.createElement('div');
  item.costElement.style.cssText = `
    font: 16px monospace;
    margin-left: auto;
  `;
  item.costElement.innerHTML = `•${item.cost}`;
  item.append(item.viewElement, item.costElement);

  item.onclick = () => {
    score -= item.cost;
    scoreSectionInner.innerHTML = `•${score}`;
    item.cost = ~~(item.cost*1.2);
    item.costElement.innerHTML = `•${item.cost}`;
    refreshShop();
    buyCallback();
  }

  shopSectionInner.append(item);
};

const initDiceType = (
  cost,
  separator,
  diceCallback,
) => {
  const addNewDice = () => {
    const newDice = document.createElement('button');

      // position: sticky is used in place of relative but saves 2B
      // separator?.length + 1 is 1 or 2 (false + 1 = 1)
    newDice.style.cssText = `
      display: flex;
      align-items: center;
      font: 32px system-ui;
      padding: 2px 8px;
      position: sticky;
      grid-column: span ${separator?.length + 1};
    `;
    newDice.inner1 = document.createElement('div');
    newDice.inner1.innerHTML = '⚅';
    newDice.inner1.style.cssText = `
      display: inline-grid;
      transition: .5s all;
    `;
    newDice.append(newDice.inner1);

    if (separator) {
      newDice.inner2 = document.createElement('div');
      newDice.inner2.innerHTML = separator;
      newDice.inner3 = document.createElement('div');
      newDice.inner3.innerHTML = '⚅';
      newDice.inner3.style.cssText = `
        display: inline-grid;
        transition: .5s all;
      `;
      newDice.append(newDice.inner2, newDice.inner3);
    }

    newDice.overlay = document.createElement('div');
    // 'red' uses reused characters so is < '#000', and the actual color
    // doesn't matter because it's always an emoji with it's own colors
    newDice.overlay.style.cssText = `
      color: red;
      position: absolute;
      inset: auto 0 0 auto;
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
        score += separator ? diceCallback(newDice.result1 + 1, newDice.result2 + 1) : newDice.result1 + 1;
        scoreSectionInner.innerHTML = `•${score}`;
        newDice.overlay.innerHTML = '';
        refreshShop();
      }, 4000);
    }
    diceSectionInner.append(newDice);
  };

  addNewShopItem(
    separator ? `⚅${separator}⚅` : '⚅',
    cost,
    addNewDice
  );

  return addNewDice;
};

initDiceType(6)();

addNewShopItem('🐀', 24, () => {
  const newRat = document.createElement('div');

  newRat.style.cssText = `
    display: inline-grid;
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
});

initDiceType(60, '+', (num1, num2) => num1 + num2);

initDiceType(360, '×', (num1, num2) => num1 * num2);

initDiceType(1080, '^', (num1, num2) => num1 ** num2);

refreshShop();
