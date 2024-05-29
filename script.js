import data from './data.json' with { type: 'json' };
const sidebar = document.getElementById('sidebar');
const infobox = document.getElementById('infobox');

const player = {
  fishCount: 0,
  statClick: 1,
  statAuto: 0,
  activeTab: 0,
  activeItem: 0,
  itemsOwned: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

function displayInfo() {
  const item = data[player.activeTab][player.activeItem];
  const itemCount = player.itemsOwned[player.activeTab][player.activeItem];
  const infoSpans = document.querySelectorAll('.info');

  infoSpans[0].textContent = item.name
  infoSpans[1].textContent = item.description
  infoSpans[2].textContent = `${item.stat} + ${item.power}`;
  infoSpans[3].textContent = `${itemCount} / ${item.max}`;
  infoSpans[4].textContent = item.price
}

function updateHUD() {
  const statSpans = document.querySelectorAll('#stats > li > span');
  for (let span of statSpans) {
    span.textContent = player[span.id];
  }
}

function onMouseOver(e) {
  if (e.target.nodeName === 'IMG') {
    e.target.style.backgroundColor = 'var(--color-4-darkest)';
    const siblings = e.target.parentElement.children;

    player.activeItem = Array.prototype.indexOf.call(siblings, e.target);

    displayInfo();
  } else if (e.target.className === 'tab') {
    e.target.style.backgroundColor = 'var(--color-2-light)';
  }
}

function changeTab(e) {
  const siblings = e.target.parentElement.children;
  const index = Array.prototype.indexOf.call(siblings, e.target);
  const drawers = document.querySelectorAll('.drawer');
  // Update player obj to represent new tab
  player.activeTab = index;

  // Hide all drawers first
  drawers.forEach((i) => (i.className = 'drawer hidden'));

  // Then unhide the active one
  drawers[index].classList.remove('hidden');
}

function onMouseOut(e) {
  e.target.style.backgroundColor = '';
}

function onWaterClick() {
  // Increment Fish counter
  player.fishCount += player.statClick;

  // Animation stuff
  const water = document.getElementById('whirl');
  water.classList.remove('jump');
  water.offsetWidth;
  water.classList.add('jump');
}

function onClick(e) {
  if (e.target.id === 'whirl') {
    onWaterClick();
  } else if (e.target.id === 'purchase') {
    Purchase();
  } else if (e.target.className === 'tab') {
    changeTab(e);
  }
}

function Purchase() {
  const itemData = data[player.activeTab][player.activeItem];
  const itemCount = player.itemsOwned[player.activeTab][player.activeItem];

  // 1. if item max count is not exceeded & we have enough money for the purchase
  // 2. Subtract item's price from players fish
  // 3. Increment corresponding owned counter
  // 4. Add item stat to player stats
  // 5. DisplayInfo so the owned count updates on store

  if (itemCount < itemData.max && player.fishCount >= itemData.price) {
    player.fishCount -= itemData.price;
    player.itemsOwned[player.activeTab][player.activeItem]++;

    if (itemData.stat === 'click') {
      player.statClick += itemData.power;
    } else {
      player.statAuto += itemData.power;
    }
    displayInfo();
  }
}

document.addEventListener('click', onClick);
sidebar.addEventListener('mouseover', onMouseOver);
sidebar.addEventListener('mouseout', onMouseOut);
displayInfo();

let ticks = 0;
setInterval(() => {
  ticks++;

  updateHUD();
  // every 1 second add fishes from autofishing to the total fish
  if (ticks % 10 === 0) {
    player.fishCount += player.statAuto;
  }
}, 100);