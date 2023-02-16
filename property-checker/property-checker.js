export class PropertyChecker {
  constructor(machine) {
    this.machine = machine;
    this.states = this.exploreAllStates();
    console.log(`Total states: ${this.states.length}`);
  }

  exploreAllStates() {
    const states = [];
    const actions = this.machine.events;

    const currentStates = [this.machine.initialState];
    while (currentStates.length > 0) {
      const currentState = currentStates.shift();
      if (!states.some(state => this.isSame(state, currentState))) {
        states.push(currentState);
        currentState.transitions = actions
          .map(action => ({
            action,
            state: this.machine.transition(currentState, action),
          }))
          .filter(transition => transition.state.changed);
        currentStates.push(
          ...currentState.transitions.map(transition => transition.state)
        );
      }
    }
    return states;
  }

  checkProperty(property) {
    let errorState;

    switch (property.type) {
      case 'globally':
        errorState = this.states.find(state => !property.check(state));
        if (errorState) {
          return {
            holds: false,
            exampleTrace: this.getTrace(this.states[0], errorState),
            initialState: this.states[0],
            errorState,
          };
        }
        return { holds: true };
      case 'exists':
        return { holds: this.states.some(state => property.check(state)) };
      default:
        throw new Error(`Unknown property type ${property.type}`);
    }
  }

  getTrace(initialState, toState) {
    const seenStates = [];
    const fringes = [{ trace: [], state: initialState }];
    while (fringes.length > 0) {
      const { trace, state } = fringes.shift();
      if (this.isSame(state, toState)) {
        return trace;
      }

      seenStates.push(state);
      state.transitions.forEach(transition => {
        if (
          !seenStates.some(seenState =>
            this.isSame(seenState, transition.state)
          )
        ) {
          const newTrace = [...trace, transition.action];
          fringes.push({ trace: newTrace, state: transition.state });
          seenStates.push(transition.state);
        }
      });
    }

    throw new Error(`Could not find path to state: ${JSON.stringify(toState)}`);
  }

  isSame(state1, state2) {
    const props = Object.keys(state1.context);
    return (
      state1.value === state2.value &&
      props.every(prop => state1.context[prop] === state2.context[prop])
    );
  }
}
