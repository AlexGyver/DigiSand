#include "pitches.h"

// V trave sidel kuznechik - 1 - FIXED
const uint16_t melody1[][2] PROGMEM = {
      {NOTE_A4, 300},	{ NOTE_E4, 150},	{0, 150}, { NOTE_A4, 300},	{ NOTE_E4, 150},{0, 150}, { NOTE_A4, 300},	{ NOTE_GS4, 150},	{0, 150}, { NOTE_GS4, 300},	{0, 300},	
      {NOTE_GS4, 300},{ NOTE_E4, 150},	{0, 150}, { NOTE_GS4, 300},	{ NOTE_E4, 150},{0, 150}, { NOTE_GS4, 150},	{0, 150}, { NOTE_A4, 150},	{0, 150}, { NOTE_A4, 300},	{0, 300},	
      {NOTE_A4, 300},	{ NOTE_E4, 150},	{0, 150}, { NOTE_A4, 300},	{ NOTE_E4, 150},{0, 150}, { NOTE_A4, 300},	{ NOTE_GS4, 150},	{0, 150}, { NOTE_GS4, 300},	{0, 300},	
      {NOTE_GS4, 300},{ NOTE_E4, 150},	{0, 150}, { NOTE_GS4, 300},	{ NOTE_E4, 150},{0, 150}, { NOTE_GS4, 150},	{0, 150}, { NOTE_A4, 750}, {0, 150},	
      {NOTE_A4, 300},	{NOTE_B4, 150},	{0, 150}, {NOTE_B4, 140}, {0, 10},	{NOTE_B4, 140}, {0, 10},	{NOTE_B4, 150}, {0, 150},	
      {NOTE_B4, 300},	{NOTE_C5, 150},	{0, 150}, {NOTE_C5, 140}, {0, 10},	{NOTE_C5, 140}, {0, 10},	{NOTE_C5, 150}, {0, 150},
      {NOTE_C5, 150},	{0, 150}, {NOTE_C5, 300},	{NOTE_B4, 150},	{0, 150}, {NOTE_A4, 300},	{NOTE_GS4, 150}, {0, 150}, {NOTE_A4, 150}, {0, 150}, {NOTE_A4, 300},	{0, 300},	
      {NOTE_A4, 300},	{NOTE_B4, 150},	{0, 150}, {NOTE_B4, 140}, {0, 10},	{NOTE_B4, 140}, {0, 10},	{NOTE_B4, 150}, {0, 150},	
      {NOTE_B4, 300},	{NOTE_C5, 150},	{0, 150}, {NOTE_C5, 140}, {0, 10},	{NOTE_C5, 140}, {0, 10},	{NOTE_C5, 150}, {0, 150},
      {NOTE_C5, 150},	{0, 150}, {NOTE_C5, 300},	{NOTE_B4, 150},	{0, 150}, {NOTE_A4, 300},	{NOTE_GS4, 150}, {0, 150}, {NOTE_A4, 600},	
};

// Crazy Frog - 2 - FIXED
const uint16_t melody2[][2] PROGMEM = {
      {NOTE_D4, 450},	{0, 150},	{NOTE_F4, 300},	{0, 150}, {NOTE_D4, 150},	{0, 150},	{NOTE_D4, 150},	{NOTE_G4, 150},	{0, 150}, {NOTE_D4, 150}, {0, 150}, {NOTE_C4, 150},	{0, 150},
      {NOTE_D4, 450},	{0, 150},	{NOTE_A4, 300},	{0, 150}, {NOTE_D4, 150},	{0, 150},	{NOTE_D4, 150},	{NOTE_AS4, 150}, {0, 150}, {NOTE_A4, 150}, {0, 150}, {NOTE_F4, 150}, {0, 150}, 	
      {NOTE_D4, 300},	{NOTE_A4, 150},	{0, 150}, {NOTE_D5, 150}, {0, 150}, {NOTE_D4, 150},	{NOTE_C4, 150},	{0, 150},	{NOTE_C4, 150},	{NOTE_A3, 150},	{0, 150}, {NOTE_E4, 300},	{NOTE_D4, 450}
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

// Ka by nebylo zimy - 5
const uint16_t melody5[][2] PROGMEM = {
  {NOTE_B3,200}, {NOTE_B3,200}, {NOTE_B4,300}, {NOTE_FS4,100},
  {NOTE_A4,200}, {NOTE_G4,200}, {NOTE_E4,400}, {0,25},
  {NOTE_D4,200}, {NOTE_D4,200}, {NOTE_D5,300}, {NOTE_C5,100}, {NOTE_C5,200},{NOTE_B4,200},{0,400},
  {NOTE_D5,200},{NOTE_C5,200}, {NOTE_A4,200},{NOTE_FS4,200}, {NOTE_C5,200},{NOTE_B4,200},{NOTE_B4,400},
  {NOTE_B3,200}, {NOTE_B3,200}, {NOTE_B4,300}, {NOTE_A4,100},{NOTE_A4,200}, {NOTE_G4,200}, {0,400},
  {NOTE_B3,200}, {NOTE_B3,200}, {NOTE_B4,300}, {NOTE_FS4,100},
  {NOTE_A4,200}, {NOTE_G4,200}, {NOTE_E4,400}, {PAUZA,25},
  {NOTE_D4,200}, {NOTE_D4,200}, {NOTE_D5,300}, {NOTE_C5,100}, {NOTE_C5,200},{NOTE_B4,200},{PAUZA,200},
  {NOTE_E5,400},{NOTE_C5,200}, {NOTE_A4,200}, {NOTE_FS4,200}, {NOTE_C5,200},{NOTE_B4,200},{NOTE_B4,400},{PAUZA,25},
  {NOTE_B3,200}, {NOTE_B3,200}, {NOTE_B4,300}, {NOTE_A4,100},{NOTE_A4,200}, {NOTE_G4,200}, {PAUZA,200},
  {NOTE_E5,400},{NOTE_C5,200}, {NOTE_A4,200}, {NOTE_FS4,200}, {NOTE_C5,200},{NOTE_B4,200},{NOTE_B4,400},{PAUZA,25},
  {NOTE_B3,200}, {NOTE_B3,200}, {NOTE_B4,300}, {NOTE_DS4,100},{NOTE_FS4,200}, {NOTE_E4,200}, {PAUZA,400}
};

// tick - 10
const uint16_t sound1[][2] PROGMEM = {
  {NOTE_B5, 10}, {NOTE_B7, 10}
};
const uint16_t sound2[][2] PROGMEM = {
  {NOTE_B0, 20}
};

unsigned long toneMillis;
uint8_t tonePlaying = 0;

unsigned long melodyMillis;
uint8_t melodyPlaying = 0;
uint16_t melodyStep = 0;
size_t melodySize = 0;
float melodyTempo = 1;
const float tempos[7] PROGMEM = { 1.4, 1.2, 1.1, 1, 0.9, 0.75, 0.6 };
const uint8_t melodyOctave = 1; // октава воспроизведения мелодий (лучше не трогать)

void SetTempo(uint8_t val) {
  melodyTempo = pgm_read_float(&tempos[val - 1]);
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
  melodyMillis = millis() + (float) GetMelodyData(melodyPlaying,melodyStep,1) * melodyTempo;
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
    case 5:
      return pgm_read_word(&melody5[step][item]); 
    // sounds
    case 10:
      return pgm_read_word(&sound1[step][item]);  
    case 11:
      return pgm_read_word(&sound2[step][item]);  
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
    case 5:
      return sizeof(melody5) / sizeof(melody5[0]); 
    // sounds
    case 10:
      return sizeof(sound1) / sizeof(sound1[0]); 
    case 11:
      return sizeof(sound2) / sizeof(sound2[0]); 
  }
}

void PlaySandPushTone() {
  PlayMelody(10);
}
