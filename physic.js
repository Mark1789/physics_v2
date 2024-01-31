//let coords = blk.getBoundingClientRect();
// elements
let area = document.querySelector(".area");
let hero = document.querySelector(".hero");
let enemy = document.querySelector(".enemy");
let coin = document.querySelector(".coin");
let panes = document.querySelectorAll(".pane");
let left = document.querySelector(".left");
let right = document.querySelector(".right");
let jump = document.querySelector(".jump");
let score = document.querySelector(".score");

let area_coords = area.getBoundingClientRect();


// переменная для setInterval control
let move_left; 
// начальная точка отсчета для control
let hero_style_left = 0;
// это top, падение
let hero_tumble = 0;
// пока true hero падает
let hero_tumble_check = true;
// высоты прыжка
let hero_jump_max = 90;
// step
let step = 1;
// speed process
let speed = 0;
// высота поыжка
let jump_height = 0;
// активатор control
let hero_left = false;
let hero_right = false;
let hero_jump = false;


// objects of coords panes, getBounding...
let coords_panes = [];
// для проверки столкновения с платформой 
let pane_check = 0;


for (let el of panes) {
  let pane = el.getBoundingClientRect();
  coords_panes.push(pane);
}


let hero_obj = {
  left: function () {
    hero.style.left = hero_style_left + 'px';
    hero_style_left -= step;
  },
  right: function () {
    hero.style.left = hero_style_left + 'px';
    hero_style_left += step;
  },
  tumble: function () {
    hero.style.top = hero_tumble + 'px';
    hero_tumble += step;
  },
  jump: function () {
    hero.style.top = hero_tumble + 'px';
    hero_tumble -= step;
  }
}

let coin_obj = {
  create: function () {
    let randomPane = coords_panes[Math.floor(Math.random() * panes.length)]
    coin.style.top = randomPane.top - 29 + 'px';
    coin.style.left = randomPane.left + Math.floor(Math.random()*randomPane.width) - (coin.offsetWidth/2) - area_coords.left + 'px';
  }
}

let enemy_obj = {
  // начальная точка отсчета от платыормы
  enemy_style_left: 0,
  enemy_pane: null,
  // personal step
  enemy_step: step,
  create: function () {
    let randomPane = coords_panes[Math.floor(Math.random() * panes.length)];
    this["enemy_pane"] = randomPane;
    enemy.style.top = randomPane.top - enemy.offsetHeight - area_coords.top - 1 + 'px';
    enemy.style.left = randomPane.left + Math.floor(Math.random()*randomPane.width) - area_coords.left + 'px';
    this["enemy_style_left"] =
    randomPane.left - area_coords.left;
  },
  move: function (x) {
    enemy.style.left = this["enemy_style_left"] + 'px';
    
      this["enemy_style_left"] += this["enemy_step"]/5;
      if (x.right === this["enemy_pane"].right) this["enemy_step"] = (-1)*step;
      if (x.left === this["enemy_pane"].left) this["enemy_step"] = step;
  }
}

enemy_obj.create();
coin_obj.create();

let process = setInterval(() => {
  
  let hero_coords = hero.getBoundingClientRect();
  let coin_coords = coin.getBoundingClientRect();
  let enemy_coords = enemy.getBoundingClientRect();

  
  // проверка на падение
  if (hero_tumble_check) {
    hero_obj.tumble()
  }
  // move hero
  if (hero_left) {
    hero_obj.left()
  }
  if (hero_right) {
    hero_obj.right()
  }
  // move enemy
  enemy_obj.move(enemy_coords);
  
  
  // проверка на столкновение с платформой
  for (let i = 0; i < panes.length; i += 1) {
    if ((hero_coords.left < coords_panes[i].right && hero_coords.right > coords_panes[i].left) && hero_coords.bottom === coords_panes[i].top) {
      hero.style.top = coords_panes[i].top - 29 + 'px';
      hero_tumble_check = false;
      pane_check += 1;
    } else if (pane_check === 0) {
      hero_tumble_check = true;
    }
  }
  pane_check = 0;
  
  // catch coin
  if ((hero_coords.top <= coin_coords.bottom && hero_coords.bottom >= coin_coords.top) && (hero_coords.left <= coin_coords.right && hero_coords.right >= coin_coords.left)) {
    score.innerHTML = +score.innerHTML + 1;
    coin_obj.create();
  }
  
  // crash with enemy
  if ((hero_coords.bottom === enemy_coords.top) && (hero_coords.left <= enemy_coords.right && hero_coords.right >= enemy_coords.left)) {
    score.innerHTML = +score.innerHTML + 10;
    enemy_obj.create();
  } else if ((hero_coords.top <= enemy_coords.bottom && hero_coords.bottom > enemy_coords.top) && (hero_coords.left <= enemy_coords.right && hero_coords.right >= enemy_coords.left)) {
    clearInterval(process)
    location.reload()
  }
  
  // при прыжке
  if (hero_jump) {
    hero_obj.jump();
    jump_height += 1;
   hero_tumble_check = false;
    // высота прыжка
    if (jump_height === hero_jump_max) {
    hero_jump = false; 
    jump_height = 0;
    }
  }
}, speed)


left.addEventListener('touchstart', (event) =>  {
    event.preventDefault();
  hero_left = true;
})
left.addEventListener('touchend', () => {
  hero_left = false;
})

right.addEventListener('touchstart', (event) =>  {
     event.preventDefault();
  hero_right = true;
})
right.addEventListener('touchend', () => {
  hero_right = false;
})

jump.addEventListener('touchstart', (event) =>  {
       event.preventDefault();
  if (!hero_jump && !hero_tumble_check) {
   hero_jump = true; 
  }
})

