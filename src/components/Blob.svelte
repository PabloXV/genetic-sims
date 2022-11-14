<script>
	import { onDestroy, onMount } from "svelte";
  import { renderable, key } from "../routes/+server";

  export let startPosition = [50, 50];
  export let startVelocity = [0, 0];
  export let color = '#ffe554';
	export let size = 3;
	export let thickness = 3;

  let x = startPosition[0];
	let y = startPosition[1];
  let velocity = startVelocity;

  let gravity = 0.4;

  export let mx = 0;
  export let my = 0;

  //input: 5x1
  let inp = [x, y, velocity[0], mx, my];

  //output: 2x1
  let outp = [x, y];

  //hidden: 2x10
  let weights = new Array(outp.length)
  .fill(0)
  .map(e=>(new Array(inp.length)
  .fill(0)
  .map( e => (Math.random() - 0.5))));

  let biases = new Array(inp.length).fill(0).map(e => 2 * (Math.random() - 0.5));

  const rndr = (context) => {
    x += velocity[0];
    y += velocity[1];

    context.lineCap = 'round';
    context.beginPath();
    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.arc(x, y, size, 0, Math.PI * 2);
    context.stroke();

    velocity[1] += gravity;

    if (x > 500) {
      x = 0;
    }
    if (x < 0) {
      x = 500;
    }
    if (y < 0) {
      if (velocity[1] < 0) {
        velocity[1] *= -1;
      }
    }

    if (y > 497) {
      y = 497;
      velocity = activation([
        x,
        y,
        velocity[0],
        mx,
        my
      ], weights, biases);

      velocity = [velocity[0] * 1000, velocity[1] * 1000];
    }
  }

  export const rm = renderable(rndr);

  onDestroy(() => {
    rm();
  })

  function activation(input, weights, bias) {
    const out = [];

    for (let r = 0; r < weights.length; r++) {
      const x = dot(weights[r], input) + bias[r];
      out.push(
        1 / (1 + (Math.E ^ (-x)))
      );
    }

    return out;
  }

  function dot (A, B) {
    let sum = 0;
    for(let i = 0; i < A.length; i++) {
      sum += A[i] * B[i];
    }
    return sum;
  }
</script>