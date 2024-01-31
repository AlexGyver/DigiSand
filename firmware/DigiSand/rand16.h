#pragma once
#include <Arduino.h>

uint16_t rand16() {
    static uint16_t seed = 12345;
    return seed = (seed * 2053ul) + 13849;
}

uint16_t rand16(uint16_t max) {
    return ((uint32_t)max * rand16()) >> 16;
}

uint16_t rand16(uint16_t min, uint16_t max) {
    return (rand16(max - min) + min);
}