#include "print3x5.h"

static const uint8_t font3x5[][3] PROGMEM = {
    {
        0b11111,
        0b10001,
        0b11111,
    },
    {
        0b11111,
        0b00000,
        0b00000,
    },
    {
        0b11101,
        0b10101,
        0b10111,
    },
    {
        0b11111,
        0b10101,
        0b10101,
    },
    {
        0b11111,
        0b00100,
        0b11100,
    },
    {
        0b10111,
        0b10101,
        0b11101,
    },
    {
        0b10111,
        0b10101,
        0b11111,
    },
    {
        0b11111,
        0b10000,
        0b10000,
    },
    {
        0b11111,
        0b10101,
        0b11111,
    },
    {
        0b11111,
        0b10101,
        0b11101,
    },
};

void printDig(GyverGFX* mx, int X, int Y, uint8_t dig) {
    if (dig > 9) return;
    for (uint8_t x = 0; x < 3; x++) {
        uint8_t col = pgm_read_byte(&font3x5[dig][x]);
        for (uint8_t y = 0; y < 5; y++) {
            if (bitRead(col, 4 - y)) mx->dot(X + 2 - x, Y + y);
        }
    }
}