const intro = document.getElementById('intro');
const start = document.getElementById('start-intro');
const skip = document.getElementById('skip-intro');
const replay = document.getElementById('play-intro');
const status = document.getElementById('intro-status');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let timer;
function finishIntro() {
  clearTimeout(timer);
  const shouldFocus = document.activeElement === skip || document.activeElement === start;
  intro.dataset.state = 'done';
  start.hidden = true;
  skip.hidden = true;
  status.textContent = 'Mercoleterry. Passata provinciale. Scorri per scoprire la nostra storia.';
  if (shouldFocus) intro.querySelector('.intro-scroll').focus({preventScroll:true});
}
function playIntro() {
  clearTimeout(timer);
  intro.dataset.state = 'ready';
  // Force a fresh animation when the intro is replayed.
  void intro.offsetWidth;
  start.hidden = true;
  skip.hidden = false;
  intro.dataset.state = 'playing';
  status.textContent = 'Intro in corso.';
  skip.focus({preventScroll:true});
  if (reduced.matches) finishIntro();
  else timer = setTimeout(finishIntro, 4600);
}
start.addEventListener('click', playIntro);
skip.addEventListener('click', finishIntro);
replay.addEventListener('click', () => {
  intro.scrollIntoView({behavior:'instant',block:'start'});
  playIntro();
});
intro.addEventListener('keydown', e => {if(e.key === 'Escape' && intro.dataset.state === 'playing') finishIntro();});
