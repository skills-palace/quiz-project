/**
 * Same move rules as the former @dnd-kit handleDragEnd, for tap-to-place interactions.
 * `overId` may be a blank id or "quizItems" for the word bank.
 */
export function findContainerForState(state, id) {
  if (id === "quizItems" || id === "root") {
    return "root";
  }
  if (id in state) {
    return id;
  }

  return Object.keys(state).find((key) => {
    if (key === "root") {
      return state[key].find((ele) => ele.id === id);
    }
    return state[key]?.id === id;
  });
}

export function applyMoveToItems(state, activeId, overId) {
  if (overId == null) {
    return state;
  }

  const overNorm = overId === "quizItems" ? "root" : overId;
  const activeContainer = findContainerForState(state, activeId);
  const overContainer = findContainerForState(state, overNorm);

  if (!activeContainer || !overContainer) {
    return state;
  }

  if (activeContainer === "root" && overContainer === "root") {
    return state;
  }

  if (overContainer === "root") {
    const activeItem = state[activeContainer];
    if (activeItem == null) {
      return state;
    }
    return {
      ...state,
      [activeContainer]: null,
      root: [...state.root, activeItem],
    };
  }

  if (activeContainer === "root") {
    const activeIdx = state.root.findIndex((item) => item.id === activeId);
    if (activeIdx < 0) {
      return state;
    }
    const activeItem = state.root[activeIdx];
    const overItem = state[overContainer];
    const update = [...state.root];
    if (overItem) {
      update.push(overItem);
    }
    update.splice(activeIdx, 1);

    return {
      ...state,
      root: update,
      [overContainer]: activeItem,
    };
  }

  const activeItem = state[activeContainer];
  const overItem = state[overContainer];

  return {
    ...state,
    [activeContainer]: overItem,
    [overContainer]: activeItem,
  };
}
