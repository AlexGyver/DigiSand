#pragma once
#include <Arduino.h>

typedef void (*TimerCallback)();

class Timer {
   public:
    // конструктор

    // пустой
    Timer() {}

    // указать время. Таймер сам запустится в режиме интервала!
    Timer(uint32_t ms, uint32_t seconds = 0, uint32_t minutes = 0, uint32_t hours = 0, uint32_t days = 0) {
        setTime(ms, seconds, minutes, hours, days);
        start();
    }

    // ========= JAVASCRIPT =========
    // запуск в режиме интервала с указанием времени в мс
    void setInterval(uint32_t ms) {
        prd = ms;
        start();
    }

    // запуск в режиме интервала с указанием обработчика и времени в мс
    void setInterval(TimerCallback callback, uint32_t ms) {
        prd = ms;
        this->callback = callback;
        start();
    }

    // запуск в режиме таймаута с указанием времени в мс
    void setTimeout(uint32_t ms) {
        prd = ms;
        start(true);
    }

    // запуск в режиме таймаута с указанием обработчика и времени в мс
    void setTimeout(TimerCallback callback, uint32_t ms) {
        prd = ms;
        this->callback = callback;
        start(true);
    }

    // =========== MANUAL ===========
    // указать время
    void setTime(uint32_t ms, uint32_t seconds = 0, uint32_t minutes = 0, uint32_t hours = 0, uint32_t days = 0) {
        prd = seconds;
        if (minutes) prd += minutes * 60ul;
        if (hours) prd += hours * 3600ul;
        if (days) prd += days * 86400ul;
        if (prd) prd *= 1000ul;
        prd += ms;
    }

    // запустить в режиме интервала. Передать true для однократного срабатывания (режим таймаута)
    void start(bool once = false) {
        if (prd) {
            tmr = millis();
            mode = once ? 2 : 1;
        }
    }

    // остановить
    void stop() {
        mode = 0;
    }

    // состояние (запущен?)
    bool state() {
        return mode;
    }

    // подключить функцию-обработчик вида void f()
    void attach(TimerCallback callback) {
        this->callback = callback;
    }

    // отключить функцию-обработчик
    void detach() {
        callback = nullptr;
    }

    // тикер, вызывать в loop. Вернёт true, если сработал
    bool tick() {
        if (mode && millis() - tmr >= prd) {
            if (callback) callback();
            if (mode == 1) start();
            else stop();
            return 1;
        }
        return 0;
    }
    operator bool() {
        return tick();
    }

   private:
    uint8_t mode = 0;  // 0 stop, 1 period, 2 timeout
    uint32_t tmr = 0, prd = 0;
    TimerCallback callback = nullptr;
};