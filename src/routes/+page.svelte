<script>
	import { onMount, setContext } from "svelte";
	import Blob from "../components/Blob.svelte";
  import { key } from "./+server.js";

  let innerWidth = 0;
  let innerHeight = 0;
  let canvas;
  let frame;

  let context;
  let listeners = [];

  onMount(() => {
    context = canvas.getContext('2d');

    frame = createLoop(render);
  });

  let m = { x: 0, y: 0 };
  function handleMousemove(event) {
		m.x = event.clientX;
		m.y = event.clientY;
	}

  setContext(key, {
		add: (entity) => listeners.push(entity)
	});

  function render() {
    context.save();
    context.clearRect(0, 0, 500, 500);
    try {
      listeners.forEach((entity) => {
        entity.render(context);
      });
    } catch (err) {
      console.log(err);
      cancelAnimationFrame(frame);
    }

    context.restore();
  }

  function createLoop (fn) {
		(function loop() {
			frame = requestAnimationFrame(loop);
			fn();
		})();
		return () => {
			cancelAnimationFrame(frame);
		};
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class=" bg-slate-800 absolute w-screen h-screen">
  <canvas class="shadow-lg mx-auto my-72"
    bind:this={canvas}
    on:mousemove={handleMousemove}
    width={500}
    height={500}>
  </canvas>
</div>

{#each new Array(10) as _}
<Blob
  startPosition={[Math.random() * 500, Math.random() * 400]}
  startVelocity={[(Math.random() - 0.5) * 5, Math.random() * 5]}
  mx={m.x}
  my={m.y}
/>
{/each}