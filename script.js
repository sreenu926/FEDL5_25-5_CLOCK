// 1. Function Wrapper (Immediately Invoked Function Expression - IIFE):
    // !(function () { ... })();
    // This is an IIFE, a function that executes immediately after it's defined. 
    // It wraps the entire code to ensure variables and functions defined within this scope don't leak into the global namespace.
  
!(function () {
  "use strict"; // 2. Strict Mode: This activates "strict mode" in JavaScript, which helps catch potential errors during development.

    // e Class (Length Control):
    //     This class represents a component for controlling the length (break or session duration) of the timer.
    //     It takes props (properties) like title, length, onClick, etc., to display the label, current length value, & buttons.
    
    class e extends React.Component {
    render() {
      return React.createElement(
        "div",
        { className: "length-control" },
        React.createElement(
          "div",
          { id: this.props.titleID },
          this.props.title
        ),
        React.createElement(
          "button",
          {
            className: "btn-level",
            id: this.props.minID,
            onClick: this.props.onClick,
            value: "-",
          },
          React.createElement("i", { className: "fa fa-arrow-down fa-2x" })
        ),
        React.createElement(
          "div",
          { className: "btn-level", id: this.props.lengthID },
          this.props.length
        ),
        React.createElement(
          "button",
          {
            className: "btn-level",
            id: this.props.addID,
            onClick: this.props.onClick,
            value: "+",
          },
          React.createElement("i", { className: "fa fa-arrow-up fa-2x" })
        )
      );
    }
  }

    // t Class (Main Timer):
    //     This is the main component of the Pomodoro timer.
    //     It manages the state (data) of the timer, including break length, session length, timer state (running/stopped), 
    //     timer type (Session/Break), timer value (in seconds), interval ID for the timer functionality, alarm color, and 
    //     a reference to the audio element for the beep sound.
         
    class t extends React.Component {
    constructor(e) {
      super(e),
        (this.state = {
          brkLength: 5,
          seshLength: 25,
          timerState: "stopped",
          timerType: "Session",
          timer: 1500,
          intervalID: "",
          alarmColor: { color: "white" },
        }),
        (this.setBrkLength = this.setBrkLength.bind(this)),
        (this.setSeshLength = this.setSeshLength.bind(this)),
        (this.lengthControl = this.lengthControl.bind(this)),
        (this.timerControl = this.timerControl.bind(this)),
        (this.beginCountDown = this.beginCountDown.bind(this)),
        (this.decrementTimer = this.decrementTimer.bind(this)),
        (this.phaseControl = this.phaseControl.bind(this)),
        (this.warning = this.warning.bind(this)),
        (this.buzzer = this.buzzer.bind(this)),
        (this.switchTimer = this.switchTimer.bind(this)),
        (this.clockify = this.clockify.bind(this)),
        (this.reset = this.reset.bind(this));
    }
      // It includes various methods for:
      //   1.setBrkLength and setSeshLength: Update the break and session length based on user interaction with the length control component.
      //   2.lengthControl: Handles increment/decrement for break and session lengths, ensuring they stay within valid ranges.
      //   3.timerControl: Starts or stops the timer based on its current state.
      //   4.beginCountDown: Starts the timer by setting up an interval that decrements the timer value every second.
      //   5.decrementTimer: Decrements the timer value in the state.
      //   6.phaseControl: Handles the logic when the timer reaches 0. It triggers warnings, buzzer sound, and switches between session and break phases.
      //   7.warning: Changes the background color of the timer display based on remaining time (red for less than a minute).
      //   8.buzzer: Plays the beep sound when the timer reaches 0.
      //   9.switchTimer: Updates the timer state (type and value) when switching between session and break phases.
      //   10.clockify: Formats the remaining time in minutes and seconds for display.
      //   11.reset: Resets the timer to its initial state.
    
    setBrkLength(e) {
      this.lengthControl(
        "brkLength",
        e.currentTarget.value,
        this.state.brkLength,
        "Session"
      );
    }
    setSeshLength(e) {
      this.lengthControl(
        "seshLength",
        e.currentTarget.value,
        this.state.seshLength,
        "Break"
      );
    }
    lengthControl(e, t, s, i) {
      "running" !== this.state.timerState &&
        (this.state.timerType === i
          ? "-" === t && 1 !== s
            ? this.setState({ [e]: s - 1 })
            : "+" === t && 60 !== s && this.setState({ [e]: s + 1 })
          : "-" === t && 1 !== s
          ? this.setState({ [e]: s - 1, timer: 60 * s - 60 })
          : "+" === t &&
            60 !== s &&
            this.setState({ [e]: s + 1, timer: 60 * s + 60 }));
    }
    timerControl() {
      "stopped" === this.state.timerState
        ? (this.beginCountDown(), this.setState({ timerState: "running" }))
        : (this.setState({ timerState: "stopped" }),
          this.state.intervalID && this.state.intervalID.cancel());
    }
    beginCountDown() {
      var e, t, s, i, a, r;
      this.setState({
        intervalID:
          ((e = () => {
            this.decrementTimer(), this.phaseControl();
          }),
          (t = 1e3),
          (i = new Date().getTime() + t),
          (a = null),
          (r = function () {
            return (i += t), (a = setTimeout(r, i - new Date().getTime())), e();
          }),
          (s = function () {
            return clearTimeout(a);
          }),
          (a = setTimeout(r, i - new Date().getTime())),
          { cancel: s }),
      });
    }
    decrementTimer() {
      this.setState({ timer: this.state.timer - 1 });
    }
    phaseControl() {
      let e = this.state.timer;
      this.warning(e),
        this.buzzer(e),
        e < 0 &&
          (this.state.intervalID && this.state.intervalID.cancel(),
          "Session" === this.state.timerType
            ? (this.beginCountDown(),
              this.switchTimer(60 * this.state.brkLength, "Break"))
            : (this.beginCountDown(),
              this.switchTimer(60 * this.state.seshLength, "Session")));
    }
    warning(e) {
      e < 61
        ? this.setState({ alarmColor: { color: "#a50d0d" } })
        : this.setState({ alarmColor: { color: "white" } });
    }
    buzzer(e) {
      0 === e && this.audioBeep.play();
    }
    switchTimer(e, t) {
      this.setState({ timer: e, timerType: t, alarmColor: { color: "white" } });
    }
    clockify() {
      if (this.state.timer < 0) return "00:00";
      let e = Math.floor(this.state.timer / 60),
        t = this.state.timer - 60 * e;
      return (
        (t = t < 10 ? "0" + t : t), (e = e < 10 ? "0" + e : e), e + ":" + t
      );
    }
    reset() {
      this.setState({
        brkLength: 5,
        seshLength: 25,
        timerState: "stopped",
        timerType: "Session",
        timer: 1500,
        intervalID: "",
        alarmColor: { color: "white" },
      }),
        this.state.intervalID && this.state.intervalID.cancel(),
        this.audioBeep.pause(),
        (this.audioBeep.currentTime = 0);
    }
      
      // The render method defines the JSX (JavaScript XML) structure of the timer UI. 
      // It uses React components to display elements like the title, length control components, timer display, start/stop, & reset buttons, and author information.
   
      render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "main-title" },
          "FEL5: 25 + 5 Clock"
        ),
        React.createElement(e, {
          addID: "break-increment",
          length: this.state.brkLength,
          lengthID: "break-length",
          minID: "break-decrement",
          onClick: this.setBrkLength,
          title: "Break Length",
          titleID: "break-label",
        }),
        React.createElement(e, {
          addID: "session-increment",
          length: this.state.seshLength,
          lengthID: "session-length",
          minID: "session-decrement",
          onClick: this.setSeshLength,
          title: "Session Length",
          titleID: "session-label",
        }),
        React.createElement(
          "div",
          { className: "timer", style: this.state.alarmColor },
          React.createElement(
            "div",
            { className: "timer-wrapper" },
            React.createElement(
              "div",
              { id: "timer-label" },
              this.state.timerType
            ),
            React.createElement("div", { id: "time-left" }, this.clockify())
          )
        ),
        React.createElement(
          "div",
          { className: "timer-control" },
          React.createElement(
            "button",
            { id: "start_stop", onClick: this.timerControl },
            React.createElement("i", { className: "fa fa-play fa-2x" }),
            React.createElement("i", { className: "fa fa-pause fa-2x" })
          ),
          React.createElement(
            "button",
            { id: "reset", onClick: this.reset },
            React.createElement("i", { className: "fa fa-refresh fa-2x" })
          )
        ),
        React.createElement(
          "div",
          { className: "author" },
          " ",
          "25 + 5 Clock by ",
          React.createElement("br", null),
          React.createElement(
            "a",
            {
              href: "https://github.com/sreenu926?tab=repositories",
              target: "_blank",
              rel: "noreferrer",
            },
            "Nagasreenivasarao P"
          )
        ),
        React.createElement("audio", {
          id: "beep",
          preload: "auto",
          ref: (e) => {
            this.audioBeep = e;
          },
          src: "https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav",
        })
      );
    }
  }
    // 4. Rendering the Application:
            // ReactDOM.createRoot(document.getElementById("app")).render(React.createElement(t, null));
            // This line renders the t (main timer) component to the element with the ID "app" in the HTML document.
    
  ReactDOM.createRoot(document.getElementById("app")).render(
    React.createElement(t, null)
  );
})();
