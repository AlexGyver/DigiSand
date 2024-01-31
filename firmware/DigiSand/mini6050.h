#pragma once
#include <Arduino.h>
#include <Wire.h>

#define MPU_ADDR 0x68

struct DirXyz {
    uint8_t axis;
    int8_t dir;
};

class Mini6050 {
   public:
    void begin() {
        Wire.beginTransmission(MPU_ADDR);
        Wire.write(0x6B);  // PWR_MGMT_1 register
        Wire.write(0);     // set to zero (wakes up the MPU-6050)
        Wire.endTransmission(true);
    }

    void setX(DirXyz dir) {
        dirx = dir;
    }
    void setY(DirXyz dir) {
        diry = dir;
    }
    void setZ(DirXyz dir) {
        dirz = dir;
    }

    bool update(uint16_t prd = 30) {
        if ((uint16_t)((uint16_t)millis() - tmr) >= prd) {
            tmr = millis();

            Wire.beginTransmission(MPU_ADDR);
            Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)
            Wire.endTransmission(false);
            Wire.requestFrom(MPU_ADDR, 6, true);
            for (byte i = 0; i < 3; i++) {
                int16_t val = (Wire.read() << 8) | Wire.read();
                // raw[i] += (val - raw[i]) / 2;
                raw[i] = val;
            }

            int16_t magr = getDir(dirz) * 255L / 16000L;
            if (magr < 0) magr = -magr;
            mag = 255 - min(magr, 255);

            angle = degrees(atan2(getDir(dirx), getDir(diry)));
            return 1;
        }
        return 0;
    }

    int16_t getAx() {
        return getDir(dirx);
    }
    int16_t getAy() {
        return getDir(diry);
    }
    int16_t getAz() {
        return getDir(dirz);
    }

    int8_t getDir() {
        return abs(getAngle()) < 90 ? 1 : -1;
    }
    int16_t getAngle() {
        return angle;
    }
    uint8_t getMag() {
        return mag;
    }

   private:
    uint16_t tmr;
    int16_t raw[3];
    int16_t angle;
    uint8_t mag;
    DirXyz dirx, diry, dirz;

    int16_t getDir(DirXyz& dir) {
        return raw[dir.axis] * dir.dir;
    }
};