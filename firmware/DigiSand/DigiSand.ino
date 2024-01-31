#include <Arduino.h>

#include "print3x5.h"

#define PART_AMOUNT 55
#define BTN1_PIN 2
#define BTN2_PIN 3
#define CS_PIN 6
#define DT_PIN 4
#define CK_PIN 5

// memory
struct Data {
    int16_t sec = 60;
    int8_t bri = 5;
};
Data data;

#include <EEManager.h>
EEManager memory(data);

// button
#include <EncButton.h>
Button up(BTN1_PIN);
Button down(BTN2_PIN);
VirtButton dbl;

// matrix
#include <GyverMAX7219.h>
MAX7219<2, 1, CS_PIN, DT_PIN, CK_PIN> mtrx;

// mpu
#include "mini6050.h"
Mini6050 mpu;

// sandbox
#define BOX_W 16
#define BOX_H 16

#include "sand.h"
Sand<BOX_W, BOX_H> box;

// timer
#include "Timer.h"
Timer fall_tmr, disp_tmr;

bool checkBound(int8_t x, int8_t y) {
    if (y >= 8 && x < 8) return 0;
    if (y < 8 && x >= 8) return 0;
    if (mpu.getDir() > 0) {
        if (x == 8 && y == 8) return 0;
    } else {
        if (x == 7 && y == 7) return 0;
    }
    return (x >= 0 && y >= 0 && x < BOX_W && y < BOX_H);
}
void setXY(int8_t x, int8_t y, bool value) {
    if (y >= 8) y -= 8;
    mtrx.dot(x, y, value);
}

void resetSand() {
    box.buf.clear();
    mtrx.clear();
    mtrx.update();
    for (uint8_t n = 0; n < PART_AMOUNT; n++) {
        box.buf.set(n % 8, n / 8, 1);
    }
}

void setup() {
    Serial.begin(115200);
    Wire.begin();
    mpu.begin();
    memory.begin(0, 'a');
    mtrx.begin();
    mtrx.setBright(data.bri);

    mpu.setX({1, -1});
    mpu.setY({2, 1});
    mpu.setZ({0, 1});

    box.attachBound(checkBound);
    box.attachSet(setXY);

    resetSand();
    fall_tmr.setInterval(data.sec * 1000ul / PART_AMOUNT);
}

void changeTime(int8_t dir) {
    disp_tmr.setTimeout(3000);
    mtrx.clear();
    data.sec += dir;
    if (data.sec < 0) data.sec = 0;
    uint8_t min = data.sec / 60;
    uint8_t sec = data.sec % 60;

    printDig(&mtrx, 0, 1, min / 10);
    printDig(&mtrx, 4, 1, min % 10);
    printDig(&mtrx, 8 + 0, 1, sec / 10);
    printDig(&mtrx, 8 + 4, 1, sec % 10);

    fall_tmr.setInterval(data.sec * 1000ul / PART_AMOUNT);
    memory.update();
    mtrx.update();
}

void changeBri(int8_t dir) {
    data.bri += dir;
    data.bri = constrain(data.bri, 0, 15);
    mtrx.setBright(data.bri);
    memory.update();
}

void buttons() {
    up.tick();
    down.tick();
    dbl.tick(up, down);

    if (dbl.click()) resetSand();

    if (up.click()) changeTime(1);
    if (up.step(0)) changeTime(10);
    if (up.step(1)) changeBri(1);

    if (down.click()) changeTime(-1);
    if (down.step(0)) changeTime(-10);
    if (down.step(1)) changeBri(-1);
}

void step() {
    uint16_t prd = 255 - mpu.getMag();
    prd = constrain(prd, 15, 100);
    if (mpu.update(prd)) {
        mtrx.clear();
        box.step(mpu.getAngle() + 45);
        mtrx.update();
    }
}

void fall() {
    if (fall_tmr) {
        if (mpu.getDir() > 0) {
            if (box.buf.get(7, 7) && !box.buf.get(8, 8)) {
                box.buf.set(7, 7, 0);
                box.buf.set(8, 8, 1);
                box.setCallback(7, 7, 0);
                box.setCallback(8, 8, 1);
                mtrx.update();
            }
        } else {
            if (box.buf.get(8, 8) && !box.buf.get(7, 7)) {
                box.buf.set(8, 8, 0);
                box.buf.set(7, 7, 1);
                box.setCallback(8, 8, 0);
                box.setCallback(7, 7, 1);
                mtrx.update();
            }
        }
    }
}

void loop() {
    memory.tick();
    disp_tmr.tick();
    buttons();

    if (!disp_tmr.state()) {
        step();
        fall();
    }
}