p5.disableFriendlyErrors = true;
let N_PARTICLES = 50;
let particles = [];
let grid;

const w = 500;
const h = 500;

function setup() {
    createCanvas(w, h);

    grid = new Grid(w, h, 22);

    for (let n = 0; n < N_PARTICLES; n++) {
        let particle = new Particle(new createVector(random(w), random(h)))
        particles.push(particle);
        grid.addParticle(particle);
    }
}

function draw() {
    background(220);

    if (mouseIsPressed) {
        for (let n = 0; n < 5; n++) {
            let particle = new Particle(new createVector(mouseX + random(-1, 1), mouseY + random(-1, 1)))
            particles.push(particle);
            grid.addParticle(particle);
        }
    }

    for (let p of particles) {
        let neighbors = grid.getNeighbors(p)
        p.collision(neighbors)
        p.move();
    }

    for (let p of particles) {
        let px = (p.pos.x / grid.cellSize) | 0
        let py = (p.pos.y / grid.cellSize) | 0

        if (px == 0 || px == grid.numCols - 1 || py == 0 || py == grid.numRows - 1) {
            p.edges();
        }

        if (px != p.gridCell.col || py != p.gridCell.row) {
            grid.removeParticle(p)
            grid.addParticle(p)
        }
    }

    noFill();
    for (let p of particles) {
        p.show();
    }
}

class Particle {
    constructor(pos) {
        this.pos = pos;
        this.velocity = createVector(random(-1.25, 1.25), random(-1.25, 1.25));
        this.acceleration = createVector(0, 0.1);

        this.mass = random(3, 10)
        this.radius = this.mass;
        this.maxSpeed = 9;

        this.queryId = -1;
    }

    move(newPos) {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed); // Limit the particle's speed
        this.pos.add(this.velocity);
    }

    edges() {
        if (this.pos.x - this.radius < 0) {
            this.pos.x = this.radius; // Prevent from leaving the canvas from the left side
            this.velocity.x *= -1;
        } else if (this.pos.x + this.radius > width) {
            this.pos.x = width - this.radius; // Prevent from leaving the canvas from the right side
            this.velocity.x *= -1;
        }

        if (this.pos.y - this.radius < 0) {
            this.pos.y = this.radius; // Prevent from leaving the canvas from the top
            this.velocity.y *= -1;
        } else if (this.pos.y + this.radius > height) {
            this.pos.y = height - this.radius; // Prevent from leaving the canvas from the bottom
            this.velocity.y *= -1;
        }
    }

    collision(otherParticles) {
        let counter = 0
        for (let n = 0; n < otherParticles.length; n++) {
            let other = otherParticles[n]
            if (this != other) {
                let distance = squareDist(this.pos, other.pos);
                let minDistance = (this.radius + other.radius) ** 2;

                if (distance <= minDistance) {
                    // Calculate collision response
                    let normal = p5.Vector.sub(other.pos, this.pos).normalize();
                    let relativeVelocity = p5.Vector.sub(other.velocity, this.velocity);
                    let impulse = p5.Vector.mult(normal, p5.Vector.dot(relativeVelocity, normal));

                    // Apply repulsion force to prevent sticking
                    let repulsion = p5.Vector.mult(normal, minDistance - distance + 2);

                    // Update velocities
                    this.velocity.add(p5.Vector.div(impulse, this.mass));
                    other.velocity.sub(p5.Vector.div(impulse, other.mass));

                    // Apply repulsion force
                    this.pos.sub(p5.Vector.div(repulsion, this.mass ** 2));
                    other.pos.add(p5.Vector.div(repulsion, other.mass ** 2));
                }
            }
            counter++
        }
        return counter
    }

    show() {
        ellipse(this.pos.x, this.pos.y, this.radius * 2);
    }
}

/*
  The lookup grid
*/
class Grid {
    constructor(i, t, s) {
        (this.cellSize = s),
            (this.numCols = Math.ceil(i / s)),
            (this.numRows = Math.ceil(t / s)),
            (this.cells = []);
        for (let e = 0; e < this.numCols; e++) {
            this.cells[e] = [];
            for (let l = 0; l < this.numRows; l++) {
                this.cells[e][l] = [];
            }
        }

        this.queryIds = 0;
    }

    addParticle(i) {
        //console.log(i.pos.x, i.pos.y)
        let t = Math.floor(i.pos.x / this.cellSize);
        let s = Math.floor(i.pos.y / this.cellSize);
        //console.log(t, s)

        this.cells[t][s].push(i)
        i.gridCell = {
            col: t,
            row: s
        }
    }

    removeParticle(i) {
        let {
            col: t,
            row: s
        } = i.gridCell
        let e = this.cells[t][s];
        let l = e.indexOf(i);
        e.splice(l, 1);
    }

    determineCell(i) {
        let t = Math.floor(i.pos.x / this.cellSize);
        let s = Math.floor(i.pos.y / this.cellSize);
        return {
            col: t,
            row: s
        }
    }

    getNeighbors(particle) {
        let top_left = [
            floor((particle.pos.x - particle.radius) / this.cellSize),
            floor((particle.pos.y - particle.radius) / this.cellSize),
        ]

        let bottom_right = [
            floor((particle.pos.x + particle.radius) / this.cellSize),
            floor((particle.pos.y + particle.radius) / this.cellSize),
        ]

        let neighbors = []
        let queryId = this.queryIds++

        for (let i = top_left[0]; i <= bottom_right[0]; i++) {
            for (let j = top_left[1]; j <= bottom_right[1]; j++) {
                if (i < 0 || j < 0 || i >= this.numCols || j >= this.numRows) continue
                let c = this.cells[i][j]
                for (let p of c) {
                    // don't add the particle itself
                    if (p != particle && queryId != p.queryId) { neighbors.push(p); p.queryId = queryId; }
                }
            }
        }

        return neighbors
    }
}

function squareDist(p1, p2) {
    return (p1.x - p2.x) ** 2 + (p2.y - p1.y) ** 2
}
