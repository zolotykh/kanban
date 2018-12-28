const mutations = {
  displayedColumns(state) {
    if (state.hoveredColumn) {
      const fromIndex = state.movableColumn.columnIndex;
      const toIndex = state.hoveredColumn.columnIndex;

      const columns = state.boards[state.movableColumn.boardIndex].columns.slice();

      const fromColumn = columns.splice(fromIndex, 1)[0];

      columns.splice(toIndex, 0, fromColumn);

      state.displayedColumns = columns;
    }
  },
  hoveredColumn(state, column) {
    state.hoveredColumn = column;
  },
  movableColumn(state, column) {
    state.movableColumn = column
  },
  hoveredCard(state, column) {
    state.hoveredCard = column;
  },
  movableCard(state, card) {
    state.movableCard = card;
  },
  readyForColumnMoving(state, bool) {
    state.readyForColumnMoving = !!bool;
  },
  readyForCardMoving(state, bool) {
    state.readyForCardMoving = !!bool;
  },
  columnMovingEnd(state) {
    if (state.movableColumn) {
      if (state.hoveredColumn) {
        const { boardIndex: fromBoardIndex, columnIndex: fromColumnIndex } = state.movableColumn;
        const { boardIndex: toBoardIndex, columnIndex: toColumnIndex } = state.hoveredColumn;

        const columns = state.boards[toBoardIndex].columns;
        const column = columns.splice(fromColumnIndex, 1)[0];

        columns.splice(toColumnIndex, 0, column);
      }

      state.movableColumn = null;
      state.hoveredColumn = null;
      state.displayedColumns = null;
    }

    state.readyForColumnMoving = false;
  },
  cardMovingEnd(state, { placement }) {
    if (state.movableCard) {
      if (placement) {
        const { boardIndex: fromBoardIndex, columnIndex: fromColumnIndex, cardIndex: fromCardIndex } = state.movableCard;
        const { boardIndex: toBoardIndex, columnIndex: toColumnIndex, cardIndex: toCardIndex } = placement;

        const fromCards = state.boards[fromBoardIndex].columns[fromColumnIndex].cards;
        const toCards = state.boards[toBoardIndex].columns[toColumnIndex].cards;

        const card = fromCards.splice(fromCardIndex, 1)[0];

        toCards.splice(toCardIndex, 0, card);
      }

      state.movableCard = null;
      state.hoveredCard = null;
    }

    state.readyForCardMoving = false;
  },
  addBoard(state) {
    state.boards.push({
      id: new Date().getTime(),
      name: 'New board',
      columns: [],
    });
  },
  addColumn(state, { boardIndex }) {
    state.boards[boardIndex].columns.push({
      id: new Date().getTime(),
      name: 'New column',
      cards: [],
    });

    Object.assign(state.boards, state.boards);
  },
  addCard(state, { boardIndex, columnIndex }) {
    state.boards[boardIndex].columns[columnIndex].cards.push({
      name: 'New card',
    });
  },
  removeBoard(state, { boardIndex }) {
    state.boards.splice(boardIndex, 1);
  },
  removeColumn(state, { boardIndex, columnIndex }) {
    state.boards[boardIndex].columns.splice(columnIndex, 1);
  },
  removeCard(state, { boardIndex, columnIndex, cardIndex }) {
    state.boards[boardIndex].columns[columnIndex].cards.splice(cardIndex, 1);
  },
  updateBoard(state, { boardIndex, board}) {
    state.boards[boardIndex] = board;
  },
  updateColumn(state, { boardIndex, columnIndex, column }) {
    state.boards[boardIndex].columns[columnIndex] = column;
  },
  updateCard(state, { boardIndex, columnIndex, cardIndex, card }) {
    state.boards[boardIndex].columns[columnIndex].cards[cardIndex] = card;
  },
  authorizationState(state, { accessToken, isSuccessAuth, login }) {
    state.accessToken = accessToken;
    state.isSuccessAuth = isSuccessAuth;
    state.login = login;
  },
  logout(state) {
    state.accessToken = null;
    state.login = null;
    state.isSuccessAuth = false;
  },
};

export default mutations;
