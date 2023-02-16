import { assign, createMachine } from 'xstate';

const isNotMax = (context, _) => context.count < 100;
const winCondition = (context, _) => context.count === 49;
const divisibleBy = num => (context, _) => context.count % num === 0;

export const counterMachine = createMachine({
  predictableActionArguments: true,
  id: 'counter',
  context: {
    count: 0,
  },
  initial: 'active',
  states: {
    active: {
      always: [
        {
          cond: winCondition,
          target: 'win',
        },
      ],
      on: {
        IncrementBy11: [
          {
            actions: assign({ count: context => context.count + 11 }),
            cond: isNotMax,
            target: 'active',
          },
        ],
        DivideBy17: [
          {
            actions: assign({
              count: context => Math.floor(context.count / 17),
            }),
            cond: divisibleBy(17),
            target: 'active',
          },
        ],
        Modulo13: [
          {
            actions: assign({
              count: context => Math.floor(context.count % 13),
            }),
            target: 'active',
          },
        ],
      },
    },
    win: {
      type: 'final',
    },
  },
});
