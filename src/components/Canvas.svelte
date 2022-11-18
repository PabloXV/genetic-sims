<script>
	import { onMount } from "svelte";
  import { create } from "../scripts/blob";

  let canvas;
  let rect;
  let frame;

  let context;

  let blobs = []
  let numBlobs = 0;

  onMount(() => {
    context = canvas.getContext('2d');
    rect = canvas.getBoundingClientRect();

    frame = createLoop(render);
  });

  let mousePosition = [0, 0];
  function handleMousemove(event) {
		mousePosition[0] = event.clientX - rect.left;
		mousePosition[1] = event.clientY - rect.top;
	}

  function handleClick(event) {
    goalPosition[0] = mousePosition[0];
    goalPosition[1] = mousePosition[1];
    blobs.push(create());
  }

  const goalPosition = [250, 450]
  const lastMove = Date.now();

  function render() {
    context.save();
    context.clearRect(0, 0, 500, 500);

    let color = '#facc15';
    let size = 30;
    let thickness = 2;

    context.lineCap = 'round';
    context.beginPath();
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.arc(goalPosition[0], goalPosition[1], size, 0, Math.PI * 2);
    context.stroke();

    if (Date.now() - lastMove > 100) {
      goalPosition[0] += (Math.random() - 0.5);
      goalPosition[1] += (Math.random() - 0.5);
    }

    goalPosition[0] = mousePosition[0];
    goalPosition[1] = mousePosition[1];

    if (goalPosition[0] > 500) {
      goalPosition[0] = 500;
    }
    if (goalPosition[0] < 0) {
      goalPosition[0] = 0;
    }
    if (goalPosition[1] > 500) {
      goalPosition[1] = 500;
    }
    if (goalPosition[1] < 0) {
      goalPosition[1] = 0;
    }

    try {
      blobs.forEach((blob, i) => {
        blob.mousePosition = goalPosition;
        blob.render(context, true);

        if ( Date.now() - blob.lastSon > 250 && dist(blob.position, goalPosition) < size && blobs.length < 1000) {
          const son = create(blob);
          blobs.push(son);
          blob.lastSon = Date.now();
          blob.birthday = Date.now();
        }

        if (Date.now() - blob.birthday > 3000 || blob.position[1] < 0) {
          blobs.splice(i, 1);
        }

        if (blobs.length < 100) {
          blobs.push(create());
        }
      });
    } catch (err) {
      console.log(err);
      cancelAnimationFrame(frame);
    }

    context.restore();
    numBlobs = blobs.length;
  }

  function dist(p1, p2) {
    const dist = Math.sqrt(
      (p2[0]-p1[0])*(p2[0]-p1[0]) + 
      (p2[1]-p1[1])*(p2[1]-p1[1])
    );

    return dist;
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

<div class=" bg-slate-800 absolute w-screen h-screen">
  <canvas class="shadow-lg mx-auto my-72"
    bind:this={canvas}
    on:mousemove={handleMousemove}
    on:click={handleClick}
    width={500}
    height={500}>
  </canvas>
  <div class=" text-yellow-400 mx-auto text-center text-6xl">{numBlobs}</div>
</div>