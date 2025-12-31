import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TemplateSidebar } from './components/TemplateSidebar';
import { ContentInput } from './components/ContentInput';
import { DocumentPreview } from './components/DocumentPreview';
import { CustomTemplateBuilder } from './components/CustomTemplateBuilder';
import { KnowledgeBaseManager } from './components/KnowledgeBaseManager';
import { PermissionsManager } from './components/PermissionsManager';
import { SettingsPanel } from './components/SettingsPanel';
import { AccountManager, AccountData, defaultAccountData } from './components/AccountManager';
import { Template, KnowledgeBaseItem, templates as defaultTemplates, generateLetter } from './data/templates';
import { Toaster } from './components/ui/sonner';
import { 
  saveAccountData, 
  loadAccountData, 
  clearAccountData,
  saveCustomTemplates,
  loadCustomTemplates,
  saveKnowledgeBase,
  loadKnowledgeBase
} from './utils/storage';
import { toast } from 'sonner';

export default function App() {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(templates[0]);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Modal states
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isTemplateBuilderOpen, setIsTemplateBuilderOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [permissionsModal, setPermissionsModal] = useState<{
    isOpen: boolean;
    type: 'template' | 'knowledge';
    entity: Template | KnowledgeBaseItem | null;
  }>({ isOpen: false, type: 'template', entity: null });

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedAccountData = loadAccountData();
    if (loadedAccountData) {
      setAccountData(loadedAccountData);
    }

    const loadedCustomTemplates = loadCustomTemplates();
    if (loadedCustomTemplates.length > 0) {
      // Merge custom templates with default templates
      const customTemplates = loadedCustomTemplates.filter((t: Template) => t.isCustom);
      setTemplates([...defaultTemplates, ...customTemplates]);
    }

    const loadedKnowledgeBase = loadKnowledgeBase();
    if (loadedKnowledgeBase.length > 0) {
      setKnowledgeBase(loadedKnowledgeBase);
    }
  }, []);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setGeneratedContent(null);
  };

  const handleGenerate = (userInput: string, tone: string, includeCompliance: boolean) => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const letter = generateLetter(selectedTemplate, userInput, tone, includeCompliance, accountData || undefined);
      setGeneratedContent(letter);
      setIsGenerating(false);
    }, 1500);
  };

  const handleContentChange = (newContent: string) => {
    setGeneratedContent(newContent);
  };

  const handleSaveAccount = (data: AccountData) => {
    setAccountData(data);
    saveAccountData(data);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to clear all account data? This action cannot be undone.')) {
      clearAccountData();
      setAccountData(null);
      toast.success('Account data cleared');
    }
  };

  const handleSaveCustomTemplate = (template: Template) => {
    const newTemplates = [...templates, template];
    setTemplates(newTemplates);
    
    // Save only custom templates to localStorage
    const customTemplates = newTemplates.filter(t => t.isCustom);
    saveCustomTemplates(customTemplates);
  };

  const handleSaveKnowledgeBase = (items: KnowledgeBaseItem[]) => {
    setKnowledgeBase(items);
    saveKnowledgeBase(items);
  };

  const handleDeleteTemplate = (id: string) => {
    const newTemplates = templates.filter(t => t.id !== id);
    setTemplates(newTemplates);
    
    // Save only custom templates to localStorage
    const customTemplates = newTemplates.filter(t => t.isCustom);
    saveCustomTemplates(customTemplates);
    
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(templates[0] || null);
    }
  };

  const handleDeleteKnowledgeItem = (id: string) => {
    const newKnowledgeBase = knowledgeBase.filter(item => item.id !== id);
    setKnowledgeBase(newKnowledgeBase);
    saveKnowledgeBase(newKnowledgeBase);
  };

  const handleManageTemplatePermissions = (template: Template) => {
    setPermissionsModal({
      isOpen: true,
      type: 'template',
      entity: template
    });
  };

  const handleManageKnowledgePermissions = (item: KnowledgeBaseItem) => {
    setPermissionsModal({
      isOpen: true,
      type: 'knowledge',
      entity: item
    });
  };

  const handleSavePermissions = (permissions: any) => {
    if (!permissionsModal.entity) return;

    if (permissionsModal.type === 'template') {
      setTemplates(templates.map(t =>
        t.id === permissionsModal.entity!.id
          ? { ...t, permissions }
          : t
      ));
    } else {
      setKnowledgeBase(knowledgeBase.map(item =>
        item.id === permissionsModal.entity!.id
          ? { ...item, permissions }
          : item
      ));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC]">
      <Header
        onOpenTemplateBuilder={() => setIsTemplateBuilderOpen(true)}
        onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        accountData={accountData}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <TemplateSidebar
          selectedTemplate={selectedTemplate}
          onSelectTemplate={handleSelectTemplate}
          templates={templates}
        />

        <div className="flex-1 flex overflow-hidden">
          {selectedTemplate ? (
            <>
              <ContentInput
                selectedTemplate={selectedTemplate}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
              <DocumentPreview content={generatedContent} isGenerating={isGenerating} onContentChange={handleContentChange} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a template to get started</p>
            </div>
          )}
        </div>
      </div>

      <Toaster />

      {/* Modals */}
      <CustomTemplateBuilder
        isOpen={isTemplateBuilderOpen}
        onClose={() => setIsTemplateBuilderOpen(false)}
        onSave={handleSaveCustomTemplate}
      />

      <KnowledgeBaseManager
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
        knowledgeBase={knowledgeBase}
        onSave={handleSaveKnowledgeBase}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        templates={templates}
        knowledgeBase={knowledgeBase}
        onDeleteTemplate={handleDeleteTemplate}
        onDeleteKnowledgeItem={handleDeleteKnowledgeItem}
        onManageTemplatePermissions={handleManageTemplatePermissions}
        onManageKnowledgePermissions={handleManageKnowledgePermissions}
      />

      <PermissionsManager
        isOpen={permissionsModal.isOpen}
        onClose={() => setPermissionsModal({ ...permissionsModal, isOpen: false })}
        entityType={permissionsModal.type}
        entityName={permissionsModal.entity?.title || ''}
        currentPermissions={permissionsModal.entity?.permissions || []}
        onSave={handleSavePermissions}
      />

      <AccountManager
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        accountData={accountData || defaultAccountData}
        onSave={handleSaveAccount}
      />
    </div>
  );
}