<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from './assets/vite.svg'
  import heroSvg from './assets/hero.svg'
  import heroImg from './assets/hero.png'
  import Features from './lib/Features.svelte'
</script>

<section id="center">
  <div class="hero">
    <div class="title"><img src={heroSvg} class="hero-svg" alt="Svelte logo" /><h1>Workpad</h1></div>
    <p>Your private notes, snippets, and more, saved locally</p>
  </div>
  <Features />
</section>

<div class="ticks"></div>

<section id="next-steps">
  <div id="social">
    <div class="keyboard-shortcuts">
      <p><kbd>⌘</kbd> + <kbd>/</kbd> - open keyboard shortcuts</p>
      <p><kbd>⌘</kbd> + <kbd>K</kbd> - open the search bar</p>
      <p><kbd>⌘</kbd> + <kbd>N</kbd> - create a new note</p>
      <p><kbd>⌘</kbd> + <kbd>S</kbd> - save the current note</p>
    </div>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>

<section class="footer">
  <a href="https://x.com/j0_dev" target="_blank" rel="noreferrer">
    X
  </a>
  <span>•</span>
  <a href="https://github.com/j0dev/workpad" target="_blank" rel="noreferrer">
    GitHub
  </a>
  <span>•</span>
  <a href="https://j0dev.com/" target="_blank" rel="noreferrer">
    By Jayesh Vyavahare
  </a>
</section>