import data from './data.json' with { type: 'json' };

const sidebar = document.getElementById('sidebar');
const infobox = document.getElementById('infobox')

const player = {
  fishCount: 0,
  statClick: 1,
  statAuto: 0,
  groupSelected: 0,
  itemSelected: 0,
  itemsOwned: [[0,0,0,0], [0,0,0], [0,0,0]]
}

function displayInfo() {
    const item = Object.values(data[player.groupSelected][player.itemSelected])
    const itemCount = player.itemsOwned[player.groupSelected][player.itemSelected]
    console.log(item);
    const infoSpans = document.querySelectorAll('.info')
    infoSpans.forEach((span, i) => span.textContent = item[i]);
    infoSpans[4].textContent = `${itemCount} / ${infoSpans[4].textContent}`
  }

function updateStats() {
  const statSpans = document.querySelectorAll('#stats > li > span')
  for (let span of statSpans) {
    span.textContent = player[span.id]
  }
  }

function onMouseOver(e) {
  if (e.target.nodeName === 'IMG') {
    e.target.style.backgroundColor = 'var(--color-4-darkest)';
    const parent = e.target.parentElement
    const drawers = document.querySelectorAll('.drawer');

    player.groupSelected = Array.prototype.indexOf.call(drawers, parent);
    player.itemSelected = Array.prototype.indexOf.call(parent.children, e.target);

    displayInfo()
  }
}


function onMouseOut(e) {
  e.target.style.backgroundColor = '';
}

function onClick(e) {
  if (e.target.id === 'whirl') { 
    const water = document.getElementById('whirl')
    water.classList.remove("jump")
    water.offsetWidth
    water.classList.add("jump")
    player.fishCount += player.statClick

  } else if (e.target.id === 'purchase') {
      Purchase()
  } else if (e.target.id === 'tabs') {
    console.log(e.target.id);
  } else {
    console.log(e.target);
  }
}

function Purchase() {
  const itemData = data[player.groupSelected][player.itemSelected]
  const itemCount = player.itemsOwned[player.groupSelected][player.itemSelected];

  // if item max count is not exceeded & we have enough money for the purchase
  if (itemCount < itemData.max && player.fishCount >= itemData.price) {
    
    player.fishCount -= itemData.price
    player.itemsOwned[player.groupSelected][player.itemSelected]++

    if (itemData.stat === 'click') {
      player.statClick += itemData.power
    } else {
      player.statAuto += itemData.power
    }
    displayInfo()
  } 
}

// console.log(data);


document.addEventListener('click', onClick);
sidebar.addEventListener('mouseover', onMouseOver);
sidebar.addEventListener('mouseout', onMouseOut);

let ticks = 0
setInterval(() => {
  ticks++

  updateStats();

  if (ticks % 10 === 0) {
  player.fishCount += player.statAuto
  }
}, 100);
