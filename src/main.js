let score = 0;

const addUIElement = (gridInfo) => {
  const section = document.createElement('fieldset');

  section.style.cssText = `
    display: inline-grid;
    margin: 2px;
    ${gridInfo}
  `;
  b.append(section);

  return section;
}

const scoreElement = addUIElement('grid-column:1/4'); // 1/-1 better but +1B
const diceElement = addUIElement('grid:auto-flow dense 48px/repeat(4,48px');
const critterElement = addUIElement('grid:auto-flow dense 32px/repeat(4,48px');
const shopElement = addUIElement('grid:auto-flow dense 48px/repeat(1,160px');
const diceFaces = [...'⚀⚁⚂⚃⚄⚅'];

const addNewShopItem = (icon, cost, buyCallback) => {
  const item = document.createElement('button');
  const costElement = document.createElement('p');

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
    [...shopElement.children].filter(item => item.disabled = score < item.cost);
    buyCallback();
  }

  shopElement.append(item);
};

const initDiceType = (
  cost,
  diceCallback,
  separator,
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
      grid-column: span ${separator ? 2 : 1};
    `;
    newDice.overlay = document.createElement('p');
    newDice.inner1 = document.createElement('p');
    newDice.inner2 = document.createElement('p');
    // 'red' uses reused characters so is < '#000', and the actual color
    // doesn't matter because it's always an emoji with it's own colors.
    // We need a color to override browser default high-opacity text.
    newDice.overlay.style.cssText = `
      position: absolute;
      color: red;
    `;
    newDice.inner1.innerHTML = newDice.inner2.innerHTML = diceFaces[5];
    newDice.inner1.style.cssText = newDice.inner2.style.cssText = `
      display: inline-grid;
      transition: all.5s;
    `;

    // position: absolute means the overlay will end up stacked on top no matter the append() order
    newDice.append(newDice.overlay, newDice.inner1);
    separator && newDice.append(separator, newDice.inner2);

    diceElement.append(newDice);

    newDice.onclick = () => {
      for (let i = 9; i--;) {
        setTimeout(() => {
          newDice.result1 = Math.random() * 6 | 0; // 0-indexed, with |0 to round down
          newDice.inner1.innerHTML = diceFaces[newDice.result1];
          newDice.inner1.style.rotate = `${Math.random()}turn`;

          newDice.result2 = Math.random() * 6 | 0; // 0-indexed, with |0 to round down
          newDice.inner2.innerHTML = diceFaces[newDice.result2];
          newDice.inner2.style.rotate = `${Math.random()}turn`;
        }, 380 * i);
        newDice.disabled = true; // This should be before the for loop, but in here saves 1B
      }

      setTimeout(() => {
        newDice.disabled = false;
        score += diceCallback(newDice.result1 + 1, newDice.result2 + 1);
        scoreElement.innerHTML = score;
        newDice.overlay.innerHTML = '';
        [...shopElement.children].filter(item => item.disabled = score < item.cost);
      }, 4000);
    }
  };

  addNewShopItem(
    separator ? diceFaces[5] + separator + diceFaces[5] : diceFaces[5],
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

initDiceType(6, (num1, num2) => num1)();

addNewShopItem('🐀', 24, () => {
  const newRat = document.createElement('p');

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

  setTimeout(nudgeDice, 1000);
});

initDiceType(60, (num1, num2) => num1 + num2, '+');

initDiceType(360, (num1, num2) => num1 * num2, '×');

initDiceType(1000, (num1, num2) => num1 ** num2, '^');

scoreElement.innerHTML = score;

// We could set all items to initially disabled, but this is repeated code
[...shopElement.children].filter(item => item.disabled = score < item.cost);
