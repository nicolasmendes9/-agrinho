// === Variáveis do jogo ===
let tratorX; // posição x do trator
let tratorY; // posição y do trator
let velocidadeTrator = 2; // velocidade de movimento do trator
let arvores = []; // array de árvores (obstáculos)
let pedras = []; // array de pedras (obstáculos)
let lagos = []; // array de lagos (obstáculos)
let colheitas = []; // array de colheitas (itens a coletar)
let pontuacao = 0; // pontuação do jogador
let vidas = 2; // vidas do jogador
let estado = "intro"; // estado do jogo: "intro" ou "jogo"

// possíveis pontos de spawn do trator
let spawnPoints = [
  [50, 50],
  [100, 300],
  [200, 100],
  [300, 250],
  [50, 200]
];

// Função para verificar se (x, y) está a uma distância mínima dos objetos
function distanciaValida(x, y, objetos, distanciaMinima) {
  for (let i = 0; i < objetos.length; i++) {
    if (dist(x, y, objetos[i][0], objetos[i][1]) < distanciaMinima) {
      return false;
    }
  }
  return true;
}

function setup() {
  createCanvas(500, 500); // define o tamanho do canvas
}

function draw() {
  if (estado == "intro") {
    // tela de introdução
    background(255);
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Bem-vindo ao jogo!", width/2, height/2 - 50);
    textSize(16);
    text("Objetivo: Coletar 🌾", width/2, height/2);
    text("Evite 🌳 e 🪨 e 💧", width/2, height/2 + 20);
    text("Use as setas para mover o trator 🚜", width/2, height/2 + 40);
    text("Pressione qualquer tecla para começar...", width/2, height/2 + 80);

  } else if (estado == "jogo") {
    background(181, 101, 29); // cor do campo

    // verifica vitória
    if (pontuacao >= 200) {
      background(255);
      fill(0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("Você ganhou!", width/2, height/2);
      noLoop();
      return;
    }

    // verifica derrota
    if (vidas <= 0) {
      background(255);
      fill(0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("Você perdeu!", width/2, height/2);
      noLoop();
      return;
    }

    // desenha trator
    textSize(32);
    textAlign(CENTER, CENTER);
    text("🚜", tratorX, tratorY);

    // desenha e trata árvores
    textSize(24);
    for (let i = 0; i < arvores.length; i++) {
      text("🌳", arvores[i][0], arvores[i][1]);
      arvores[i][0] += random(-0.5, 0.5);
      arvores[i][1] += random(-0.5, 0.5);
      arvores[i][0] = constrain(arvores[i][0], 0, width);
      arvores[i][1] = constrain(arvores[i][1], 0, height);

      if (dist(tratorX, tratorY, arvores[i][0], arvores[i][1]) < 20) {
        pontuacao -= 1;
        vidas -= 1;
        let novaX, novaY, ok = false;
        while (!ok) {
          novaX = random(width);
          novaY = random(height);
          ok = distanciaValida(novaX, novaY, arvores.filter((_,j)=>j!==i),50)
            && distanciaValida(novaX, novaY, pedras,50)
            && distanciaValida(novaX, novaY, lagos.map(l=>[l[0], l[1]]),70)
            && distanciaValida(novaX, novaY, colheitas,50);
        }
        arvores[i][0] = novaX;
        arvores[i][1] = novaY;
        novoSpawn();
      }
    }

    // desenha e trata pedras
    for (let i = 0; i < pedras.length; i++) {
      text("🪨", pedras[i][0], pedras[i][1]);
      pedras[i][0] += random(-0.2, 0.2);
      pedras[i][1] += random(-0.2, 0.2);
      pedras[i][0] = constrain(pedras[i][0], 0, width);
      pedras[i][1] = constrain(pedras[i][1], 0, height);

      if (dist(tratorX, tratorY, pedras[i][0], pedras[i][1]) < 20) {
        pontuacao -= 1;
        vidas -= 1;
        let novaX, novaY, ok = false;
        while (!ok) {
          novaX = random(width);
          novaY = random(height);
          ok = distanciaValida(novaX, novaY, arvores,50)
            && distanciaValida(novaX, novaY, pedras.filter((_,j)=>j!==i),50)
            && distanciaValida(novaX, novaY, lagos.map(l=>[l[0], l[1]]),70)
            && distanciaValida(novaX, novaY, colheitas,50);
        }
        pedras[i][0] = novaX;
        pedras[i][1] = novaY;
        novoSpawn();
      }
    }

    // desenha e trata lagos
    fill(0,0,255);
    for (let i = 0; i < lagos.length; i++) {
      ellipse(lagos[i][0], lagos[i][1], lagos[i][2], lagos[i][2]);
      if (dist(tratorX, tratorY, lagos[i][0], lagos[i][1]) < lagos[i][2]/2 +10) {
        pontuacao -= 2;
        vidas -= 1;
        let novaX, novaY, novoT, ok = false;
        while (!ok) {
          novaX = random(width);
          novaY = random(height);
          novoT = random(20,50);
          ok = distanciaValida(novaX, novaY, arvores,70)
            && distanciaValida(novaX, novaY, pedras,70)
            && distanciaValida(novaX, novaY, lagos.filter((_,j)=>j!==i).map(l=>[l[0], l[1]]),70)
            && distanciaValida(novaX, novaY, colheitas,70);
        }
        lagos[i][0] = novaX;
        lagos[i][1] = novaY;
        lagos[i][2] = novoT;
        novoSpawn();
      }
    }

    // desenha e trata colheitas
    fill(0);
    for (let i = 0; i < colheitas.length; i++) {
      text("🌾", colheitas[i][0], colheitas[i][1]);
      if (dist(tratorX, tratorY, colheitas[i][0], colheitas[i][1]) < 20) {
        pontuacao += 5;
        let novaX, novaY, ok = false;
        while (!ok) {
          novaX = random(width);
          novaY = random(height);
          ok = distanciaValida(novaX, novaY, arvores,50)
            && distanciaValida(novaX, novaY, pedras,50)
            && distanciaValida(novaX, novaY, lagos.map(l=>[l[0], l[1]]),70)
            && distanciaValida(novaX, novaY, colheitas.filter((_,j)=>j!==i),50);
        }
        colheitas[i][0] = novaX;
        colheitas[i][1] = novaY;
      }
    }

    // HUD de pontuação e vidas
    fill(0);
    textSize(16);
    text(`Pontuação: ${pontuacao}`, 80, 20);
    text(`Vidas: ${vidas}`, 80, 40);

    // movimento do trator com teclas
    if (keyIsDown(UP_ARROW)) tratorY -= velocidadeTrator;
    if (keyIsDown(DOWN_ARROW)) tratorY += velocidadeTrator;
    if (keyIsDown(LEFT_ARROW)) tratorX -= velocidadeTrator;
    if (keyIsDown(RIGHT_ARROW)) tratorX += velocidadeTrator;

    // mantêm o trator dentro da tela
    tratorX = constrain(tratorX, 0, width);
    tratorY = constrain(tratorY, 0, height);
  }
}

// inicia o jogo ao pressionar qualquer tecla
function keyPressed() {
  if (estado == "intro") {
    estado = "jogo";
    // cria 10 árvores
    for (let i = 0; i < 10; i++) {
      let x, y, ok = false;
      while (!ok) {
        x = random(width);
        y = random(height);
        ok = distanciaValida(x,y,arvores,50)
          && distanciaValida(x,y,pedras,50)
          && distanciaValida(x,y,lagos.map(l=>[l[0],l[1]]),70)
          && distanciaValida(x,y,colheitas,50);
      }
      arvores.push([x, y]);
    }
    // cria 5 pedras
    for (let i = 0; i < 5; i++) {
      let x, y, ok = false;
      while (!ok) {
        x = random(width);
        y = random(height);
        ok = distanciaValida(x,y,arvores,50)
          && distanciaValida(x,y,pedras,50)
          && distanciaValida(x,y,lagos.map(l=>[l[0],l[1]]),70)
          && distanciaValida(x,y,colheitas,50);
      }
      pedras.push([x, y]);
    }
    // cria 3 lagos
    for (let i = 0; i < 3; i++) {
      let x, y, t, ok = false;
      while (!ok) {
        x = random(width);
        y = random(height);
        t = random(20, 50);
        ok = distanciaValida(x,y,arvores,70)
          && distanciaValida(x,y,pedras,70)
          && distanciaValida(x,y,lagos.map(l=>[l[0],l[1]]),70)
          && distanciaValida(x,y,colheitas,70);
      }
      lagos.push([x, y, t]);
    }
    // cria 5 colheitas
    for (let i = 0; i < 5; i++) {
      let x, y, ok = false;
      while (!ok) {
        x = random(width);
        y = random(height);
        ok = distanciaValida(x,y,arvores,50)
          && distanciaValida(x,y,pedras,50)
          && distanciaValida(x,y,lagos.map(l=>[l[0],l[1]]),70)
          && distanciaValida(x,y,colheitas,50);
      }
      colheitas.push([x, y]);
    }
    novoSpawn(); // posição inicial do trator
  }
}

// define posição segura para o trator reaparecer
function novoSpawn() {
  let spawn, ok = false;
  while (!ok) {
    spawn = random(spawnPoints);
    ok = distanciaValida(spawn[0], spawn[1], arvores, 30)
      && distanciaValida(spawn[0], spawn[1], pedras, 30)
      && distanciaValida(spawn[0], spawn[1], lagos.map(l=>[l[0],l[1]]),50)
      && distanciaValida(spawn[0], spawn[1], colheitas, 30);
  }
  tratorX = spawn[0];
  tratorY = spawn[1];
}
