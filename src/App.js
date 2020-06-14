import React, { useState, useEffect } from "react";
import Gamepad from "./lib/Gamepad";
import GamepadInfo from "./GamepadInfo";
import "./App.css";

const gamepad = new Gamepad();
const { CONNECTED, DISCONNECTED } = Gamepad;

function App() {
  const initialGamepadStatusText = "Connect a gamepad and press any button";
  const gamepadConnectedStatusText = "Gamepad is connected";
  const [gamepadStatus, setGamepadStatus] = useState(gamepad.state);
  const [gamepadStatusText, setGamepadStatusText] = useState(
    initialGamepadStatusText
  );
  const [buttons, setButtons] = useState(gamepad.btnstate);
  const [axes, setAxes] = useState(gamepad.axes);

  useEffect(() => {
    if (gamepadStatus === CONNECTED) {
      setGamepadStatusText(gamepadConnectedStatusText);
    }

    if (gamepadStatus === DISCONNECTED) {
      setGamepadStatusText(initialGamepadStatusText);
    }
  }, [gamepadStatus]);

  useEffect(() => {
    let request = null;

    // run loop
    const probe = () => {
      const [buttons, axes] = gamepad.probe(navigator.getGamepads());
      setButtons({ ...buttons });
      setAxes({ ...axes });
      request = requestAnimationFrame(probe);
    };

    const stopProbe = () => {
      if (request) {
        cancelAnimationFrame(request);
      }
    };

    window.addEventListener("gamepadconnected", () => {
      gamepad.connect();
      probe();
      setGamepadStatus(CONNECTED);
    });

    window.addEventListener("gamepaddisconnected", () => {
      gamepad.disconnect();
      stopProbe();
      setGamepadStatus(DISCONNECTED);
    });
  }, []);

  return (
    <div className="App">
      <p>{gamepadStatusText}</p>
      {gamepadStatus === CONNECTED && (
        <GamepadInfo buttons={buttons} axes={axes} />
      )}
    </div>
  );
}

export default App;
