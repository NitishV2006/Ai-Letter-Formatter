import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, Save } from 'lucide-react';
import { CustomField, Template } from '../data/templates';
import { toast } from 'sonner';

interface CustomTemplateBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Template) => void;
}

export function CustomTemplateBuilder({ isOpen, onClose, onSave }: CustomTemplateBuilderProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Student' | 'Faculty' | 'Corporate' | 'Investor'>('Corporate');
  const [icon, setIcon] = useState('FileText');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [templateStructure, setTemplateStructure] = useState('');

  const handleAddField = () => {
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false
    };
    setCustomFields([...customFields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const handleUpdateField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const handleSaveTemplate = () => {
    if (!title || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newTemplate: Template = {
      id: `custom-${Date.now()}`,
      title,
      description,
      category,
      icon,
      isCustom: true,
      customFields: customFields.length > 0 ? customFields : undefined
    };

    onSave(newTemplate);
    toast.success('Custom template created successfully!');
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategory('Corporate');
    setIcon('FileText');
    setCustomFields([]);
    setTemplateStructure('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Template</DialogTitle>
          <DialogDescription>
            Build a custom letter template with your own fields and structure
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Template Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Custom Business Letter"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(val) => setCategory(val as any)}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Investor">Investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this template's purpose"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g., FileText, Briefcase, Mail"
              />
              <p className="text-xs text-gray-500">Use any icon name from Lucide icons</p>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Custom Fields (Optional)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddField}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </Button>
            </div>

            {customFields.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-lg">
                No custom fields added. Click "Add Field" to create custom input fields for this template.
              </p>
            ) : (
              <div className="space-y-3">
                {customFields.map((field) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Field Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                          placeholder="Field name"
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Field Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(val) => handleUpdateField(field.id, { type: val as any })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Placeholder</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                          placeholder="Placeholder text"
                          className="h-9"
                        />
                      </div>
                    </div>

                    {field.type === 'select' && (
                      <div className="space-y-1">
                        <Label className="text-xs">Options (comma-separated)</Label>
                        <Input
                          value={field.options?.join(', ') || ''}
                          onChange={(e) => handleUpdateField(field.id, { 
                            options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                          })}
                          placeholder="Option 1, Option 2, Option 3"
                          className="h-9"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Required field</span>
                      </label>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveField(field.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Template Structure */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Template Structure (Optional)</h3>
              <p className="text-sm text-gray-500 mb-3">
                Define the letter structure. Use placeholders like {'{{field_name}}'} for custom fields, {'{{user_input}}'} for main content, and {'{{date}}'} for current date.
              </p>
            </div>
            
            <Textarea
              value={templateStructure}
              onChange={(e) => setTemplateStructure(e.target.value)}
              placeholder="{{date}}

To: {{recipient_name}}
{{recipient_title}}

Subject: {{subject}}

Dear {{recipient_name}},

{{user_input}}

Sincerely,
{{sender_name}}"
              rows={12}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveTemplate} className="gap-2 bg-[#2563EB] hover:bg-[#1d4ed8]">
            <Save className="w-4 h-4" />
            Save Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
