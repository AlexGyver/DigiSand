# DigiSand board simulator

A browser simulator for the DigiSand digital sand clock board (ATmega328P, board v2.4).
It runs the **real compiled firmware** (the same `.hex` file you upload to the chip) on an
emulated ATmega328P, together with models of the parts on the board.

Open `dist/index.html` in any modern browser. Nothing to install, it is one self-contained file.

## What is simulated

- **CPU**: ATmega328P at 8 MHz (instructions, timers, GPIO, USART, I2C/TWI, EEPROM, ADC),
  using the open-source [avr8js](https://github.com/wokwi/avr8js) library.
- **LED matrices**: two MAX7219 8x8 matrices, decoded from the firmware's software-SPI pin changes
  (CS D7, DATA D8, CLK D6).
- **Motion sensor**: LSM6DS3TR-C accelerometer on I2C address 0x6A (WHO_AM_I 0x6A). Tilt and flip
  the clock from the page.
- **Buttons**: Up D2, Down D4, Menu D3.
- **Speaker**: D9, notes shown as frequencies.
- **Power**: battery (LiPo discharge curve), BQ24072 charger (0.30 A charge with R6 = 3k,
  0.89 A input limit), on/off switch with the AO3401A load switch, TLV75733 regulator,
  battery sense divider (1M / 100k into ADC7, read with the 1.1 V reference).
  You can plug/unplug USB, change the battery level and watch it charge or run down.

Two firmware builds are included in `fw/`:
- `DigiSand2_PCB.hex`: the firmware ported to this board (default).
- `DigiSand2_original.hex`: the original Nano/MPU6050 firmware, to show why it does not work on this board.

## Project layout

```
src/board.js     emulated board: CPU, peripherals, MAX7219 chain, LSM6 sensor, buttons, speaker
src/power.js     battery, charger, switch and regulator model
src/main.js      page logic and drawing
src/index.html   page template
fw/              firmware .hex files (built from the DigiSand2_PCB sketch, MiniCore, 8 MHz)
parts.json       board part positions used for the picture
board.jpg        board render used as background
build.mjs        bundles everything into dist/index.html with esbuild
tests/           headless tests that run the firmware without a browser
dist/index.html  ready-built simulator
```

## Build and test

Needs Node.js 18 or newer.

```
npm install
npm run build     # writes dist/index.html
npm test          # timer, buttons, menu, flip, saved settings, power-on battery cases, charging
```

To try a different firmware, compile the sketch for MiniCore ATmega328P at 8 MHz external,
copy the `.hex` to `fw/DigiSand2_PCB.hex` and run `npm run build` again.

## Limits

- It is a functional model, not an analog circuit simulator: voltages and currents come from
  simple equations (charger phases, battery curve, load currents), not from SPICE.
- Pin timing is cycle-accurate for the CPU, but the MAX7219 and sensor models only implement
  the registers the firmware uses.
