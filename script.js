import data from './data.json' with { type: 'json' };

const sidebar = document.getElementById('sidebar');
const infobox = document.getElementById('infobox')

const player = {
  fishCount: 0,
  statClick: 1,
  statAuto: 0,
  shopSelected: [0, 0],
}

function displayInfo(item) {
    console.log(item);
    const infoSpans = document.querySelectorAll('.info')
    infoSpans.forEach((span, i) => span.textContent = item[i]);
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

    const drawerIndex = Array.prototype.indexOf.call(drawers, parent);
    const itemIndex = Array.prototype.indexOf.call(parent.children, e.target);

    const selected = Object.values(data[drawerIndex][itemIndex])
    player.shopSelected = [drawerIndex, itemIndex]

    console.log(player.shopSelected);
    displayInfo(selected)
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
      onPurchase(e.target)
  }
}

function onPurchase(e) {
  console.log(e);
}

// console.log(data);


document.addEventListener('click', onClick);
sidebar.addEventListener('mouseover', onMouseOver);
sidebar.addEventListener('mouseout', onMouseOut);

setInterval(() => {
  updateStats();
}, 1000/15);
