export function create() {
  return {
    position: [50,50],
    velocity: [0,0],
    brain: {
      weights: new Array(2)
        .fill(0).map(e=>(new Array(4)
        .fill(0).map( e => (Math.random() - 0.5)))),
      bias: new Array(4).fill(0).map(e => 1 * (Math.random() - 0.5)),
    },
    render: function(context) {
      let color = '#ffe554';
      let size = 3;
      let thickness = 3;

      context.lineCap = 'round';
      context.beginPath();
      context.fillStyle = color;
      context.strokeStyle = color;
      context.lineWidth = thickness;
      context.arc(this.position[0], this.position[1], size, 0, Math.PI * 2);
      context.stroke();

      this.physics();
    },
    physics: function() {
      this.position[0] += this.velocity[0];
      this.position[1] += this.velocity[1];

      this.velocity[1] += 0.4;

      if (this.position[0] > 500) {
        this.position[0] = 0;
      }
      if (this.position[0] < 0) {
        this.position[0] = 500;
      }
      if (this.position[1] > 495) {
        this.position[1] = 495;
        this.velocity = activation(
          [this.position[0], this.position[1], this.velocity[0], this.velocity[1]],
          this.brain.weights,
          this.brain.bias
        );

        this.velocity = [this.velocity[0] * 100, this.velocity[1] * 100]
      }
    }
  }
}

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