import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Trash2, Edit2, FileText, Database } from 'lucide-react';
import { Template, KnowledgeBaseItem } from '../data/templates';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  knowledgeBase: KnowledgeBaseItem[];
  onDeleteTemplate: (id: string) => void;
  onDeleteKnowledgeItem: (id: string) => void;
  onManageTemplatePermissions: (template: Template) => void;
  onManageKnowledgePermissions: (item: KnowledgeBaseItem) => void;
}

export function SettingsPanel({
  isOpen,
  onClose,
  templates,
  knowledgeBase,
  onDeleteTemplate,
  onDeleteKnowledgeItem,
  onManageTemplatePermissions,
  onManageKnowledgePermissions
}: SettingsPanelProps) {
  const customTemplates = templates.filter(t => t.isCustom);

  const handleDeleteTemplate = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      onDeleteTemplate(id);
      toast.success('Template deleted successfully');
    }
  };

  const handleDeleteKnowledgeItem = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      onDeleteKnowledgeItem(id);
      toast.success('Knowledge base item deleted');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Settings & Management</DialogTitle>
          <DialogDescription>
            Manage your custom templates, knowledge base, and permissions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="templates" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full">
            <TabsTrigger value="templates" className="flex-1 gap-2">
              <FileText className="w-4 h-4" />
              Templates ({customTemplates.length})
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex-1 gap-2">
              <Database className="w-4 h-4" />
              Knowledge Base ({knowledgeBase.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="flex-1 mt-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {customTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No custom templates created yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Click "Create → Custom Template" in the header to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-lg p-4 hover:border-[#2563EB] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{template.title}</h4>
                            <Badge variant="outline">{template.category}</Badge>
                            {template.permissions && template.permissions.length > 0 && (
                              <Badge variant="secondary" className="gap-1">
                                <Shield className="w-3 h-3" />
                                {template.permissions.length} rules
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          {template.customFields && template.customFields.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {template.customFields.length} custom field(s)
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onManageTemplatePermissions(template)}
                            className="gap-2"
                          >
                            <Shield className="w-4 h-4" />
                            Permissions
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id, template.title)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="knowledge" className="flex-1 mt-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {knowledgeBase.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No knowledge base items yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Click "Create → Knowledge Base" in the header to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {knowledgeBase.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:border-[#2563EB] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <Badge variant="outline">{item.category}</Badge>
                            {item.permissions && item.permissions.length > 0 && (
                              <Badge variant="secondary" className="gap-1">
                                <Shield className="w-3 h-3" />
                                {item.permissions.length} rules
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {item.content}
                          </p>
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onManageKnowledgePermissions(item)}
                            className="gap-2"
                          >
                            <Shield className="w-4 h-4" />
                            Permissions
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteKnowledgeItem(item.id, item.title)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
