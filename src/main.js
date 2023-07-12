let score = 0;

const addUIElement = (name, rowHeight, colCount, colWidth) => {
  const section = document.createElement('fieldset');
  const label = document.createElement('legend');
  const inner = document.createElement('div');
  section.style.cssText = !rowHeight && 'grid-column:1/-1';
  section.append(label, inner);
  inner.style.cssText = `
    display: inline-grid;
    grid: auto-flow dense ${rowHeight}px / repeat(${colCount}, ${colWidth}px);
  `;
  label.innerHTML = name;
  b.append(section);
  return inner;
}

const scoreElement = addUIElement('•');
const diceElement = addUIElement('Dice', 48, 6, 48);
const critterElement = addUIElement('Rats', 32, 4, 48);
const shopElement = addUIElement('Shop', 48, 1, 192);
const diceFaces = [...'⚀⚁⚂⚃⚄⚅'];

const addNewShopItem = (icon, cost, buyCallback) => {
  const item = document.createElement('button');
  const costElement = document.createElement('div');

  item.cost = cost;

  // Position sticky not needed but repeats with newDice cssText
  item.style.cssText = `
    display: flex;
    font: 32px system-ui;
    padding: 2px 8px;
    position: sticky;
    align-items: end;
  `;
  costElement.style.cssText = `
    font: 16px monospace;
    margin-left: auto;
  `;
  costElement.innerHTML = `•${item.cost}`;
  item.append(icon, costElement);

  item.onclick = () => {
    score -= item.cost;
    scoreElement.innerHTML = score;
    item.cost = item.cost * 1.2 | 0; // Next time buying the item will be more expensive
    costElement.innerHTML = `•${item.cost}`;
    // .map() or .forEach() makes more sense for refreshing the shop, but .filter() is used elsewhere too
    [...shopElement.children].filter((item) => item.disabled = score < item.cost);
    buyCallback();
  }

  shopElement.append(item);
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
      newDice.inner2.innerHTML = '⚅';
      newDice.inner2.style.cssText = `
        display: inline-grid;
        transition: .5s all;
      `;
      newDice.append(separator, newDice.inner2);
    }

    newDice.overlay = document.createElement('div');
    // 'red' uses reused characters so is < '#000', and the actual color
    // doesn't matter because it's always an emoji with it's own colors
    newDice.overlay.style.cssText = `
      position: absolute;
      color: red;
    `;
    newDice.append(newDice.overlay);

    newDice.onclick = () => {
      newDice.disabled = true;

      diceFaces.concat(diceFaces).forEach((_, i) => setTimeout(() => {
        newDice.result1 = Math.random() * 6 | 0; // 0-indexed, with |0 to round down
        newDice.inner1.innerHTML = diceFaces[newDice.result1];
        newDice.inner1.style.rotate = `${Math.random()}turn`;
      }, 300 * i));

      if (separator) {
        diceFaces.concat(diceFaces).forEach((_, i) => setTimeout(() => {
          newDice.result2 = Math.random() * 6 | 0; // 0-indexed, with |0 to round down
          newDice.inner2.innerHTML = diceFaces[newDice.result2];
          newDice.inner2.style.rotate = `${Math.random()}turn`;
        }, 300 * i));
      }

      setTimeout(() => {
        newDice.disabled = false;
        score += separator ? diceCallback(newDice.result1 + 1, newDice.result2 + 1) : newDice.result1 + 1;
        scoreElement.innerHTML = score;
        newDice.overlay.innerHTML = '';
        [...shopElement.children].filter((item) => item.disabled = score < item.cost);
      }, 4000);
    }

    diceElement.append(newDice);
  };

  addNewShopItem(
    separator ? `⚅${separator}⚅` : '⚅',
    cost,
    addNewDice
  );

  return addNewDice;
};

// grid columns were repeat(3, auto) but repeating auto compresses better
b.style.cssText = `
  display: inline-grid;
  font: 20px system-ui;
  grid: auto-flow dense / auto auto auto;
`;

initDiceType(6)();

addNewShopItem('🐀', 24, () => {
  const newRat = document.createElement('div');

  const nudgeDice = () => {
    const activeDice = [...diceElement.children].filter(d => !d.disabled);

    if (activeDice.length) {
      const autoRollDice = activeDice[Math.random() * activeDice.length | 0]; // |0 to round down

      autoRollDice.overlay.innerHTML = '🐀';
      autoRollDice.click();
      newRat.style.opacity = .5;

      setTimeout(() => {
        newRat.style.opacity = 1;
      }, 4000);
    }

    setTimeout(nudgeDice, 8000);
  };

  newRat.style.cssText = `
    font: 32px system-ui;
  `;
  newRat.innerHTML = '🐀';
  critterElement.append(newRat);

  setTimeout(nudgeDice, 800);
});

initDiceType(60, '+', (num1, num2) => num1 + num2);

initDiceType(360, '×', (num1, num2) => num1 * num2);

initDiceType(1080, '^', (num1, num2) => num1 ** num2);

scoreElement.innerHTML = score;

// We could set all items to initially disabled, but this is repeated code
[...shopElement.children].filter((item) => item.disabled = score < item.cost);
