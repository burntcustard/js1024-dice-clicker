let score = 0;

b.style.cssText = `
  display: inline-grid;
  font: 20px system-ui;
  grid: auto-flow dense / repeat(3, auto);
`;

const addUIElement = (name, rowHeight, colCount, colWidth) => {
  const section = document.createElement('fieldset');
  const label = document.createElement('legend');
  const inner = document.createElement('div');
  section.style.cssText = rowHeight ? '' : 'grid-column:1/-1';
  section.append(label, inner);
  inner.style.cssText = `
    display: inline-grid;
    font: 20px monospace;
    grid: auto-flow dense ${rowHeight}px / repeat(${colCount}, ${colWidth}px);
  `;
  label.innerHTML = name;
  b.append(section);
  return inner;
}

const scoreSectionInner = addUIElement('Score');
const diceSectionInner = addUIElement('Dice', 48, 6, 48);
const critterSectionInner = addUIElement('Critters', 32, 4, 48);
const shopSectionInner = addUIElement('Shop', 48, 1, 192);

scoreSectionInner.innerHTML = `•${score}`;

// const diceAnimationFrames = ['◩', '⬘', '⬔', '⬗', '◪', '⬙', '⬕', '⬖']; // Unused because wonky sizes and takes up more space(?)
const diceFaces = [...'⚀⚁⚂⚃⚄⚅'];

const refreshShop = () => {
  // .map() or .forEach() would make more sense, but only filter used in the codebase elsewhere
  [...shopSectionInner.children].filter((item) => item.disabled = score < item.cost);
};

const addNewShopItem = (icon, cost, buyCallback) => {
  const item = document.createElement('button');

  item.cost = cost;
  // Position sticky not needed but repeats with newDice cssText
  item.style.cssText = `
    display: flex;
    font: 32px system-ui;
    padding: 2px 8px;
    position: sticky;
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
      font: 32px system-ui;
      padding: 2px 8px;
      position: sticky;
      align-items: center;
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
      position: absolute;
      inset: auto 0 0 auto;
      font: 20px monospace;
      color: red;
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
