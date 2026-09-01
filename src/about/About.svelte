<script>
  import heroSvg from "../assets/hero.svg";
  import Features from "../lib/Features.svelte";
</script>

<dialog id="about-dialog" class="about-dialog">
  <section id="center">
    <div class="hero">
      <div class="title">
        <img src={heroSvg} class="hero-svg" alt="Svelte logo" />
        <h1>Workpad</h1>
      </div>
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
        <p><kbd>⌘</kbd> + <kbd>U</kbd> - create a new note</p>
        <p><kbd>⌘</kbd> + <kbd>S</kbd> - save the current note</p>
      </div>
    </div>
  </section>
  <button commandfor="about-dialog" command="close">Close</button>
</dialog>
