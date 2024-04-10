#include "pitches.h"

// V trave sidel kuznechik - 1
const uint16_t melody1[][2] PROGMEM = {
      {NOTE_A4, 250},	{ NOTE_E4, 250},	{ NOTE_A4, 250},	{ NOTE_E4, 250},	{ NOTE_A4, 250},	{ NOTE_GS4, 250},	{ NOTE_GS4, 250},	{0, 150},	{NOTE_GS4, 250},	{ NOTE_E4, 250},	
      { NOTE_GS4, 250},	{ NOTE_E4, 250},	{ NOTE_GS4, 250},	{ NOTE_A4, 250},	{ NOTE_A4, 250},	{0, 150},	{NOTE_A4, 250},	{ NOTE_E4, 250},	{ NOTE_A4, 250},	{ NOTE_E4, 250},	
      { NOTE_A4, 250},	{ NOTE_GS4, 250},	{ NOTE_GS4, 250},	{0, 150},	{NOTE_GS4, 250},	{ NOTE_E4, 250},	{ NOTE_GS4, 250},	{ NOTE_E4, 250},	{ NOTE_GS4, 250},	{ NOTE_A4, 350},	
      {0, 150},	{NOTE_A4, 250},	{ NOTE_B4, 250},	{ NOTE_B4, 200},	{ NOTE_B4, 200},	{ NOTE_B4, 250},	{ NOTE_B4, 250},	{ NOTE_C5, 250},	{ NOTE_C5, 250},	{NOTE_C5, 200},	
      { NOTE_C5, 200},	{0, 100},	{NOTE_C5, 250},	{ NOTE_C5, 250},	{ NOTE_B4, 250},	{ NOTE_A4, 250},	{ NOTE_GS4, 250},	{ NOTE_A4, 250},	{ NOTE_A4, 350},	{0, 150},	
      {NOTE_A4, 250},	{ NOTE_B4, 250},	{ NOTE_B4, 200},	{ NOTE_B4, 200},	{ NOTE_B4, 250},	{ NOTE_B4, 250},	{ NOTE_C5, 250},	{ NOTE_C5, 250},	{NOTE_C5, 200},	{ NOTE_C5, 200},	
      {0, 100},	{ NOTE_C5, 250},	{ NOTE_C5, 250},	{ NOTE_B4, 250},	{ NOTE_A4, 250},	{ NOTE_GS4, 250},	{ NOTE_A4, 250},	{ NOTE_A4, 350},	{0, 150}
};

// Crazy Frog - 2
const uint16_t melody2[][2] PROGMEM = {
      {NOTE_D4, 125},	{0, 125},	{NOTE_F4, 166},	{NOTE_D4, 62},	{0, 62},	{NOTE_D4, 16},	{NOTE_G4, 125},	{NOTE_D4, 125},	{NOTE_C4, 125},	{NOTE_D4, 125},	
      {0, 125},	{NOTE_A4, 166},	{NOTE_D4, 62},	{0, 62},	{NOTE_D4, 62},	{NOTE_AS4, 125},	{NOTE_A4, 125},	{NOTE_F4, 125},	{NOTE_D4, 125},	{NOTE_A4, 125},	
      {NOTE_D5, 125},	{NOTE_D4, 62},	{NOTE_C4, 62},	{0, 62},	{NOTE_C4, 62},	{NOTE_A3, 125},	{NOTE_E4, 125},	{NOTE_D4, 500},	{0, 125},	{NOTE_D4 , 250},	
      {NOTE_D4, 250}
};

// Mario - 3
const uint16_t melody3[][2] PROGMEM = {
{NOTE_E6, 50}, {0, 50}, 	{ NOTE_E6, 100}, {0, 100}, 	{ NOTE_E6, 50}, {0, 100}, 	{ NOTE_C6, 50}, {0, 50}, 	{ NOTE_E6, 100}, {0, 100}, 	{ NOTE_G6, 200}, {0, 200}, 	
{ NOTE_G5, 200}, {0, 200}, 	{NOTE_C6, 150}, {0, 150}, 	{ NOTE_G5, 50}, {0, 150}, 	{ NOTE_E5, 100}, {0, 150}, 	{ NOTE_A5, 100}, {0, 100}, 	{ NOTE_B5, 50}, {0, 100}, 	
{ NOTE_AS5, 50}, {0, 50}, 	{ NOTE_A5, 100}, {0, 100}, 	{ NOTE_G5, 70}, {0, 70}, 	{NOTE_E6, 70}, {0, 70}, 	{ NOTE_G6, 50}, {0, 50}, 	{ NOTE_A6, 100}, {0, 100}, 	
{ NOTE_F6, 50}, {0, 50}, 	{ NOTE_G6, 50}, {0, 100}, 	{ NOTE_E6, 100}, {0, 100}, 	{ NOTE_F6, 50}, {0, 50}, 	{ NOTE_D6, 50}, {0, 50}, 	{ NOTE_B5, 150}, {0, 150}, 
{NOTE_C6, 150}, {0, 150}, 	{ NOTE_G5, 50}, {0, 150}, 	{ NOTE_E5, 100}, {0, 150}, 	{ NOTE_A5, 100}, {0, 100}, 	{ NOTE_B5, 50}, {0, 100}, 	{ NOTE_AS5, 50}, {0, 50}, 	
{ NOTE_A5, 100}, {0, 100}, 	{NOTE_G5, 70}, {0, 70}, 	{ NOTE_E6, 70}, {0, 70}, 	{ NOTE_G6, 50}, {0, 50}, 	{ NOTE_A6, 100}, {0, 100}, 	{ NOTE_F6, 50}, {0, 50}, 	
{ NOTE_G6, 50}, {0, 100}, 	{ NOTE_E6, 100}, {0, 100}, 	{ NOTE_C6, 50}, {0, 50}, 	{ NOTE_D6, 50}, {0, 50}, 	{ NOTE_B5, 150}, {0, 200}, 	{NOTE_G6, 50}, {0, 50}, 	
{ NOTE_FS6, 50}, {0, 50}, 	{ NOTE_F6, 50}, {0, 50}, 	{ NOTE_DS6, 100}, {0, 100}, 	{ NOTE_E6, 50}, {0, 100}, 	{ NOTE_GS5, 50}, {0, 50}, 	{ NOTE_A5, 50}, {0, 50}, 	
{ NOTE_C6, 50}, {0, 100}, 	{ NOTE_A5, 50}, {0, 50}, 	{ NOTE_C6, 50}, {0, 50}, 	{ NOTE_D6, 50}, {0, 50}, 	{0, 0}, {0, 100}, 	{ NOTE_G6, 50}, {0, 50}, 	{ NOTE_FS6, 50}, {0, 50}, 	
{ NOTE_F6, 50}, {0, 50}, 	{ NOTE_DS6, 100}, {0, 100}, 	{ NOTE_E6, 50}, {0, 100}, 	{ NOTE_C7, 100}, {0, 100}, 	{ NOTE_C7, 50}, {0, 50}, 	{ NOTE_C7, 200}, {0, 200}, 	{NOTE_G6, 50}, {0, 50}, 	
{ NOTE_FS6, 50}, {0, 50}, 	{ NOTE_F6, 50}, {0, 50}, 	{ NOTE_DS6, 100}, {0, 100}, 	{ NOTE_E6, 50}, {0, 100}, 	{ NOTE_GS5, 50}, {0, 50}, 	{ NOTE_A5, 50}, {0, 50}, 	{ NOTE_C6, 50}, {0, 100}, 	
{ NOTE_A5, 50}, {0, 50}, 	{ NOTE_C6, 50}, {0, 50}, 	{ NOTE_D6, 50}, {0, 150}, 	{ NOTE_DS6, 100}, {0, 150}, 	{ NOTE_D6, 150}, {0, 150}, 	{ NOTE_C6, 200}, {0, 400}
};

// Beb bep - 4
const uint16_t melody4[][2] PROGMEM = {
  {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40},
  {0, 200},
  {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40},
  {0, 200},
  {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40},
  {0, 200},
  {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40},
  {0, 200},
  {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40}, {NOTE_B7, 40}, {0, 40},
};

// tick - 10
const uint16_t sound1[][2] PROGMEM = {
  {NOTE_B5, 10}, {NOTE_B7, 10}
};


unsigned long toneMillis;
uint8_t tonePlaying = 0;

unsigned long melodyMillis;
uint8_t melodyPlaying = 0;
uint16_t melodyStep = 0;
size_t melodySize = 0;
uint8_t melodyTempo = 2;
const uint8_t melodyOctave = 1; // октава воспроизведения мелодий (меняйте под себя аккуратно)

void SetTempo(uint8_t val) {
  melodyTempo = val;
}

void soundsTick() {
  if(melodyPlaying && (millis() > melodyMillis)) {
    if(melodyStep < melodySize - 1) {
      melodyStep++;
      RunMelodyNote();
    } else {
      StopMelody();
    }
  }
}

bool isMelodyPlaying() {
  return melodyPlaying > 0;
}

// Play a melody by number
void PlayMelody(uint8_t melody)
{
  if(melody > 0) {
    noTone(SOUND_PIN);
    melodyPlaying = melody;
    melodyStep = 0;
    melodySize = GetMelodySize(melody);
    RunMelodyNote();
  }
}

void StopMelody() {
  noTone(SOUND_PIN);
  melodyPlaying = 0;
}

void RunMelodyNote() {
  uint16_t freq = GetMelodyData(melodyPlaying,melodyStep,0);
  if(freq > 0) {
    tone(SOUND_PIN, freq * melodyOctave);
  } else {
    noTone(SOUND_PIN);
  }
  melodyMillis = millis() + GetMelodyData(melodyPlaying,melodyStep,1) * melodyTempo;
}

uint16_t GetMelodyData(uint8_t melody, uint8_t step, uint8_t item) {
  switch (melody) {
    // melodies
    case 1:
      return pgm_read_word(&melody1[step][item]);  
    case 2:
      return pgm_read_word(&melody2[step][item]);  
    case 3:
      return pgm_read_word(&melody3[step][item]);  
    case 4:
      return pgm_read_word(&melody4[step][item]); 
    // sounds
    case 10:
      return pgm_read_word(&sound1[step][item]);  
  } 
}

uint8_t GetMelodySize(uint8_t melody) {
  switch (melody) {
    // melodies
    case 1:
      return sizeof(melody1) / sizeof(melody1[0]);  
    case 2:
      return sizeof(melody2) / sizeof(melody2[0]);  
    case 3:
      return sizeof(melody3) / sizeof(melody3[0]);  
    case 4:
      return sizeof(melody4) / sizeof(melody4[0]); 
    // sounds
    case 10:
      return sizeof(sound1) / sizeof(sound1[0]); 
  }
}

void PlaySandPushTone() {
  PlayMelody(10);
}
