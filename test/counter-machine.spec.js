import assert from 'node:assert';
import { PropertyChecker } from '../property-checker/property-checker.js';
import { counterMachine } from '../src/counter-machine.js';

describe('Counter machine', () => {
  let propertyChecker;

  before(() => {
    propertyChecker = new PropertyChecker(counterMachine);
  });

  it('keeps the counter between 0 and 100', async () => {
    const counterProperty = {
      type: 'globally',
      check: state => state.context.count >= 0 && state.context.count <= 100,
    };
    const result = propertyChecker.checkProperty(counterProperty);
    assert.equal(
      result.holds,
      true,
      `Example trace where property does not hold:
Initial state: ${JSON.stringify(result.initialState.context)}
${result.exampleTrace.join('\n')}
Error state: ${JSON.stringify(result.errorState.context)}`
    );
  });

  it('can reach the win state', async () => {
    const winIsReachableProperty = {
      type: 'exists',
      check: state => state.value === 'win',
    };
    const result = propertyChecker.checkProperty(winIsReachableProperty);
    assert.equal(result.holds, true);
  });
});
