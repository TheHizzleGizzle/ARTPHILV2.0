const HISTORY_KEY = 'metaprompt_history';
const MAX_HISTORY = 50;

export function getHistory() {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

export function saveToHistory(entry) {
  try {
    const history = getHistory();
    
    // Add new entry at the end
    history.push(entry);
    
    // Keep only the last MAX_HISTORY entries
    const trimmedHistory = history.slice(-MAX_HISTORY);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    
    return true;
  } catch (error) {
    console.error('Error saving to history:', error);
    return false;
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
}

export function deleteFromHistory(id) {
  try {
    const history = getHistory();
    const filtered = history.filter(entry => entry.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting from history:', error);
    return false;
  }
}
