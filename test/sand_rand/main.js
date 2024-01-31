
function ui_get(name) {
    return ui.getValue(name);
}
function ui_set(name, value) {
    return ui.setValue(name, value);
}
class Matrix {
    constructor(size, w, h, cx, cy) {
        this.size = size;
        this.w = w;
        this.h = h;
        this.cx = cx;
        this.cy = cy;
        this.angle = 0;
        this.mx = [];
        this.clear();
    }
    set(x, y) {
        this.mx[y][x] = 1;
    }
    wall(x, y) {
        this.mx[y][x] = 2;
    }
    clear() {
        this.mx = [];
        for (let i = 0; i < this.h; i++) {
            let row = [];
            for (let yy = 0; yy < this.w; yy++) row.push(0);
            this.mx.push(row);
        }
    }
    rotate(angle) {
        this.angle = angle;
    }
    show() {
        push();
        translate(this.cx, this.cy);
        rotate(this.angle);
        stroke(0);
        strokeWeight(1);
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                switch (this.mx[y][x]) {
                    case 0: fill('white'); break;
                    case 1: fill('red'); break;
                    case 2: fill('green'); break;
                }
                rect(x * this.size - this.w * this.size / 2, y * this.size - this.h * this.size / 2, this.size, this.size);
            }
        }
        pop();
    }
};
class Brick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
};
class Dir {
    constructor(dir) {
        this.dir = (dir + 8) % 8;
        this.x = Dir.shift[this.dir][0];
        this.y = Dir.shift[this.dir][1];
    }

    static shift = [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
    ];
};

class Box {
    constructor(w, h) {
        this.map = Array.from(Array(h), () => new Array(w).fill(0));
        this.w = w;
        this.h = h;
    }

    step(angle) {
        while (angle < 0) angle += 360;
        angle %= 360;
        angle = Math.round(angle / 23);  // 0..15
        angle %= 16;

        let qw = Math.floor(angle / 4);
        let dirs = [null, null, null];
        let dirlen = 0;

        let cur = new Dir(qw * 2);
        let next = new Dir((qw + 1) * 2);
        // let prev = new Dir((qw - 1) * 2);
        let diag = new Dir(qw * 2 + 1);

        if (angle % 4 == 0) {
            dirlen = 1;
            dirs[0] = cur;
        } else if (angle % 2 == 0) {
            dirlen = 3;
            dirs[0] = diag;
            if (random() > 0.5) {
                dirs[1] = cur;
                dirs[2] = next;
            } else {
                dirs[1] = next;
                dirs[2] = cur;
            }
        } else {
            dirlen = 3;
            switch (angle) {
                case 1: case 5: case 9: case 13:
                    // if (random() > 0.5) {
                    dirs[0] = cur;
                    dirs[1] = diag;
                    // } else {
                    //     dirs[1] = cur;
                    //     dirs[0] = diag;
                    // }
                    dirs[2] = next;
                    break;
                case 3: case 7: case 11: case 15:
                    // if (random() > 0.5) {
                    dirs[0] = next;
                    dirs[1] = diag;
                    // } else {
                    //     dirs[1] = next;
                    //     dirs[0] = diag;
                    // }
                    dirs[2] = cur;
                    break;
            }
        }

        let idxarr = Array.from(Array(this.w * this.h).keys());
        for (let i = idxarr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = idxarr[i];
            idxarr[i] = idxarr[j];
            idxarr[j] = temp;
        }


        let mapt = JSON.parse(JSON.stringify(this.map));

        // for (let i = 0; i < idxarr.length; i++) {
        //     let x = Math.floor(idxarr[i] % this.w);
        //     let y = Math.floor(idxarr[i] / this.w);

        //     if (mapt[y][x]) {
        //         let nx = 0, ny = 0;

        //         for (let d = 0; d < dirlen; d++) {
        //             nx = x + dirs[d].x;
        //             ny = y + dirs[d].y;
        //             if (!this.checkBound(nx, ny)) continue;

        //             if (!this.map[ny][nx]) {
        //                 this.map[ny][nx] = 1;
        //                 this.map[y][x] = 0;
        //                 mapt[y][x] = 0;
        //                 break;
        //             }
        //         }
        //     }
        // }

        let r = Math.floor(random() * 15) + 5;
        for (let k = 0; k < r; k++) {
            for (let i = k; i < this.w * this.h; i += r) {
                let x = Math.floor(i % this.w);
                let y = Math.floor(i / this.w);

                if (mapt[y][x]) {
                    let nx = 0, ny = 0;

                    for (let d = 0; d < dirlen; d++) {
                        nx = x + dirs[d].x;
                        ny = y + dirs[d].y;
                        if (!this.checkBound(nx, ny)) continue;

                        if (!this.map[ny][nx]) {
                            this.map[ny][nx] = 1;
                            this.map[y][x] = 0;
                            mapt[y][x] = 0;
                            break;
                        }
                    }
                }
            }
        }
    }

    checkBound(x, y) {
        return 1;
    }
};

const partam = 60;
const cv_offs = 200;
const cv_size = 800;
const w = 16;
const h = 16;
const cx = cv_offs + cv_size / 2;
const cy = cv_size / 2;
let ui;

let mx = new Matrix(cv_size / w / 1.45, w, h, cx, cy);

function wall(x, y) {
    // if (x == 10 && y != 10 && y != 20) return 1;
    // if (x > 13 && x < 26 && y > 13 && y < 26) return 1;
    // if (y >= 8 && x < 8) return 1;
    // if (y < 8 && x >= 8) return 1;
    return 0;
}

let box = new Box(w, h);
box.checkBound = (x, y) => {
    if (wall(x, y)) return 0;
    return (x >= 0 && y >= 0 && x < w && y < h);
}

function setup() {
    createCanvas(cv_offs + cv_size, cv_size);
    ui = QuickSettings.create(0, 0)
        .addRange("angle", 0, 720, 0, 1)
        .addBoolean("remove", 0)
        .addBoolean("add", 0)
        .setWidth(cv_offs)
        .setDraggable(false)
        .setCollapsible(false);

    let parts = partam;
    for (let y = 0; y < w && parts; y++) {
        for (let x = 0; x < h && parts; x++) {
            if (!wall(x, y)) {
                parts--;
                box.map[y][x] = 1;
            }
        }
    }
}

function draw() {
    background(200);
    let angle = ui_get('angle');

    if (frameCount % 2 == 0) {
        box.step(360 - angle);
        mx.clear();
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (box.map[y][x]) mx.set(x, y);
                if (wall(x, y)) mx.wall(x, y);
            }
        }
    }

    if (frameCount % 10 == 0) {
        if (ui_get('remove')) box.map[0][0] = 0;
        if (ui_get('add')) box.map[h - 1][w - 1] = 1;
        mx.show();
    }

    mx.rotate(radians(angle + 90));
    mx.show();
}