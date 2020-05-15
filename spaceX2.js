maxSpeedSmall = 5;
maxSpeedBig = 25;

minDockSpeed = 6
maxDockSpeed = 50;

translationMultiplier = 0.5
rotationMultiplier = 0.1

deadZone = 0.05

currentRotation = {x: 0, y: 0, y: 0}
currentPosition = {x: 0, y: 0, y: 0}

targetRotationRate = {x: 0, y: 0, y: 0}
targetTranslationRate = {x: 0, y: 0, y: 0}

currentRotationRate = {x: 0, y: 0, z: 0}
currentTranslationRate = {x: 0, y: 0, z: 0}

rotationFunction = {
  x: {
    dec: pitchUp,
    inc: pitchDown
  },
  y: {
    dec: yawLeft,
    inc: yawRight
  },
  z: {
    dec: rollLeft,
    inc: rollRight
  }
}

translationFunction = {
  x: {
    dec: translateBackward,
    inc: translateForward
  },
  y: {
    dec: translateRight,
    inc: translateLeft
  },
  z: {
    dec: translateUp,
    inc: translateDown
  }
}

intervalId = setInterval(() => {
  if (isGameOver) {
    clearInterval(intervalId)
  }

  currentRotation.x = parseFloat(fixedRotationX) // Pitch
  currentRotation.y = parseFloat(fixedRotationY) // Yaw
  currentRotation.z = parseFloat(fixedRotationZ) // Roll

  a = camera.position.z - issObject.position.z
  r = camera.position.x - issObject.position.x
  i = camera.position.y - issObject.position.y;
  currentPosition.x = Math.sqrt(a * a + r * r + i * i); // Distance
  currentPosition.y = camera.position.x // Left/Right
  currentPosition.z = camera.position.y // Up/Down

  targetRotationRate.x = Math.min(roundAwayFromZero(rotationMultiplier * currentRotation.x), maxSpeedBig)
  targetRotationRate.y = Math.min(roundAwayFromZero(rotationMultiplier * currentRotation.y), maxSpeedSmall)
  targetRotationRate.z = Math.min(roundAwayFromZero(rotationMultiplier * currentRotation.z), maxSpeedSmall)

  targetTranslationRate.x = Math.max(Math.min(roundAwayFromZero((translationMultiplier/2) * currentPosition.x), maxDockSpeed), minDockSpeed)
  targetTranslationRate.y = Math.min(roundAwayFromZero(translationMultiplier * (currentPosition.y+4)), maxSpeedBig) // todo: figure out why +4 is necesary
  targetTranslationRate.z = Math.min(roundAwayFromZero(translationMultiplier * currentPosition.z), maxSpeedBig)

  doMovement()
  doRotation()

  if(currentPosition.y < deadZone && currentPosition.z < deadZone) {
    doMovement(['x'])
  }
}, 200)
roundAwayFromZero = (value) => value >= 0 ? Math.ceil(value) : Math.floor(value)
doRotation = () => {
  for(let axis of ['x', 'y', 'z']) {
    if(currentRotationRate[axis] < targetRotationRate[axis]) {
      rotationFunction[axis].inc()
      currentRotationRate[axis] += 1
    } else if(currentRotationRate[axis] > targetRotationRate[axis]) {
      rotationFunction[axis].dec()
      currentRotationRate[axis] -= 1
    }
  }
}
doMovement = (axes=['y', 'z']) => {
  for(let axis of axes) {
    if(Math.abs(currentPosition[axis]) < deadZone) continue

    if(currentTranslationRate[axis] < targetTranslationRate[axis]) {
      translationFunction[axis].inc()
      currentTranslationRate[axis] += 1
    } else if(currentTranslationRate[axis] > targetTranslationRate[axis]) {
      translationFunction[axis].dec()
      currentTranslationRate[axis] -= 1
    }
  }
}
reset = () => {
  clearInterval(intervalId)
  resetMovement()
  resetPosition()
}
