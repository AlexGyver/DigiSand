#pragma once
#include <Arduino.h>

static const int8_t _dirShift[][2] PROGMEM = {
    {1, 0},
    {1, 1},
    {0, 1},
    {-1, 1},
    {-1, 0},
    {-1, -1},
    {0, -1},
    {1, -1},
};

class Dir {
   public:
    Dir() {}
    Dir(int8_t dir) {
        dir = (dir + 8) & 7;
        x = pgm_read_byte(&_dirShift[dir][0]);
        y = pgm_read_byte(&_dirShift[dir][1]);
    }

    int8_t x = 0, y = 0;
};