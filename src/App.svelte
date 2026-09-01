<script>
  import About from "./about/About.svelte";
</script>

<About />

<section id="center"></section>

<div class="ticks"></div>
<section id="spacer"></section>

<section class="footer">
  <a href="https://x.com/j0_dev" target="_blank" rel="noreferrer"> X </a>
  <span>•</span>
  <a
    href="https://github.com/Jayesh-11/workpad"
    target="_blank"
    rel="noreferrer"
  >
    GitHub
  </a>
  <span>•</span>
  <a href="https://j0dev.com/" target="_blank" rel="noreferrer">
    By Jayesh Vyavahare
  </a>
  <span>•</span>
  <a
    href="https://github.com/Jayesh-11/workpad/releases"
    target="_blank"
    rel="noreferrer"
  >
    Changelog
  </a>
  <span>•</span>
  <button command="show-modal" commandfor="about-dialog">About</button>
</section>
