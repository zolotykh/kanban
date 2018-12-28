export function displayedColumns(state) {
  if (state.hoveredColumn) {
    const fromIndex = state.movableColumn.columnIndex;
    const toIndex = state.hoveredColumn.columnIndex;

    const columns = state.boards[state.movableColumn.boardIndex].columns.slice();

    const fromColumn = columns.splice(fromIndex, 1)[0];

    columns.splice(toIndex, 0, fromColumn);

    state.displayedColumns = columns;
  }
}

export function hoveredColumn(state, column) {
  state.hoveredColumn = column;
}

export function movableColumn(state, column) {
  state.movableColumn = column
}

export function hoveredCard(state, column) {
  state.hoveredCard = column;
}

export function movableCard(state, card) {
  state.movableCard = card;
}

export function readyForColumnMoving(state, bool) {
  state.readyForColumnMoving = !!bool;
}

export function readyForCardMoving(state, bool) {
  state.readyForCardMoving = !!bool;
}

export function columnMovingEnd(state) {
  if (state.movableColumn) {
    if (state.hoveredColumn) {
      const {boardIndex: fromBoardIndex, columnIndex: fromColumnIndex} = state.movableColumn;
      const {boardIndex: toBoardIndex, columnIndex: toColumnIndex} = state.hoveredColumn;

      const columns = state.boards[toBoardIndex].columns;
      const column = columns.splice(fromColumnIndex, 1)[0];

      columns.splice(toColumnIndex, 0, column);
    }

    state.movableColumn = null;
    state.hoveredColumn = null;
    state.displayedColumns = null;
  }

  state.readyForColumnMoving = false;
}

export function cardMovingEnd(state, {placement}) {
  if (state.movableCard) {
    if (placement) {
      const {boardIndex: fromBoardIndex, columnIndex: fromColumnIndex, cardIndex: fromCardIndex} = state.movableCard;
      const {boardIndex: toBoardIndex, columnIndex: toColumnIndex, cardIndex: toCardIndex} = placement;

      const fromCards = state.boards[fromBoardIndex].columns[fromColumnIndex].cards;
      const toCards = state.boards[toBoardIndex].columns[toColumnIndex].cards;

      const card = fromCards.splice(fromCardIndex, 1)[0];

      console.log(card)
      toCards.splice(toCardIndex, 0, card);
    }

    state.movableCard = null;
    state.hoveredCard = null;
  }

  state.readyForCardMoving = false;
}

export function addBoard(state) {
  state.boards.push({
    id: new Date().getTime(),
    name: 'New board',
    columns: [],
  });
}

export function addColumn(state, {boardIndex}) {
  state.boards[boardIndex].columns.push({
    id: new Date().getTime(),
    name: 'New column',
    cards: [],
  });

  Object.assign(state.boards, state.boards);
}

export function addCard(state, {boardIndex, columnIndex}) {
  state.boards[boardIndex].columns[columnIndex].cards.push({
    name: 'New card',
  });
}

export function removeBoard(state, {boardIndex}) {
  state.boards.splice(boardIndex, 1);
}

export function removeColumn(state, {boardIndex, columnIndex}) {
  state.boards[boardIndex].columns.splice(columnIndex, 1);
}

export function removeCard(state, {boardIndex, columnIndex, cardIndex}) {
  state.boards[boardIndex].columns[columnIndex].cards.splice(cardIndex, 1);
}

export function updateBoard(state, {boardIndex, board}) {
  state.boards[boardIndex] = board;
}

export function updateColumn(state, {boardIndex, columnIndex, column}) {
  state.boards[boardIndex].columns[columnIndex] = column;
}

export function updateCard(state, {boardIndex, columnIndex, cardIndex, card}) {
  state.boards[boardIndex].columns[columnIndex].cards[cardIndex] = card;
}

export function authorizationState(state, {accessToken, isSuccessAuth, login}) {
  state.accessToken = accessToken;
  state.isSuccessAuth = isSuccessAuth;
  state.login = login;
}

export function logout(state) {
  state.accessToken = null;
  state.login = null;
  state.isSuccessAuth = false;
}
