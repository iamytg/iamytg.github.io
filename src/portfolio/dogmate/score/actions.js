export const REFRESH = 'REFRESH';
export const NEW_ENTRY = 'NEW_ENTRY';
export const CHANGE_ENTRY = 'CHANGE_ENTRY';
export const SAVE = 'SAVE';

export function refresh (list) {
  return {type: REFRESH, list: list};
}

export function newEntry () {
  return {type: NEW_ENTRY};
}

export function changeEntry (change) {
  return {type: CHANGE_ENTRY, change: change};
}

export function save (list) {
  return {type: SAVE, list: list};
}
