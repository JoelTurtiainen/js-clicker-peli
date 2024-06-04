import data from './data.json' with { type: 'json' };
let ticks = 0;
const player = {
	fishCount: 0,
	statClick: 1,
	statAuto: 0,
	statSpeed: 0,
	activeTab: 0,
	activeItem: 0,
	itemsOwned: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	],
};

function onClick(e) {
	if (e.target.id === 'water') {
		clickWater(e);
	} else if (e.target.id === 'purchase') {
		Purchase();
	} else if (e.target.className === 'tab') {
		changeTab(e);
	} else if (e.target.nodeName === 'IMG' && e.target.parentElement.id === 'upgrades') {
		displayInfo(e);
	}
}

function clickWater(e) {
	// Increment fish count by click stat
	player.fishCount += player.statClick;

	// Animation stuff
	const water = document.getElementById('water');
	const splash = document.createElement('img');

	splash.src = 'img/ripple.gif';
	water.appendChild(splash);

	splash.style.rotate = Math.floor(Math.random() * 360) + 'deg';
	splash.style.top = e.y - splash.clientWidth / 2 + 'px';
	splash.style.left = e.x - splash.clientHeight / 2 + 'px';
	splash.className = 'jump';
}

function Purchase() {
	const itemData = data[player.activeTab][player.activeItem];
	const itemCount = player.itemsOwned[player.activeTab][player.activeItem];

	// 1. if item max count is not exceeded & we have enough money for the purchase
	// 2. Subtract item's price from players money
	// 3. Increment purchased item in the owned counter
	// 4. Add item stat to player stats
	// 5. DisplayInfo so the owned count updates on store
	const newPrice = itemData.price * (itemCount + 1);

	if (itemCount < itemData.max && player.fishCount >= newPrice) {
		player.fishCount -= newPrice;
		player.itemsOwned[player.activeTab][player.activeItem]++;

		if (itemData.stat === 'click') {
			player.statClick += itemData.power;
		} else if (itemData.stat === 'auto') {
			player.statAuto += itemData.power;
		} else {
			player.statSpeed += itemData.power;
		}
		displayInfo();
	}
}

function changeTab(e) {
	const siblings = e.target.parentElement.children;
	const index = Array.prototype.indexOf.call(siblings, e.target);
	// 1. Update player obj to represent new tab
	// 2. Reset background for all tabs
	// 3. Apply background on active tab
	// 4. Draw Items
	player.activeTab = index;

	document.querySelectorAll('.tab').forEach((i) => (i.style.backgroundColor = ''));
	e.target.style.backgroundColor = 'var(--color-5)';

	drawItems();
}

function drawItems() {
	const parent = document.getElementById('upgrades');
	const tabIndex = player.activeTab;
	const tabItems = data[tabIndex];
	// 1. Clear parent
	// 2. Loop through the tab items in data.json 
	// 3. Assign the itemid as img.src
	// 4. Add to DOM
	parent.innerHTML = '';

	for (let i of tabItems) {
		const img = document.createElement('img');
		img.src = './img/' + tabIndex + '/' + i.itemid + '.png';
		parent.appendChild(img);
	}
}

function updateHUD() {
	// Counters on the top left of the screen
	const parent = document.getElementById('stats');
	parent.textContent = ''
	const hud = {
		'🐟Fish: ' : player.fishCount,
	 	'⚓Click Power: ' : player.statClick,
	 	'🕰️Fish per/s: ' : fishPerS()
	};

	for (let key of Object.keys(hud)) {
		const content = key + format(hud[key])
		const li = createLi(content)
		parent.appendChild(li);
	}
}

function displayInfo(e) {
	if (e) {
		const siblings = e.target.parentElement.children;
		// If called at page load we dont come here
		// 1. Reset background for all items
		// 2. Apply background on clicked item
		// 3. Update active item to player obj
		player.activeItem = Array.prototype.indexOf.call(siblings, e.target);
		document.querySelectorAll('#upgrades > img').forEach((i) => (i.style.backgroundColor = ''));
		e.target.style.backgroundColor = 'var(--color-4-darkest)';
	}

	// Update infobox to dislay item's info
	const item = data[player.activeTab][player.activeItem];
	const itemCount = player.itemsOwned[player.activeTab][player.activeItem];

	const header = document.querySelector('.header');
	const grid = document.querySelector('.grid');
	let content;

	header.innerHTML = '';
	content = [item.name, item.description];
	content.forEach((i) => header.appendChild(createLi(i)));

	grid.innerHTML = '';
	content = [
		'Bonus:',
		[item.stat, " + ", item.power],
		'Owned:',
		[itemCount, " / ", item.max],
		'Price:',
		item.price * (itemCount + 1),
	];

	if (item.stat === 'speed') {
		content[1].push('%')
	}
	content.forEach((i) => grid.appendChild(createLi(i)));
}

function createLi(item) {
	const li = document.createElement('li');
	// if (['click', 'auto', 'speed'].includes(item[0])) {
	// 	const img = document.createElement('img')
	// 	img.src = './img/stats/' + item[0] + ".png"
	// 	img.style.scale = 2
	// 	li.appendChild(img)
	// }

	if (Array.isArray(item)) {
		item = item.join('')
	}
	
	li.appendChild(document.createTextNode(item));
	return li;
}

function loadSave() {
	console.log('object');
	for (let entry of Object.entries(localStorage)) {
		let key = entry[0];
		let value = entry[1];
		console.log(key, value);
		player[key] = JSON.parse(localStorage.getItem(key));
	}
}

function format(num) {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "b"
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "m"
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + "k"
  }
  return num.toFixed(1)
}

function fishPerS() {
	return player.statAuto * (player.statSpeed / 100 + 1)
};


setInterval(() => {
	// every 100ms
	ticks++;
	updateHUD();

	// every 1s
	if (ticks % 10 === 0) {
		player.fishCount += fishPerS();
	}
	// every 10s
	if (ticks % 100 === 0) {
		Object.entries(player).forEach((i) => localStorage.setItem(i[0], JSON.stringify(i[1])));
		console.log('saved');
	}
}, 100);

/*  ┳  • 
    ┃┏┓┓╋
    ┻┛┗┗┗   */

document.addEventListener('click', onClick);
document.addEventListener('animationend', (e) => e.target.remove());
//document.addEventListener('wheel', onClick);
//localStorage.clear();
loadSave();
displayInfo();
drawItems();
