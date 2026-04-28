/**
 * Find which top-level key holds an item id (e.g. "root", group id).
 * @param {Record<string, { items: { id: string }[] }>} state
 * @param {string} itemId
 * @returns {string | undefined}
 */
export function findContainerKeyForItemId(state, itemId) {
  for (const key of Object.keys(state)) {
    const ar = state[key]?.items;
    if (Array.isArray(ar) && ar.some((x) => x.id === itemId)) {
      return key;
    }
  }
  return undefined;
}

/**
 * Remove item from fromKey, append to toKey. No-op if same key or item missing.
 * @param {Record<string, { title?: string; items: { id: string; title: string; mark?: number }[] }>} state
 * @param {string} itemId
 * @param {string} fromKey
 * @param {string} toKey
 */
export function moveItemBetween(state, itemId, fromKey, toKey) {
  if (fromKey === toKey) return state;
  const fromBlock = state[fromKey];
  const toBlock = state[toKey];
  if (!fromBlock?.items || !toBlock?.items) return state;
  const item = fromBlock.items.find((i) => i.id === itemId);
  if (!item) return state;
  return {
    ...state,
    [fromKey]: {
      ...fromBlock,
      items: fromBlock.items.filter((i) => i.id !== itemId),
    },
    [toKey]: {
      ...toBlock,
      items: [...toBlock.items, item],
    },
  };
}
