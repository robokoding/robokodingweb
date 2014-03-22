#include <Servo.h>
#include <Sumorobot.h>

void setup() {
  start();
}
void loop() {
  if (LINE_RIGHT) {
    left(0);
  } else if (LINE_LEFT) {
    right(0);
  } else {
    forward(0);
  }
}
