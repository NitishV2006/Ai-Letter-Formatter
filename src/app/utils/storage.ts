import { AccountData } from '../components/AccountManager';

const STORAGE_KEYS = {
  ACCOUNT_DATA: 'letter-agent-account-data',
  CUSTOM_TEMPLATES: 'letter-agent-custom-templates',
  KNOWLEDGE_BASE: 'letter-agent-knowledge-base'
};

// Account Data Storage
export function saveAccountData(data: AccountData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNT_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save account data:', error);
  }
}

export function loadAccountData(): AccountData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNT_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load account data:', error);
    return null;
  }
}

export function clearAccountData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACCOUNT_DATA);
  } catch (error) {
    console.error('Failed to clear account data:', error);
  }
}

// Custom Templates Storage
export function saveCustomTemplates(templates: any[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TEMPLATES, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save custom templates:', error);
  }
}

export function loadCustomTemplates(): any[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load custom templates:', error);
    return [];
  }
}

// Knowledge Base Storage
export function saveKnowledgeBase(items: any[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASE, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save knowledge base:', error);
  }
}

export function loadKnowledgeBase(): any[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BASE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load knowledge base:', error);
    return [];
  }
}

// Export all storage keys for reference
export { STORAGE_KEYS };
