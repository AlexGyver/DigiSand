#pragma once
#include <Arduino.h>

#include "dir.h"
#include "matrix8.h"
#include "rand16.h"

typedef bool (*BoundCb)(int8_t x, int8_t y);
typedef void (*SetCb)(int8_t x, int8_t y, bool value);

template <uint8_t w, uint8_t h>
class Sand {
   public:
    Matrix8<w, h> buf;

    uint8_t getW() {
        return w;
    }
    uint8_t getH() {
        return h;
    }

    void step(int16_t angle) {
        if (!bound_cb || !setCallback) return;
        if (angle < 0) angle += 360;
        if (angle >= 360) angle -= 360;
        angle = round(angle / 22.5);  // 0..15
        angle &= 15;                  // %16
        uint8_t qw = angle >> 2;      // /4

        uint8_t dirlen = 0;
        Dir dirs[3];
        Dir cur(qw * 2);
        Dir next((qw + 1) * 2);
        // Dir prev((qw - 1) * 2);
        Dir diag(qw * 2 + 1);

        if ((angle & 3) == 0) {  // % 4
            dirlen = 1;
            dirs[0] = cur;
            // dirs[1] = rand16() > INT16_MAX ? next : prev;
        } else if ((angle & 1) == 0) {  // % 2
            dirlen = 3;
            dirs[0] = diag;
            if (rand16() > INT16_MAX) {
                dirs[1] = cur;
                dirs[2] = next;
            } else {
                dirs[1] = next;
                dirs[2] = cur;
            }
        } else {
            dirlen = 3;
            switch (angle) {
                case 1:
                case 5:
                case 9:
                case 13:
                    dirs[0] = cur;
                    dirs[1] = diag;
                    dirs[2] = next;
                    break;
                case 3:
                case 7:
                case 11:
                case 15:
                    dirs[0] = next;
                    dirs[1] = diag;
                    dirs[2] = cur;
                    break;
            }
        }

        Matrix8<w, h> buft = buf;

        uint8_t r = rand16(3, 20);
        for (uint8_t k = 0; k < r; k++) {
            for (uint16_t i = k; i < w * h; i += r) {
                uint8_t y = i / w;
                uint8_t x = i - y * w;  // i % w

                if (buft.get(i)) {
                    bool moved = 0;
                    int8_t nx = 0, ny = 0;

                    for (uint8_t d = 0; d < dirlen; d++) {
                        nx = x + dirs[d].x;
                        ny = y + dirs[d].y;
                        if (!bound_cb(nx, ny)) continue;

                        uint16_t ni = nx + ny * w;
                        if (!buf.get(ni)) {
                            buf.set(ni, 1);
                            buf.set(i, 0);
                            buft.set(i, 0);
                            moved = 1;
                            break;
                        }
                    }
                    if (moved) setCallback(nx, ny, 1);
                    else setCallback(x, y, 1);
                }
            }
        }
    }

    /*
        void step1(int16_t angle) {
          if (!bound_cb || !get_cb || !setCallback) return;

          if (dirlist) {
            dirlist--;

            Indexer<int8_t> idx(w, h);
            // idx.setDir((8 - dirs[dirlist].dir) % 8);
            idx.setMirror(randB());
            while (idx.next()) {
              idx.setMirror(randB());
              if (get_cb(idx.x, idx.y)) {

                Brick b = {idx.x + dirs[dirlist].x(), idx.y + dirs[dirlist].y()};
                if (!bound_cb(b.x, b.y)) continue;
                if (!get_cb(b.x, b.y)) {
                  setCallback(b.x, b.y, 1);
                  setCallback(idx.x, idx.y, 0);
                }
              }
            }

          } else {
            if (angle < 0) angle += 360;
            if (angle >= 360) angle -= 360;
            angle = angle / 23;  // 0..15
            angle &= 15;  // %16
            uint8_t qw = angle / 4;

            Dir cur(qw * 2);
            Dir next((qw + 1) * 2);
            Dir diag(qw * 2 + 1);

            if ((angle & 3) == 0) {  // %4
              dirlist = 1;
              dirs[0] = cur;
            } else if ((angle & 1) == 0) {  // % 2
              dirlist = 3;
              dirs[2] = diag;
              if (randB()) {
                dirs[1] = cur;
                dirs[0] = next;
              } else {
                dirs[1] = next;
                dirs[0] = cur;
              }
            } else {
              dirlist = 3;
              switch (angle) {
                case 1: case 5: case 9: case 13:
                  dirs[2] = cur;
                  dirs[1] = diag;
                  dirs[0] = next;
                  break;
                case 3: case 7: case 11: case 15:
                  dirs[2] = next;
                  dirs[1] = diag;
                  dirs[0] = cur;
                  break;
              }
            }
          }
        }
    */

    void attachBound(BoundCb cb) {
        bound_cb = cb;
    }
    void attachSet(SetCb cb) {
        setCallback = cb;
    }

    SetCb setCallback = nullptr;

   private:
    BoundCb bound_cb = nullptr;
};