<script>
	import { onMount } from "svelte";
  import { renderable } from "../routes/+server";

  

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

  //input: 2x1

  //hidden: 2x10
  let weights1 = new Array(4)
  .fill(0)
  .map(e=>(new Array(2)
  .fill(0)
  .map( e => Math.random() - 0.5)));

  let biases = new Array(4).fill(0).map(e => 100 * (Math.random() - 0.5));

  renderable((context) => {

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
    if (y > 497) {
      y = 497;
      velocity = scale(
          normalize(plus(wSum([
            x/500,
            y/500,
            mx,
            my
          ], weights1), biases)),
      5);
      velocity[1] > 0 ? velocity[1] *= -1: velocity[1] = velocity[1];
    }
  });

  function scale(v, m) {
    return [v[0] * m, v[1] * m];
  }

  function plus(a, b) {
    return a.map((val, i) => {
      return val + b[i];
    })
  }

  function normalize(v) {
    const mag = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
    return [v[0] / mag, v[1] / mag];
  }

  function wSum(input, weights) {
    const sum = new Array(weights[0].length).fill(0);
    for (let h = 0; h < weights[0].length; h++) {
      for (let i = 0; i < input.length; i++) {
        sum[h] += weights[i][h] * input[i];
      }
    }

    return sum;
  }

  function dot (A, B) {
    var result = new Array(A.length).fill(0).map(row => new Array(B[0].length).fill(0));

    return result.map((row, i) => {
      return row.map((val, j) => {
        return A[i].reduce((sum, elm, k) => sum + (elm*B[k][j]) ,0)
      })
    })
}
</script>