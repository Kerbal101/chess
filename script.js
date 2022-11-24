let focus = null;
let pastFocusColor = null;
let gameOver = false;
let storePossibleMoves = [];
let storePoses = [];
let holdPieces = [];
let holdEvents = [];
let turn = 'Black';

let topText = document.getElementById('topText');
let board = document.getElementById('board');

const pieces = {
  Queen: {
    Movement: function(info, x, y, num) {
      let tab = [
      [x, y + 1],
      [x, y - 1],
      [x + 1, y + 1],
      [x - 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x - 1, y],
      ]

      pattern(tab, 1, 8, x, y, 1, 0);
      pattern(tab, 1, 8, x, y, -1, 0);
      pattern(tab, 1, 8, x, y, 0, 1);
      pattern(tab, 1, 8, x, y, 0, -1);
      pattern(tab, 1, 8, x, y, 1, 1);
      pattern(tab, 1, 8, x, y, -1, -1);
      pattern(tab, 1, 8, x, y, -1, 1);
      pattern(tab, 1, 8, x, y, 1, -1);

      return tab;
    },

    Image: {
      White: 'https://cdn.shopify.com/s/files/1/2209/1363/products/additional_megachess-18_d2980cab-b966-4cee-b5e2-6cd3f0827387.png?v=1535653440',
      Black: 'https://cdn.shopify.com/s/files/1/2209/1363/products/additional_megachess-9_d4e6bb9b-a79a-405f-80ae-f1c6fd196ec0.png?v=1535653313'
    }
  },

  King: {
    Movement: function(info, x, y, num) {
      return [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y + 1],
        [x - 1, y - 1],
        [x - 1, y + 1],
        [x + 1, y - 1],
        [x + 1, y],
        [x - 1, y],
      ]
    },

    Image: {
      White: 'https://cdn.shopify.com/s/files/1/2209/1363/products/additional_megachess-44_33afb3f4-7bfe-4438-a46a-46b5d1b35078.png?v=1535649501',
      Black: 'https://cdn.shopify.com/s/files/1/2209/1479/products/2017_Mega_Chess_Need_to_Clip-61_c4f9911e-133d-4630-8560-23d1f3374e8f_1024x1024.png?v=1535653947'
    }
  },

  Rook: {
    Movement: function(info, x, y, num) {
      let tab = [];

      pattern(tab, 1, 8, x, y, 1, 0);
      pattern(tab, 1, 8, x, y, -1, 0);
      pattern(tab, 1, 8, x, y, 0, 1);
      pattern(tab, 1, 8, x, y, 0, -1);

      return tab;
    },

    Image: {
      White: 'https://cdn.shopify.com/s/files/1/2209/1479/products/additional_megachess-22_1200x1200.png?v=1535655377',
      Black: 'https://cdn.shopify.com/s/files/1/2209/1363/products/additional_megachess-2_3679326a-8c1e-49c7-84d6-00fe2da249ec_600x600_crop_center.png?v=1535645845'
    }
  },

  Knight: {
    Movement: function(info, x, y, num) {
      return [
        [x + 2, y + 1],
        [x + 2, y - 1],
        [x - 2, y + 1],
        [x - 2, y - 1],
        [x - 1, y + 2],
        [x + 1, y + 2],
        [x - 1, y - 2],
        [x + 1, y - 2],
      ];
    },

    Image: {
      White: 'https://cdn.shopify.com/s/files/1/2209/1479/products/additional_megachess-21_1200x1200.png?v=1535654484',
      Black: 'https://cdn.shopify.com/s/files/1/2209/1479/products/additional_megachess-11_1024x1024.png?v=1535652636'
    }
  },

  Bishop: {
    Movement: function(info, x, y, num) {
      let tab = [];

      pattern(tab, 1, 8, x, y, 1, 1);
      pattern(tab, 1, 8, x, y, -1, -1);
      pattern(tab, 1, 8, x, y, -1, 1);
      pattern(tab, 1, 8, x, y, 1, -1);

      return tab;
    },

    Image: {
      White: 'https://cdn.shopify.com/s/files/1/2209/1363/products/MF48BW_600x600_crop_center.png?v=1535644423',
      Black: 'https://cdn.shopify.com/s/files/1/2209/1479/products/additional_megachess-10_1200x1200.png?v=1535651779'
    }
  },

  Pawn: {
    Movement: function(info, x, y, num) {
      let tab = [];

      let diagCheck = checkPosition(x + 1, y + num);
      let diagCheck2 = checkPosition(x - 1, y + num);
      let sideCheck = checkPosition(x+1, y);
      let sideCheck2 = checkPosition(x-1, y);
      
      if (diagCheck != null && diagCheck.Color != info.Color) {
        tab.push([x + 1, y + num]);
      }
      
      if (diagCheck2 != null && diagCheck2.Color != info.Color) {
        tab.push([x - 1, y + num]);
      }

      if (info.Moves == 0) {
        let passed = false;
        if (checkPosition(x, y + num) == null) {
          passed = true;
          tab.push([x, y + (num)]);
        }

        if (passed && checkPosition(x, y + (num * 2)) == null) {
          tab.push([x, y + (num * 2)]);
        }
      }
      else if (checkPosition(x, y + num) == null) {
        tab.push([x, y + (num)]);
      }

      if (sideCheck != null && sideCheck.Moves == 1 && (y==4 || y==5)){
        if (sideCheck.Color != info.Color){
          tab.push([x + 1, y + num, sideCheck]);
        }
      }

      if (sideCheck2 != null && sideCheck2.Moves == 1 && (y==4 || y==5)){
        if (sideCheck2.Color != info.Color){
          tab.push([x - 1, y + num, sideCheck2]);
        }
      }

      return tab;
    },

    Image: {
      White: 'https://i.pinimg.com/originals/c5/fe/e2/c5fee2b05ce93bc24906ccd2f30eff0b.png',
      Black: 'https://i.ebayimg.com/images/g/x8EAAOSwyDFa8yCW/s-l300.png'
    }
  }
}

function pattern(table, i1, i2, x, y, x2, y2) {
  for (i = i1; i <= i2; i++) {
    let pos = [x + (x2 * i), y + (y2 * i)];
    let included = false;

    for (k = 0; k < table.length; k++) {
      if (table[k][0] == pos[0] && table[k][1] == pos[1]) {
        included = true;
        break;
      }
    }

    if (included == false) {
      table.push(pos);
    }

    if (checkPosition(pos[0], pos[1]) != null) {
      break;
    }
  }
}

function restart() {
  for (i = 0; i <= holdPieces.length; i++) {
    if (holdPieces[i] != null) {
      holdPieces[i].remove();
      holdPieces[i] = null;
    }
  }

  gameOver = false;
  holdPieces = [];
  holdEvents = [];
  storePoses = [];
  storePossibleMoves = [];

  board.innerHTML = '';
  board.style.filter = '';

  turn = 'Black';
  InitializeBoard();
  loadSide('White', 8, -1);
  loadSide('Black', 1, 1);
  changeTurn();
}

function checkWon(color, info) {
  if (info.Type == 'King') {
    board.style.transition = 'filter .5s';
    board.style.filter = 'blur(5px)';
    topText.innerHTML = color + ' has won!';

    gameOver = true;
    return true;
  }
  return false;
}

function InitializeBoard() {
  for (r = 1; r <= 8; r++) {
    const row = document.createElement('div');
    board.appendChild(row);
    row.className = 'row';
    row.id = r;

    for (s = 1; s <= 8; s++) {
      const slot = document.createElement('div');
      row.appendChild(slot);
      slot.className = 'slot';
      slot.id = s + '_' + r;
      storePoses[slot.id] = null;
      if ((s % 2 == 0 && r % 2 == 0) || (s % 2 == 1 && r % 2 == 1)) {
        slot.style.backgroundColor = 'rgb(252, 229, 179)';
      }
      else {
        slot.style.backgroundColor = 'rgb(250, 219, 152)';
      }
    }
  }
}

function changeTurn() {
  if (turn == 'Black') {
    turn = 'White';
  }
  else {
    turn = 'Black';
  }

  topText.innerHTML = turn + 's Turn';
  topText.style.color = turn;

  for (i = 0; i < holdEvents.length; i++) {
    let info = holdEvents[i];
    info[0].removeEventListener(info[1], info[2]);
  }

  for (i = 0; i < holdPieces.length; i++) {
    let img = holdPieces[i];
    let id = img.id;
    let type = img.id.split('_')[1];
    let color = img.id.split('_')[0];

    if (color == turn) {
      function clicked() {
        if (gameOver == true) {
          return;
        }

        if (focus !== null) {
          focus.style.backgroundColor = pastFocusColor;
        }

        if (focus == img.parentElement) {
          focus = null;
          pastFocusColor = null;
          clearPossibleMoves();
        }
        else {
          focus = img.parentElement;
          pastFocusColor = focus.style.backgroundColor;

          focus.style.backgroundColor = 'rgb(255, 255, 255)';
          clearPossibleMoves();
          showPossibleMoves(img, pastFocusColor, img.parentElement.id, type, color);
        }
      }
      img.addEventListener('click', clicked);
      holdEvents.push([img, 'click', clicked])

    }
  }
}

function checkPosition(x, y) {
  return storePoses[x + '_' + y];
}

function translatePos(position) {
  return [Number(position.split('_')[0]), Number(position.split('_')[1])];
}

function pawnPromotion(color, position) {
  storePoses[position].Piece.remove();
  loadPiece(position, 'Queen', color);
}

function showPossibleMoves(img, pastColor, position, type, color) {
  clearPossibleMoves();
  let typeInfo = pieces[type];

  let cord = translatePos(position);
  let num = -1;
  if (color == 'Black') {
    num = 1;
  }

  let poses = typeInfo.Movement(storePoses[position], cord[0], cord[1], num);
  let blockedByPiece = false;
  for (i = 0; i < poses.length; i++) {
    let id = poses[i][0] + '_' + poses[i][1];
    let possant = poses[i][2];
    let obj = document.getElementById(id);
    if (obj == null) { continue; }

    if (storePoses[id] != null) {
      blockedByPiece = true;

      if (storePoses[id].Color == color) {
        continue;
      }
    }

    function move() {
      let won = false;
      if (blockedByPiece && storePoses[id] != null) {
        won = checkWon(color, storePoses[id]);
        obj.removeChild(obj.firstChild);
      }

      let save = storePoses[position];
      let exactPos = translatePos(id);
      console.log(exactPos[1]);
      storePoses[position] = null;
      obj.appendChild(img);

      storePoses[id] = save;
      storePoses[id].Moves += 1;

      focus.style.backgroundColor = pastColor;
      focus = null;
      pastFocusColor = null;
      clearPossibleMoves();

      if (type == 'Pawn' && possant != null){
        storePoses[possant] = null;
        possant.Piece.remove();
      }

      if (type == 'Pawn' && ((color == 'White' && exactPos[1] == 1) || (color == 'Black' && exactPos[1] == 8))) {
        pawnPromotion(color, id);
      }

      if (won == false) {
        changeTurn();
      }
    }

    obj.addEventListener('click', move);
    storePossibleMoves.push([id, obj.style.backgroundColor, move]);

    if ((i % 2) == 0) {
      obj.style.backgroundColor = 'rgb(156, 224, 170)';
    }
    else {
      obj.style.backgroundColor = 'rgb(146, 215, 160)';
    }

    if (blockedByPiece && typeInfo.Break) {
      break;
    }
  }
}

function clearPossibleMoves() {
  if (storePossibleMoves.length != 0) {
    for (i = 0; i < storePossibleMoves.length; i++) {
      let obj = document.getElementById(storePossibleMoves[i][0]);
      obj.style.backgroundColor = storePossibleMoves[i][1];
      if (storePossibleMoves[i][2] != null) {
        obj.removeEventListener('click', storePossibleMoves[i][2]);
      }
    }
  }
  storePossibleMoves = [];
}

function loadPiece(position, type, color) {
  let img = document.createElement('img');
  let posObj = document.getElementById(position);
  posObj.appendChild(img);
  img.id = color + '_' + type;
  img.class = 'piece';
  img.style.width = '60px';
  img.style.height = '60px';
  img.style.paddingTop = '10px';
  img.style.color = '#FF0000';
  img.src = pieces[type].Image[color];

  storePoses[position] = { Piece: img, Moves: 0, Color: color, Type: type };
  holdPieces.push(img);
}

function loadSide(color, y, direction) {
  for (i = 1; i <= 8; i++) {
    loadPiece((i + '_' + (y + direction)), 'Pawn', color);
  }
  loadPiece(('3_' + y), 'Bishop', color);
  loadPiece(('6_' + y), 'Bishop', color);

  loadPiece(('2_' + y), 'Knight', color);
  loadPiece(('7_' + y), 'Knight', color);

  loadPiece(('1_' + y), 'Rook', color);
  loadPiece(('8_' + y), 'Rook', color);

  loadPiece(('5_' + y), 'King', color);
  loadPiece(('4_' + y), 'Queen', color);
}

InitializeBoard();
loadSide('White', 8, -1);
loadSide('Black', 1, 1);
changeTurn();
document.getElementById('restart').addEventListener('click', restart);