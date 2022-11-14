<script>
	import { onMount } from "svelte";
	import Blob from "../components/Blob.svelte";
  import { create } from "../scripts/blob";

  let innerWidth = 0;
  let innerHeight = 0;
  let canvas;
  let rect;
  let frame;

  let context;

  let blobs = []

  onMount(() => {
    context = canvas.getContext('2d');
    rect = canvas.getBoundingClientRect();

    frame = createLoop(render);
  });

  let m = { x: 0, y: 0 };
  function handleMousemove(event) {
		m.x = event.clientX - rect.left;
		m.y = event.clientY - rect.top;
	}

  function handleClick(event) {
    blobs.push(create());
  }

  function render() {
    context.save();
    context.clearRect(0, 0, 500, 500);
    try {
      blobs.forEach((entity) => {
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
    on:click={handleClick}
    width={500}
    height={500}>
  </canvas>
</div>

{#each new Array(0) as blob}
<Blob
  bind:this={blob}
  startPosition={[Math.random() * 500, Math.random() * 400]}
  startVelocity={[(Math.random() - 0.5) * 5, Math.random() * 5]}
  mx={m.x}
  my={m.y}
/>
{/each}