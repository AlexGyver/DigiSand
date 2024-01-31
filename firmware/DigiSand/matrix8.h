#pragma once
#include <Arduino.h>

template <uint8_t w, uint8_t h>
class Matrix8 {
   public:
    uint8_t buffer[h * w / 8];

    bool get(uint16_t idx) {
        return bitRead(buffer[idx >> 3], idx & 7);
    }
    bool get(uint8_t x, uint8_t y) {
        return bitRead(getB(x, y), x & 7);
    }

    void set(uint16_t idx, bool v) {
        bitWrite(buffer[idx >> 3], idx & 7, v);
    }
    void set(uint8_t x, uint8_t y, bool v) {
        bitWrite(getB(x, y), x & 7, v);
    }

    void clear() {
        memset(buffer, 0, h * w / 8);
    }

    uint8_t getW() {
        return w;
    }
    uint8_t getH() {
        return h;
    }

   private:
    uint8_t& getB(uint8_t& x, uint8_t& y) {
        return buffer[y * (w >> 3) + (x >> 3)];  // y * w / 8 + x / 8
    }
};