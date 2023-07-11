console.log('dice! ⚀⚁⚂⚃⚄⚅');

const div = document.createElement('div');
div.innerText = 'dice! ⚀⚁⚂⚃⚄⚅';
b.append(div);
b.style.cssText = `
  font: 1em system-ui;
`;

const testButton1 = document.createElement('button');
testButton1.innerText = '⚀'
testButton1.style.font = '2em system-ui';
b.append(testButton1);

const testButton2 = document.createElement('button');
testButton2.innerText = '⚁ + ⚁'
testButton2.style.font = '2em system-ui';
b.append(testButton2);

const testButton3 = document.createElement('button');
testButton3.innerText = '⚂ × ⚂'
testButton3.style.font = '2em system-ui';
b.append(testButton3);

const testButton4 = document.createElement('button');
testButton4.innerText = '⚃ ** ⚃'
testButton4.style.font = '2em system-ui';
b.append(testButton4);

const testButton5 = document.createElement('button');
testButton5.innerText = '⚄²'
testButton5.style.font = '2em system-ui';
b.append(testButton5);

const testButton6 = document.createElement('button');
testButton6.innerText = '⚅³'
testButton6.style.font = '2em system-ui';
b.append(testButton6);
