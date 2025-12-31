import { useState } from 'react';
import { Template } from '../data/templates';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles } from 'lucide-react';

interface ContentInputProps {
  selectedTemplate: Template;
  onGenerate: (input: string, tone: string, includeCompliance: boolean) => void;
  isGenerating: boolean;
}

const tones = ['Formal', 'Semi-formal', 'Persuasive'] as const;
type Tone = typeof tones[number];

export function ContentInput({ selectedTemplate, onGenerate, isGenerating }: ContentInputProps) {
  const [userInput, setUserInput] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>('Formal');
  const [includeCompliance, setIncludeCompliance] = useState(true);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});

  const handleGenerate = () => {
    let finalInput = userInput.trim();
    
    // If there are custom fields, append them to the user input
    if (selectedTemplate.customFields && selectedTemplate.customFields.length > 0) {
      const fieldTexts = selectedTemplate.customFields.map(field => {
        const value = customFieldValues[field.id] || '';
        return `${field.label}: ${value}`;
      }).filter(text => text.includes(': ') && text.split(': ')[1]);
      
      if (fieldTexts.length > 0) {
        finalInput = fieldTexts.join('\n') + '\n\n' + finalInput;
      }
    }
    
    if (finalInput) {
      onGenerate(finalInput, selectedTone, includeCompliance);
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: string) => {
    setCustomFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const renderCustomField = (field: any) => {
    const value = customFieldValues[field.id] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleCustomFieldChange(field.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-white p-6 flex flex-col overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{selectedTemplate.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{selectedTemplate.description}</p>
        {selectedTemplate.isCustom && (
          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
            Custom Template
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Custom Fields */}
        {selectedTemplate.customFields && selectedTemplate.customFields.length > 0 && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <h3 className="font-medium text-gray-900">Template Fields</h3>
            {selectedTemplate.customFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                {renderCustomField(field)}
              </div>
            ))}
          </div>
        )}

        {/* Content Input */}
        <div className="flex-1 flex flex-col">
          <Label htmlFor="content" className="text-sm font-medium text-gray-700 mb-2">
            Add your raw details/context
          </Label>
          <Textarea
            id="content"
            placeholder="Enter the details you want to include in your letter. For example: 'Fever since yesterday, need 3 days off'..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 min-h-[200px] resize-none rounded-2xl p-4"
          />
        </div>

        {/* Compliance Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
          <div className="flex-1">
            <Label htmlFor="compliance" className="text-sm font-medium text-gray-900 cursor-pointer">
              Include Compliance Norms 2025
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Ensure letter meets current professional standards
            </p>
          </div>
          <Switch
            id="compliance"
            checked={includeCompliance}
            onCheckedChange={setIncludeCompliance}
          />
        </div>

        {/* Tone Selector */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Tone</Label>
          <div className="grid grid-cols-3 gap-2">
            {tones.map((tone) => (
              <button
                key={tone}
                onClick={() => setSelectedTone(tone)}
                className={`
                  px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${
                    selectedTone === tone
                      ? 'bg-[#2563EB] text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!userInput.trim() || isGenerating}
          className="w-full h-12 rounded-2xl text-base font-medium bg-[#2563EB] hover:bg-[#1d4ed8]"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Letter with AI'}
        </Button>
      </div>
    </div>
  );
}