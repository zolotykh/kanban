import * as mutations from '../../src/js/store/mutations';

describe('mutations', () => {
  test('displayedColumns', () => {

    const { displayedColumns } = mutations;

    const state = {
      movableColumn: { boardIndex: 0, columnIndex: 0 },
      hoveredColumn: { boardIndex: 0, columnIndex: 1 },
      boards: [
        {
          columns: [
            { id: 0 },
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
          ]
        }
      ]
    };

    displayedColumns(state);

    expect(state.displayedColumns).toBeInstanceOf(Array);
    expect(state.displayedColumns[0].id).toBe(1);
    expect(state.displayedColumns[1].id).toBe(0);
  });

  test('hoveredColumn', () => {
    const { hoveredColumn } = mutations;

    const state = {};

    hoveredColumn(state, { id: 0 });

    expect(state.hoveredColumn).toBeDefined();
    expect(state.hoveredColumn).toBeInstanceOf(Object);
    expect(state.hoveredColumn.id).toBe(0);
  });

  test('movableColumn', () => {
    const { movableColumn } = mutations;

    const state = {};

    movableColumn(state, { id: 0 });

    expect(state.movableColumn).toBeDefined();
    expect(state.movableColumn).toBeInstanceOf(Object);
    expect(state.movableColumn.id).toBe(0);
  });

  test('hoveredCard', () => {
    const { hoveredCard } = mutations;

    const state = {};

    hoveredCard(state, { id: 0 });

    expect(state.hoveredCard).toBeDefined();
    expect(state.hoveredCard).toBeInstanceOf(Object);
    expect(state.hoveredCard.id).toBe(0);
  });

  test('movableCard', () => {
    const { movableCard } = mutations;

    const state = {};

    movableCard(state, { id: 0 });

    expect(state.movableCard).toBeDefined();
    expect(state.movableCard).toBeInstanceOf(Object);
    expect(state.movableCard.id).toBe(0);
  });

  test('readyForColumnMoving', () => {
    const { readyForColumnMoving } = mutations;

    const state = {
      readyForColumnMoving: false
    };

    readyForColumnMoving(state, true);
    expect(state.readyForColumnMoving).toBeTruthy();

    readyForColumnMoving(state, false);
    expect(state.readyForColumnMoving).toBeFalsy();
  });

  test('readyForCardMoving', () => {
    const { readyForCardMoving } = mutations;

    const state = {
      readyForCardMoving: false
    };

    readyForCardMoving(state, true);
    expect(state.readyForCardMoving).toBeTruthy();

    readyForCardMoving(state, false);
    expect(state.readyForCardMoving).toBeFalsy();
  });
});
