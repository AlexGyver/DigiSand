
function ui_get(name) {
    return ui.getValue(name);
}
function ui_set(name, value) {
    return ui.setValue(name, value);
}
const IndexDir = {
    SIDE_R: 0,
    DIAG_R_U: 1,
    SIDE_UP: 2,
    DIAG_L_U: 3,
    SIDE_L: 4,
    DIAG_L_D: 5,
    SIDE_DN: 6,
    DIAG_R_D: 7,
};

class Indexer {
    x = 0;
    y = 0;
    xx = 0;
    yy = 0;
    dir = 0;
    mirror = 0;
    nextrow = 0;
    count = -1;

    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
    reset() {
        this.xx = 0;
        this.yy = 0;
        this.count = -1;
    }
    next() {
        this.count++;
        if (this.dir & 1) { // odd
            while (this._nextDiag()) {
                if (this.x < this.w && this.y < this.h) {
                    switch (this.dir) {
                        case IndexDir.DIAG_L_U:
                            break;
                        case IndexDir.DIAG_L_D:
                            this._flipY();
                            break;
                        case IndexDir.DIAG_R_U:
                            this._flipX();
                            break;
                        case IndexDir.DIAG_R_D:
                            this._flipY();
                            this._flipX();
                            break;
                    }
                    return 1;
                }
            }
        } else {
            if (this._nextSide()) return 1;
        }
        return 0;
    }
    setDir(dir, mirror = 0) {
        this.dir = dir;
        this.mirror = mirror;
    }
    setMirror(mirror) {
        this.mirror = mirror;
    }
    toggleMirror() {
        this.mirror = !this.mirror;
    }

    _flipX() {
        this.x = this.w - this.x - 1;
    }
    _flipY() {
        this.y = this.h - this.y - 1;
    }
    _nextDiag() {
        // for (let xx = 0; xx <= WIDTH + HEIGHT - 2; xx++) {
        //     for (let yy = 0; yy <= xx; yy++) {
        //         let y = xx - yy;
        //         let x = yy;
        //         if (y < HEIGHT && x < WIDTH) {
        //         }
        //     }
        // }
        this.nextrow = 0;
        if (this.xx > this.h + this.w - 2) return 0;
        // this.x = this.mirror ? this.yy : (this.xx - this.yy);
        // this.y = this.mirror ? (this.xx - this.yy) : this.yy;
        this.x = this.xx - this.yy;
        this.y = this.yy;
        this.yy++;
        if (this.yy > this.xx) {
            this.yy = 0;
            this.xx++;
            this.nextrow = 1;
        }
        return 1;
    }
    _nextSide() {
        this.nextrow = 0;
        if (this.xx >= this.w || this.yy >= this.h) return 0;
        this.x = this.xx;
        this.y = this.yy;
        switch (this.dir) {
            case IndexDir.SIDE_DN:
                this._flipY();
            case IndexDir.SIDE_UP:
                if (this.mirror) this._flipX();
                if (++this.xx >= this.w) {
                    this.xx = 0;
                    this.yy++;
                    this.nextrow = 1;
                }
                break;
            case IndexDir.SIDE_R:
                this._flipX();
            case IndexDir.SIDE_L:
                if (this.mirror) this._flipY();
                if (++this.yy >= this.h) {
                    this.yy = 0;
                    this.xx++;
                    this.nextrow = 1;
                }
                break;
        }
        return 1;
    }
};
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
                fill(this.mx[y][x] == 1 ? 'red' : 'white');
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
        if (angle >= 360) angle -= 360;
        angle = Math.round(angle / 23);  // 0..15
        angle %= 16;

        let qw = Math.floor(angle / 4);
        let dirs = [null, null, null];
        let dirlen = 0;

        let cur = new Dir(qw * 2);
        let next = new Dir((qw + 1) * 2);
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
                    dirs[0] = cur;
                    dirs[1] = diag;
                    dirs[2] = next;
                    break;
                case 3: case 7: case 11: case 15:
                    dirs[0] = next;
                    dirs[1] = diag;
                    dirs[2] = cur;
                    break;
            }
        }

        // noStroke();
        // fill(0);
        // circle(100, 200, 5);
        // strokeWeight(2);
        // for (let d = 0; d < dirlen; d++) {
        //     stroke(d == 0 ? 'red' : (d == 1 ? 'green' : 'blue'));
        //     line(100, 200, 100 + dirs[d].x * 50, 200 + dirs[d].y * 50);
        // }

        for (let d = 0; d < dirlen; d++) {
            let idx = new Indexer(w, h);
            idx.setDir((8 - dirs[d].dir) % 8);
            while (idx.next()) {
                // /*if (idx.nextrow)*/ idx.setMirror(random() > 0.9);
                if (this.map[idx.y][idx.x]) {
                    let b = new Brick(idx.x + dirs[d].x, idx.y + dirs[d].y);
                    if (!this.checkBound(b.x, b.y)) continue;
                    if (!this.map[b.y][b.x]) {
                        this.map[b.y][b.x] = 1;
                        this.map[idx.y][idx.x] = 0;
                    }
                }
            }
        }

    }

    checkBound(x, y) {
        return 1;
    }
};

const partam = 150;
const cv_offs = 200;
const cv_size = 800;
const w = 16;
const h = 16;
const cx = cv_offs + cv_size / 2;
const cy = cv_size / 2;
let ui;

let mx = new Matrix(30, w, h, cx, cy);

let box = new Box(w, h);
box.checkBound = (x, y) => {
    return (x >= 0 && y >= 0 && x < w && y < h);
}

function setup() {
    createCanvas(cv_offs + cv_size, cv_size);
    ui = QuickSettings.create(0, 0)
        .addRange("angle", 0, 360, 0, 1)
        .addBoolean("remove", 0)
        .addBoolean("add", 0)
        .setWidth(cv_offs)
        .setDraggable(false)
        .setCollapsible(false);

    // for (let i = 0; i < partam; i++) {
    //     box.map[i % w][Math.floor(i / h)] = 1;
    // }
    for (let y = 0; y < 12; y++) {
        for (let x = 0; x < 12; x++) {
            box.map[y][x] = 1;
        }
    }

    // let i = new Indexer(10, 5);
    // let a = [];
    // for (let y = 0; y < 5; y++) {
    //     let row = [];
    //     for (let x = 0; x < 10; x++) row.push(0);
    //     a.push(row);
    // }
    // i.setDir(1);
    // while (i.next()) {
    //     a[i.y][i.x] = i.count;
    //     // i.toggleMirror();
    // }
    // console.log(a);
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