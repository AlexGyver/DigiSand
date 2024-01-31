const amount = 128;
let particles = [];

const WID = 100*5;
const HEI = 100*5;
const R = 12;
const D = R * 2;
const damp = 0.8;

class Vect {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

function setup() {
    createCanvas(WID, HEI);

    for (let n = 0; n < amount; n++) {
        particles.push(new Particle(new createVector(random(WID), random(HEI))));
    }
    // particles.push(new Particle(new createVector(R, HEI / 2), new createVector(0.5, 0)));
    // particles.push(new Particle(new createVector(WID-R, HEI / 2+R), new createVector(-0.5, 0)));
}

function draw() {
    background(220);

    if (mouseIsPressed) {
        particles.push(new Particle(new createVector(mouseX, mouseY)))
    }

    let xx = min(mouseX, width) - WID / 2;
    let yy = min(mouseY, height) - HEI / 2;
    let G = createVector(xx / 50 * 1, yy / 50 * 1);
    for (let p of particles) {
        p.move(G);
        p.collision(G);
        p.vel.add(G);
        p.edges();
        p.show();
        // stroke(0);
        // line(p.pos.x, p.pos.y, p.pos.x+p.vel.x*50,p.pos.y+p.vel.y*50)
    }

    if (frameCount % 20 == 0) {
        // for (let i in particles) {
        //     let p = particles[i];
        //     if (p.pos.x >= WID - 25 * 3 && p.pos.y >= HEI - 25 * 2.5) {
        //         particles.splice(i, 1);
        //         break;
        //     }
        // }
    }
}

class Particle {
    constructor(pos, vel = null) {
        this.pos = pos;
        this.vel = vel || createVector(random(-1, 1), random(-1, 1));
    }

    move() {
        this.vel.mult(damp);
        this.pos.add(this.vel);
    }

    edges() {
        if (this.pos.x < R) {
            this.pos.x = R;
            this.vel.x = Math.abs(this.vel.x) * 0;
        } else if (this.pos.x > width - R - 1) {
            this.pos.x = width - R - 1;
            this.vel.x = Math.abs(this.vel.x) * -0;
        }

        if (this.pos.y < R) {
            this.pos.y = R;
            this.vel.y = Math.abs(this.vel.y) * 0;
        } else if (this.pos.y > height - R - 1) {
            this.pos.y = height - R - 1;
            this.vel.y = Math.abs(this.vel.y) * -0;
        }
    }

    collision() {
        let tx = Math.floor(this.pos.x / D);
        let ty = Math.floor(this.pos.y / D);
        for (let neigh of particles) {
            let ox = abs(Math.floor(neigh.pos.x / D) - tx);
            let oy = abs(Math.floor(neigh.pos.y / D) - ty);

            if (this != neigh && ox <= 1 && oy <= 1) {
                let norm = new Vect(neigh.pos.x - this.pos.x, neigh.pos.y - this.pos.y);
                let dsq = norm.x * norm.x + norm.y * norm.y;
                if (dsq && dsq < D * D) {
                    let ds = Math.sqrt(dsq);
                    let norm1 = new Vect(norm.x / ds, norm.y / ds);
                    let rel = new Vect(neigh.vel.x - this.vel.x, neigh.vel.y - this.vel.y);
                    let scalar = norm1.x * rel.x + norm1.y * rel.y;
                    let proj = new Vect(norm1.x * scalar, norm1.y * scalar);

                    this.vel.x += proj.x;
                    this.vel.y += proj.y;
                    neigh.vel.x -= proj.x;
                    neigh.vel.y -= proj.y;

                    this.vel.x *= damp;
                    this.vel.y *= damp;
                    neigh.vel.x *= damp;
                    neigh.vel.y *= damp;

                    let shift = new Vect(norm1.x * (D - ds) / 2, norm1.y * (D - ds) / 2);
                    this.pos.x -= shift.x;
                    this.pos.y -= shift.y;
                    neigh.pos.x += shift.x;
                    neigh.pos.y += shift.y;
                }
            }
        }
    }

    show() {
        ellipse((this.pos.x), (this.pos.y), R * 2);
    }
}