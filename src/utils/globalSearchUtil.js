// globalSearchUtil.js
// Utility for global search across menu, modules, and optionally data

/**
 * Returns filtered menu/module items based on search text
 * @param {string} searchText
 * @param {Array} menuItems - Array of menu/module objects with title, path, etc.
 * @returns {Array}
 */
export function filterMenuItems(searchText, menuItems) {
  if (!searchText.trim()) return [];
  const lower = searchText.toLowerCase();
  return menuItems.filter(item =>
    item.title.toLowerCase().includes(lower) ||
    (item.path && item.path.toLowerCase().includes(lower))
  );
}

/**
 * Returns filtered data items based on search text and keys
 * @param {string} searchText
 * @param {Array} data - Array of objects
 * @param {Array} keys - Keys to search in each object
 * @returns {Array}
 */
export function filterDataItems(searchText, data, keys) {
  if (!searchText.trim()) return [];
  const lower = searchText.toLowerCase();
  return data.filter(item =>
    keys.some(key =>
      String(item[key] || "").toLowerCase().includes(lower)
    )
  );
}

// You can extend with more global search helpers as needed
