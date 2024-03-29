#include <GyverMAX7219.h>
MAX7219 < 1, 1, 5 > mtrx;   // одна матрица (1х1), пин CS на D5

// https://github.com/jorydotcom/matrix-emoji/blob/master/current-j5-emoji.js

// каждый массив - один emoji
const uint8_t angryface_B[] PROGMEM = {0x00, 0x66, 0x66, 0x00, 0x18, 0x24, 0x42, 0x81};
const uint8_t circle_B[] PROGMEM = {0x3c, 0x42, 0x81, 0x81, 0x81, 0x81, 0x42, 0x3c};
const uint8_t cdot_B[] PROGMEM = {0x3c, 0x42, 0x81, 0x99, 0x99, 0x81, 0x42, 0x3c};
const uint8_t donut_B[] PROGMEM = {0x3c, 0x7e, 0xff, 0xe7, 0xe7, 0xff, 0x7e, 0x3c};
const uint8_t equality_B[] PROGMEM = {0x00, 0xff, 0xff, 0x00, 0x00, 0xff, 0xff, 0x00};
const uint8_t ball_B[] PROGMEM = {0x3c, 0x7e, 0xff, 0xff, 0xff, 0xff, 0x7e, 0x3c};
const uint8_t thinsquare_B[] PROGMEM = {0xff, 0x81, 0x81, 0x81, 0x81, 0x81, 0x81, 0xff};
const uint8_t thicksquare_B[] PROGMEM = {0xff, 0xff, 0xc3, 0xc3, 0xc3, 0xc3, 0xff, 0xff};

const uint8_t centeredsquare1_B[] PROGMEM = {0x00, 0x00, 0x3c, 0x3c, 0x3c, 0x3c, 0x00, 0x00};
const uint8_t centeredsquare2_B[] PROGMEM = {0x00, 0x00, 0x3c, 0x3c, 0x3c, 0x3c, 0x00, 0x00};
const uint8_t arrowright_B[] PROGMEM = {0x00, 0x04, 0x06, 0xff, 0xff, 0x06, 0x04, 0x00};
const uint8_t arrowleft_B[] PROGMEM = {0x00, 0x20, 0x60, 0xff, 0xff, 0x60, 0x20, 0x00};
const uint8_t note_B[] PROGMEM = {0x04, 0x06, 0x07, 0x04, 0x3c, 0x7c, 0x7c, 0x38};
const uint8_t clock_B[] PROGMEM = {0x3c, 0x52, 0x91, 0x91, 0x8f, 0x81, 0x42, 0x3c};
const uint8_t heartoutline_B[] PROGMEM = {0x66, 0x99, 0x81, 0x81, 0x42, 0x24, 0x18, 0x00};
const uint8_t heartfull_B[] PROGMEM = {0x66, 0xff, 0xff, 0xff, 0x7e, 0x3c, 0x18, 0x00};

const uint8_t thincheck_B[] PROGMEM = {0x00, 0x00, 0x01, 0x02, 0x04, 0x88, 0x50, 0x20};
const uint8_t thickcheck_B[] PROGMEM = {0x00, 0x01, 0x03, 0x06, 0x8c, 0xd8, 0x70, 0x20};
const uint8_t speaker_B[] PROGMEM = {0x03, 0x07, 0x3f, 0x3f, 0x3f, 0x3f, 0x07, 0x03};
const uint8_t sound_B[] PROGMEM = {0x00, 0x40, 0x80, 0x00, 0xc0, 0x00, 0x80, 0x40};
const uint8_t xbig_B[] PROGMEM = {0xc3, 0xe7, 0x7e, 0x3c, 0x3c, 0x7e, 0xe7, 0xc3};
const uint8_t target_B[] PROGMEM = {0x3c, 0x7e, 0xc3, 0xdb, 0xdb, 0xc3, 0x7e, 0x3c};
const uint8_t bell_B[] PROGMEM = {0x18, 0x3c, 0x3c, 0x3c, 0x3c, 0x7e, 0x00, 0x18};
const uint8_t smile_B[] PROGMEM = {0x00, 0x66, 0x66, 0x00, 0x00, 0x81, 0x42, 0x3c};

const uint8_t frown_B[] PROGMEM = {0x00, 0x66, 0x66, 0x00, 0x00, 0x3c, 0x42, 0x81};
const uint8_t winkright_B[] PROGMEM = {0x00, 0x60, 0x66, 0x00, 0x00, 0x81, 0x42, 0x3c};
const uint8_t winkleft_B[] PROGMEM = {0x00, 0x06, 0x66, 0x00, 0x00, 0x81, 0x42, 0x3c};
const uint8_t blink_B[] PROGMEM = {0x00, 0x00, 0x66, 0x00, 0x00, 0x81, 0x42, 0x3c};
const uint8_t laughing_B[] PROGMEM = {0x00, 0x66, 0x66, 0x00, 0xff, 0x81, 0x42, 0x3c};
const uint8_t tongueout_B[] PROGMEM = {0x00, 0x66, 0x66, 0x00, 0x00, 0x7e, 0x0a, 0x04};
const uint8_t expressionless_B[] PROGMEM = {0x00, 0x66, 0x66, 0x00, 0x00, 0xff, 0x00, 0x00};

// список массивов для вывода в цикле
const uint8_t* const emojis[] PROGMEM = {
  angryface_B, circle_B, cdot_B, donut_B, equality_B, ball_B, thinsquare_B, thicksquare_B,
  centeredsquare1_B, centeredsquare2_B, arrowright_B, arrowleft_B, note_B, clock_B, heartoutline_B, heartfull_B,
  thincheck_B, thickcheck_B, speaker_B, sound_B, xbig_B, target_B, bell_B, smile_B,
  frown_B, winkright_B, winkleft_B, blink_B, laughing_B, tongueout_B, expressionless_B,
};

void setup() {
  mtrx.begin();       // запускаем
  mtrx.setBright(5);  // яркость 0..15
  //mtrx.setRotation(1);   // можно повернуть 0..3, по 90 град по часовой стрелке

  // рисуем одну любую emoji
  mtrx.drawBitmap(0, 0, winkleft_B, 8, 8);
  mtrx.update();
  delay(2000);

  // выводим все для демонстрации
  for (int i = 0; i < 31; i++) {
    mtrx.clear();
    uint16_t ptr = pgm_read_word(&(emojis[i]));// получаем адрес из таблицы ссылок
    mtrx.drawBitmap(0, 0, ptr, 8, 8);
    mtrx.update();
    delay(1000);
  }
}

void loop() {

}
