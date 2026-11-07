import Phaser from 'phaser';
import './styles.css';

const QUESTIONS_PER_LEVEL = 3;
const LEVELS = [
  { name: '加法小徑', short: '加法', kind: 'add' },
  { name: '減法河灣', short: '減法', kind: 'subtract' },
  { name: '乘法樹冠', short: '乘法', kind: 'multiply' },
  { name: '除法松果', short: '除法', kind: 'divide' },
  { name: '綜合秘林', short: '綜合', kind: 'mixed' },
];

const ui = {
  score: document.querySelector('#score'),
  levelName: document.querySelector('#level-name'),
  questionCount: document.querySelector('#question-count'),
  equation: document.querySelector('#equation'),
  roundProgressText: document.querySelector('#round-progress-text'),
  roundProgressFill: document.querySelector('#round-progress-fill'),
  feedback: document.querySelector('#feedback'),
  start: document.querySelector('#start-game'),
  pause: document.querySelector('#pause-game'),
  pauseOverlay: document.querySelector('#pause-overlay'),
  resultOverlay: document.querySelector('#result-overlay'),
  resultTitle: document.querySelector('#result-title'),
  resultCopy: document.querySelector('#result-copy'),
  finalScore: document.querySelector('#final-score'),
  worldHint: document.querySelector('#world-hint'),
  answerList: document.querySelector('#answer-list'),
  answerLabels: [...document.querySelectorAll('.answer-label')],
  liveStatus: document.querySelector('#live-status'),
  trackSteps: [...document.querySelectorAll('[data-track]')],
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

function createQuestion(levelIndex) {
  const configuredKind = LEVELS[levelIndex].kind;
  const kind = configuredKind === 'mixed' ? ['add', 'subtract', 'multiply', 'divide'][randomInt(0, 3)] : configuredKind;
  let a;
  let b;
  let answer;
  let symbol;

  if (kind === 'add') {
    a = randomInt(4, 24);
    b = randomInt(3, 18);
    answer = a + b;
    symbol = '+';
  } else if (kind === 'subtract') {
    a = randomInt(14, 50);
    b = randomInt(3, a - 2);
    answer = a - b;
    symbol = '−';
  } else if (kind === 'multiply') {
    a = randomInt(2, 9);
    b = randomInt(2, 9);
    answer = a * b;
    symbol = '×';
  } else {
    b = randomInt(2, 9);
    const quotient = randomInt(2, 9);
    a = b * quotient;
    answer = quotient;
    symbol = '÷';
  }

  const distractors = new Set();
  while (distractors.size < 2) {
    let value;
    if (kind === 'multiply' || kind === 'divide') {
      value = answer + randomInt(-5, 5);
      if (value < 1) value = answer + randomInt(2, 6);
    } else {
      value = answer + randomInt(-6, 6);
      if (value < 0) value = answer + randomInt(2, 8);
    }
    if (value !== answer) distractors.add(value);
  }

  return {
    expression: `${a} ${symbol} ${b} = ?`,
    answer,
    options: shuffle([answer, ...distractors]),
  };
}

class ForestMathScene extends Phaser.Scene {
  constructor() {
    super('ForestMathScene');
    this.phase = 'menu';
    this.levelIndex = 0;
    this.questionIndex = 0;
    this.score = 0;
    this.currentQuestion = null;
    this.pressedDirections = new Set();
    this.touchDirection = null;
    this.answerSigns = [];
    this.busy = false;
  }

  create() {
    this.createTextures();
    this.forest = this.add.graphics().setDepth(0);
    this.route = this.add.graphics().setDepth(1);
    this.routeGlow = this.add.graphics().setDepth(2).setVisible(false);
    this.player = this.physics.add.sprite(0, 0, 'forest-explorer').setDepth(4);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(36, 50).setOffset(18, 24);
    this.player.setMaxVelocity(250, 250);
    this.player.setDrag(900, 900);

    for (let index = 0; index < 3; index += 1) {
      const sprite = this.physics.add.staticImage(0, 0, 'wooden-sign').setDepth(3);
      sprite.setData('index', index);
      const label = ui.answerLabels[index];
      this.physics.add.overlap(this.player, sprite, () => this.collectSign(sprite), undefined, this);
      this.answerSigns.push({ sprite, label });
    }

    this.game.events.on('start-run', this.startRun, this);
    this.game.events.on('pause-run', this.togglePause, this);
    this.game.events.on('restart-run', this.restartRun, this);
    this.game.events.on('move-key', this.setKeyDirection, this);
    this.game.events.on('move-touch', this.setTouchDirection, this);
    this.scale.on('resize', this.resizeScene, this);

    this.currentQuestion = createQuestion(this.levelIndex);
    this.resizeScene({ width: this.scale.width, height: this.scale.height });
    this.setQuestionSigns();
    this.showFeedback('答對得 10 分，答錯扣 5 分。準備好就出發！');
    this.updateInterface();
    this.game.canvas.setAttribute('aria-label', '森林數學闖關畫面；請使用方向鍵、WASD 或螢幕方向按鈕移動。');
  }

  createTextures() {
    const explorer = this.make.graphics({ x: 0, y: 0, add: false });
    explorer.fillStyle(0x8d613c).fillRoundedRect(46, 35, 18, 43, 7);
    explorer.fillStyle(0xd6a754).fillRoundedRect(14, 9, 54, 25, 11);
    explorer.fillStyle(0xb6813f).fillRoundedRect(9, 29, 64, 11, 5);
    explorer.fillStyle(0xf2d9a3).fillCircle(41, 44, 34);
    explorer.fillStyle(0x367b82).fillRoundedRect(18, 57, 48, 39, 14);
    explorer.fillStyle(0x285661).fillRoundedRect(18, 85, 19, 13, 5);
    explorer.fillStyle(0x285661).fillRoundedRect(48, 85, 19, 13, 5);
    explorer.fillStyle(0x234b3a).fillCircle(35, 43, 4);
    explorer.fillStyle(0x234b3a).fillCircle(48, 43, 4);
    explorer.fillStyle(0xb96c4c).fillRoundedRect(38, 50, 10, 3, 2);
    explorer.generateTexture('forest-explorer', 82, 104);
    explorer.destroy();

    const sign = this.make.graphics({ x: 0, y: 0, add: false });
    sign.fillStyle(0x775034).fillRoundedRect(81, 66, 18, 69, 7);
    sign.fillStyle(0x9a653d).fillRoundedRect(14, 7, 154, 78, 14);
    sign.lineStyle(4, 0xd2a760).strokeRoundedRect(18, 11, 146, 70, 11);
    sign.fillStyle(0xb67a47).fillCircle(29, 23, 5);
    sign.fillStyle(0xb67a47).fillCircle(153, 23, 5);
    sign.generateTexture('wooden-sign', 182, 142);
    sign.destroy();
  }

  resizeScene(size) {
    const width = Math.max(320, size.width || this.scale.width || 800);
    const height = Math.max(350, size.height || this.scale.height || 600);
    this.viewWidth = width;
    this.viewHeight = height;
    this.physics.world.setBounds(14, 15, width - 28, height - 28);
    this.drawForest(width, height);

    const positions = this.getAnswerPositions(width, height);
    this.answerSigns.forEach(({ sprite, label }, index) => {
      const point = positions[index];
      sprite.setPosition(point.x, point.y);
      const signWidth = width < 620
        ? Math.min(132, Math.max(86, width * 0.27))
        : Math.min(174, Math.max(120, width * 0.17));
      const signHeight = signWidth * 0.78;
      sprite.setDisplaySize(signWidth, signHeight);
      sprite.refreshBody();
      label.style.left = `${(point.x / width) * 100}%`;
      label.style.top = `${((point.y - signHeight * 0.17) / height) * 100}%`;
      label.textContent = String(this.currentQuestion?.options[index] ?? '');
      label.classList.toggle('is-muted', !sprite.visible);
    });

    const playerX = width * 0.5;
    const playerY = height * 0.79;
    if (this.player) {
      this.player.body.reset(playerX, playerY);
      this.player.setPosition(playerX, playerY);
    }
    this.drawRoute(width, height, positions);
    this.updateAnswerLabels();
  }

  getAnswerPositions(width, height) {
    const xs = width < 620 ? [0.19, 0.5, 0.81] : [0.19, 0.5, 0.81];
    const high = height * 0.41;
    return [
      { x: width * xs[0], y: high + (width < 620 ? 12 : 25) },
      { x: width * xs[1], y: high - (width < 620 ? 22 : 58) },
      { x: width * xs[2], y: high + (width < 620 ? 12 : 25) },
    ];
  }

  drawForest(width, height) {
    const g = this.forest;
    g.clear();
    g.fillStyle(0x91c778, 1).fillRect(0, 0, width, height);
    g.fillStyle(0xadd985, 1).fillEllipse(width * 0.54, height * 0.35, width * 1.18, height * 0.54);
    g.fillStyle(0x7eb25f, 1).fillEllipse(width * 0.48, height * 0.82, width * 1.34, height * 0.62);
    g.fillStyle(0x6f9e54, 1).fillEllipse(width * 0.51, height * 1.03, width * 1.5, height * 0.54);

    const treeCount = Math.max(5, Math.floor(width / 115));
    for (let index = 0; index < treeCount; index += 1) {
      const side = index % 2 === 0 ? 0 : 1;
      const x = side === 0 ? 28 + (index % 3) * 28 : width - 28 - (index % 3) * 28;
      const y = 90 + (index % 4) * Math.max(42, height * 0.105);
      const size = Math.min(126, 82 + (index % 3) * 16);
      g.fillStyle(0x795439, 1).fillRoundedRect(x - 13, y + size * 0.33, 26, size * 0.78, 9);
      g.fillStyle(index % 2 ? 0x53894c : 0x477d47, 1).fillCircle(x, y, size * 0.64);
      g.fillStyle(index % 2 ? 0x6a9b52 : 0x5a8d4b, 1).fillCircle(x - size * 0.27, y + size * 0.13, size * 0.4);
      g.fillStyle(0x77a958, 1).fillCircle(x + size * 0.26, y + size * 0.13, size * 0.38);
    }

    for (let index = 0; index < 22; index += 1) {
      const x = 12 + ((index * 79) % Math.max(1, width - 24));
      const y = height * 0.64 + ((index * 31) % Math.max(1, Math.floor(height * 0.31)));
      const color = index % 3 === 0 ? 0xf1d66b : (index % 3 === 1 ? 0xf3ead1 : 0xd59b65);
      g.fillStyle(color, 0.88).fillCircle(x, y, index % 4 === 0 ? 6 : 4);
      g.fillStyle(0x668f4c, 1).fillCircle(x + 7, y + 5, 3);
    }
  }

  drawRoute(width, height, positions) {
    this.route.clear();
    const junction = { x: width * 0.5, y: height * 0.57 };
    const paths = [
      [
        { x: width * 0.5, y: height * 0.86 },
        { x: width * 0.47, y: height * 0.73 },
        { x: width * 0.55, y: height * 0.65 },
        junction,
      ],
      [junction, { x: width * 0.38, y: height * 0.51 }, { x: positions[0].x, y: positions[0].y + 56 }],
      [junction, { x: positions[1].x, y: positions[1].y + 56 }],
      [junction, { x: width * 0.63, y: height * 0.5 }, { x: positions[2].x, y: positions[2].y + 56 }],
    ];
    const roadWidth = Math.max(26, Math.min(62, width * 0.055));
    paths.forEach((path) => {
      this.route.lineStyle(roadWidth, 0xcab77c, 1);
      this.route.beginPath().moveTo(path[0].x, path[0].y);
      path.slice(1).forEach((point) => this.route.lineTo(point.x, point.y));
      this.route.strokePath();
      this.route.lineStyle(3, 0xe9d9a2, 0.76);
      this.route.beginPath().moveTo(path[0].x, path[0].y);
      path.slice(1).forEach((point) => this.route.lineTo(point.x, point.y));
      this.route.strokePath();
    });
    positions.forEach((point) => {
      this.route.fillStyle(0xd8c181, 0.95).fillCircle(point.x, point.y + 58, 8);
    });
  }

  startRun() {
    if (this.phase !== 'menu') return;
    this.phase = 'playing';
    this.busy = false;
    this.showFeedback('沿著小徑前進，碰觸一個答案路標。');
    ui.worldHint.textContent = '方向鍵 / WASD 移動，找到正確路標';
    this.updateInterface();
    this.announce('冒險開始。' + this.currentQuestion.expression + '。');
  }

  togglePause() {
    if (this.phase === 'playing') {
      this.phase = 'paused';
      this.player.body.setVelocity(0, 0);
      this.physics.world.pause();
      ui.worldHint.textContent = '遊戲已暫停';
      this.showFeedback('休息一下也沒關係，按「繼續闖關」回到森林。');
    } else if (this.phase === 'paused') {
      this.phase = 'playing';
      this.physics.world.resume();
      ui.worldHint.textContent = '方向鍵 / WASD 移動，找到正確路標';
      this.showFeedback('繼續沿著小徑找答案。');
    } else {
      return;
    }
    this.updateInterface();
  }

  restartRun() {
    this.physics.world.resume();
    this.phase = 'menu';
    this.levelIndex = 0;
    this.questionIndex = 0;
    this.score = 0;
    this.busy = false;
    this.pressedDirections.clear();
    this.touchDirection = null;
    this.currentQuestion = createQuestion(this.levelIndex);
    this.setQuestionSigns();
    this.showFeedback('答對得 10 分，答錯扣 5 分。準備好就出發！');
    ui.worldHint.textContent = '碰觸正確的路標來蒐集答案';
    this.updateInterface();
  }

  setKeyDirection({ direction, down }) {
    if (down) this.pressedDirections.add(direction);
    else this.pressedDirections.delete(direction);
  }

  setTouchDirection({ direction, down }) {
    this.touchDirection = down ? direction : null;
  }

  update() {
    if (!this.player?.body) return;
    if (this.phase !== 'playing' || this.busy) {
      this.player.body.setVelocity(0, 0);
      return;
    }

    const directions = new Set(this.pressedDirections);
    if (this.touchDirection) directions.add(this.touchDirection);
    let x = 0;
    let y = 0;
    if (directions.has('left')) x -= 1;
    if (directions.has('right')) x += 1;
    if (directions.has('up')) y -= 1;
    if (directions.has('down')) y += 1;
    if (x !== 0 || y !== 0) {
      const vector = new Phaser.Math.Vector2(x, y).normalize().scale(238);
      this.player.body.setVelocity(vector.x, vector.y);
    } else {
      this.player.body.setVelocity(0, 0);
    }
  }

  collectSign(sprite) {
    if (this.phase !== 'playing' || this.busy || !sprite.body.enable) return;
    this.busy = true;
    this.player.body.setVelocity(0, 0);
    const index = sprite.getData('index');
    const isCorrect = sprite.getData('value') === this.currentQuestion.answer;

    if (isCorrect) {
      this.score += 10;
      this.flashRoute(sprite.x, sprite.y);
      this.showFeedback('找到了！答對加 10 分，沿著金色小徑繼續走。', 'correct');
      ui.worldHint.textContent = '+10 分！下一段路亮起來了';
      this.announce(`答對了，加 10 分。目前得分 ${this.score}。`);
      this.updateInterface();
      this.time.delayedCall(900, () => this.advanceQuestion());
    } else {
      this.score -= 5;
      sprite.body.enable = false;
      sprite.setAlpha(0.22);
      this.answerSigns[index].label.classList.add('is-muted');
      this.showFeedback('這個路標不是答案，扣 5 分。再看看剩下的路標。', 'wrong');
      ui.worldHint.textContent = '換一個路標再試試';
      this.announce(`這個答案不正確，扣 5 分。目前得分 ${this.score}。`);
      this.updateInterface();
      this.time.delayedCall(620, () => {
        this.resetPlayerToStart();
        this.busy = false;
        ui.worldHint.textContent = '再碰觸一個答案路標';
      });
    }
  }

  flashRoute(x, y) {
    this.routeGlow.clear();
    this.routeGlow.lineStyle(15, 0xf5dc68, 0.95);
    this.routeGlow.beginPath().moveTo(this.player.x, this.player.y).lineTo(x, y).strokePath();
    this.routeGlow.fillStyle(0xffed87, 0.95).fillCircle(x, y, 22);
    this.routeGlow.setVisible(true).setAlpha(0);
    this.tweens.add({
      targets: this.routeGlow,
      alpha: 1,
      duration: 260,
      yoyo: true,
      repeat: 1,
      onComplete: () => this.routeGlow.setVisible(false),
    });
  }

  advanceQuestion() {
    this.questionIndex += 1;
    this.busy = false;
    this.resetPlayerToStart();
    if (this.questionIndex >= QUESTIONS_PER_LEVEL) {
      this.levelIndex += 1;
      if (this.levelIndex >= LEVELS.length) {
        this.finishRun();
        return;
      }
      this.questionIndex = 0;
      this.currentQuestion = createQuestion(this.levelIndex);
      this.showFeedback(`通過上一段旅程！接下來是${LEVELS[this.levelIndex].name}。`, 'correct');
    } else {
      this.currentQuestion = createQuestion(this.levelIndex);
      this.showFeedback('新的題目出現了，看看哪個路標正確。');
    }
    this.setQuestionSigns();
    this.updateInterface();
    ui.worldHint.textContent = '沿著小徑前進，碰觸正確路標';
    this.announce(`第 ${this.levelIndex + 1} 關，${LEVELS[this.levelIndex].name}。${this.currentQuestion.expression}`);
  }

  finishRun() {
    this.phase = 'complete';
    this.busy = false;
    this.player.body.setVelocity(0, 0);
    this.showFeedback('太棒了，你完成五關數學旅程！', 'correct');
    ui.worldHint.textContent = '五段小徑都走完了';
    this.updateInterface();
    this.announce(`恭喜完成五關，最後得分 ${this.score}。`);
  }

  resetPlayerToStart() {
    if (!this.player?.body) return;
    const x = this.viewWidth * 0.5;
    const y = this.viewHeight * 0.79;
    this.player.body.reset(x, y);
    this.player.setPosition(x, y);
  }

  setQuestionSigns() {
    const positions = this.getAnswerPositions(this.viewWidth, this.viewHeight);
    this.answerSigns.forEach(({ sprite, label }, index) => {
      sprite.setPosition(positions[index].x, positions[index].y);
      sprite.setData('value', this.currentQuestion.options[index]);
      sprite.body.enable = true;
      sprite.setAlpha(1).setVisible(true).clearTint();
      sprite.refreshBody();
      label.textContent = String(this.currentQuestion.options[index]);
      label.classList.remove('is-muted');
    });
    ui.answerList.innerHTML = '';
    this.currentQuestion.options.forEach((answer, index) => {
      const item = document.createElement('li');
      item.textContent = `路標 ${index + 1}：${answer}`;
      ui.answerList.append(item);
    });
  }

  updateAnswerLabels() {
    if (!this.answerSigns.length || !this.currentQuestion) return;
    this.answerSigns.forEach(({ label }, index) => {
      label.textContent = String(this.currentQuestion.options[index]);
    });
  }

  updateInterface() {
    const level = Math.min(this.levelIndex, LEVELS.length - 1);
    const completeCount = this.levelIndex * QUESTIONS_PER_LEVEL + this.questionIndex;
    ui.score.textContent = String(this.score);
    ui.levelName.textContent = `第 ${level + 1} 關・${LEVELS[level].name}`;
    ui.questionCount.textContent = this.phase === 'complete'
      ? '五關完成'
      : `第 ${Math.min(this.questionIndex + 1, QUESTIONS_PER_LEVEL)} 題 / ${QUESTIONS_PER_LEVEL}`;
    ui.equation.textContent = this.phase === 'complete' ? '旅程完成！' : (this.currentQuestion?.expression ?? '準備開始');
    ui.roundProgressText.textContent = this.phase === 'complete' ? '3 / 3' : `${this.questionIndex} / ${QUESTIONS_PER_LEVEL}`;
    ui.roundProgressFill.style.width = this.phase === 'complete' ? '100%' : `${(this.questionIndex / QUESTIONS_PER_LEVEL) * 100}%`;
    ui.trackSteps.forEach((step, index) => {
      step.classList.toggle('is-active', index === level && this.phase !== 'complete');
      step.classList.toggle('is-done', index < level || this.phase === 'complete');
    });
    ui.start.hidden = this.phase !== 'menu';
    ui.pause.disabled = !['playing', 'paused'].includes(this.phase);
    ui.pause.textContent = this.phase === 'paused' ? '繼續' : '暫停';
    ui.pause.setAttribute('aria-label', this.phase === 'paused' ? '繼續遊戲' : '暫停遊戲');
    ui.pauseOverlay.hidden = this.phase !== 'paused';
    ui.resultOverlay.hidden = this.phase !== 'complete';
    ui.finalScore.textContent = String(this.score);
    ui.resultTitle.textContent = this.score >= 100 ? '森林守護者！' : '五關旅程完成！';
    ui.resultCopy.textContent = this.score >= 100 ? '你用數學打開了森林裡的每一條小徑。' : '謝謝你陪小探險家走完五段數學旅程。';
    const totalProgress = this.phase === 'complete' ? 100 : (completeCount / (LEVELS.length * QUESTIONS_PER_LEVEL)) * 100;
    document.querySelector('.level-track').setAttribute('aria-label', `五關進度，已完成 ${this.levelIndex} 關`);
    document.querySelector('.forest-world').setAttribute('aria-label', `森林闖關遊戲區，第 ${level + 1} 關，${LEVELS[level].name}，總進度 ${Math.round(totalProgress)}%`);
  }

  showFeedback(message, tone = '') {
    ui.feedback.textContent = message;
    ui.feedback.classList.toggle('is-correct', tone === 'correct');
    ui.feedback.classList.toggle('is-wrong', tone === 'wrong');
  }

  announce(message) {
    ui.liveStatus.textContent = '';
    window.setTimeout(() => { ui.liveStatus.textContent = message; }, 30);
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-canvas',
  backgroundColor: '#91c778',
  scale: {
    parent: 'game-canvas',
    mode: Phaser.Scale.RESIZE,
    width: 1000,
    height: 720,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  render: { antialias: true, pixelArt: false, roundPixels: true },
  scene: [ForestMathScene],
});

const emitToScene = (event, payload) => game.events.emit(event, payload);
ui.start.addEventListener('click', () => emitToScene('start-run'));
ui.pause.addEventListener('click', () => emitToScene('pause-run'));
document.querySelector('#resume-game').addEventListener('click', () => emitToScene('pause-run'));
document.querySelector('#play-again').addEventListener('click', () => emitToScene('restart-run'));

const keyDirections = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
};

window.addEventListener('keydown', (event) => {
  const direction = keyDirections[event.key];
  if (direction) {
    event.preventDefault();
    emitToScene('move-key', { direction, down: true });
    return;
  }
  if (event.repeat) return;
  if (event.key === 'Enter' || event.key === ' ') {
    const scene = game.scene.getScene('ForestMathScene');
    if (scene.phase === 'menu') emitToScene('start-run');
    else if (scene.phase === 'paused') emitToScene('pause-run');
  }
  if (event.key === 'Escape' || event.key.toLowerCase() === 'p') emitToScene('pause-run');
});

window.addEventListener('keyup', (event) => {
  const direction = keyDirections[event.key];
  if (direction) emitToScene('move-key', { direction, down: false });
});

document.querySelectorAll('.move-button').forEach((button) => {
  const direction = button.dataset.direction;
  const release = () => {
    emitToScene('move-touch', { direction, down: false });
  };
  button.addEventListener('pointerdown', (event) => {
    button.setPointerCapture(event.pointerId);
    emitToScene('move-touch', { direction, down: true });
  });
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
  button.addEventListener('click', (event) => {
    emitToScene('move-touch', { direction, down: true });
    window.setTimeout(() => emitToScene('move-touch', { direction, down: false }), 180);
  });
});
