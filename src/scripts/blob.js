export function create(clone) {
  let brain;
  if (clone) {
    brain = newBrain(clone.brain.weights, clone.brain.bias);
  } else {
    brain = {
      weights: new Array(2)
        .fill(0).map(e=>(new Array(4)
        .fill(0).map( e => 0.1 * (Math.random() - 0.5)))),
      bias: new Array(4).fill(0).map(e => 0.1 * (Math.random() - 0.5)),
    }
  }
  
  return {
    position: [Math.random() * 500, 500],
    velocity: [0,0],
    mousePosition: [0,0],
    birthday: Date.now(),
    lastSon: Date.now(),
    brain: brain,
    render: function(context, visible) {
      let color = '#facc15';
      let size = 3;
      let thickness = 4;

      if (visible) {
        context.lineCap = 'round';
        context.beginPath();
        context.fillStyle = color;
        context.strokeStyle = color;
        context.lineWidth = thickness;
        context.arc(this.position[0], this.position[1], size, 0, Math.PI * 2);
        context.stroke();
      }

      this.physics();
    },
    physics: function() {
      this.position[0] += this.velocity[0];
      this.position[1] += this.velocity[1];

      this.velocity[1] += 0.4;

      if (this.position[0] > 500) {
        this.position[0] = 500;
        this.velocity[0] = -0.9 * this.velocity[0];
      }
      if (this.position[0] < 0) {
        this.position[0] = 0;
        this.velocity[0] = -0.9 * this.velocity[0];
      }
      if (this.position[1] > 495) {
        this.position[1] = 495;
        this.velocity = activation(
          [this.position[0], this.position[1], this.mousePosition[0], this.mousePosition[1]],
          this.brain.weights,
          this.brain.bias
        );

        this.velocity = [this.velocity[0] * 30, this.velocity[1] * 30]
      }
    }
  }
}

function newBrain(weights, bias) {
  const newWeights= weights.map(e=>(
    e.map(
      e => e + 0.01 * (Math.random() - 0.5))));
  const newBias= bias.map(e  => e + 0.01 * (Math.random() - 0.5))

  return {
    weights: newWeights,
    bias: newBias
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