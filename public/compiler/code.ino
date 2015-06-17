#include <Servo.h>
#include <Sumo.h>

void setup() {
  start();
  stop();
}

void loop() {
  if (VASTANE_VASAK) {
    edasi();
    viivitus(0);
  } else {
    edasi();
    viivitus(0);
  }
}
