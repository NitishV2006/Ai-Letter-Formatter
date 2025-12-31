import { useState } from 'react';
import { Search, GraduationCap, Briefcase, Scale, FileText, Shield } from 'lucide-react';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Template } from '../data/templates';
import { cn } from './ui/utils';
import { Badge } from './ui/badge';

interface TemplateSidebarProps {
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
  templates: Template[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Briefcase,
  Scale,
  FileText
};

export function TemplateSidebar({ selectedTemplate, onSelectTemplate, templates }: TemplateSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <aside className="w-[300px] bg-white border-r border-gray-200 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 pt-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5 h-9">
            <TabsTrigger value="All" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="Student" className="text-xs">Student</TabsTrigger>
            <TabsTrigger value="Faculty" className="text-xs">Faculty</TabsTrigger>
            <TabsTrigger value="Corporate" className="text-xs">Corp</TabsTrigger>
            <TabsTrigger value="Investor" className="text-xs">Invest</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Template List */}
      <ScrollArea className="flex-1 px-4 pt-4">
        <div className="space-y-2 pb-4">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No templates found
            </div>
          ) : (
            filteredTemplates.map((template) => {
              const Icon = iconMap[template.icon] || FileText;
              const isSelected = selectedTemplate?.id === template.id;

              return (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors',
                    isSelected
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      isSelected ? 'bg-white/20' : 'bg-white'
                    )}
                  >
                    <Icon
                      className={cn('w-5 h-5', isSelected ? 'text-white' : 'text-[#2563EB]')}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={cn('font-medium text-sm', isSelected ? 'text-white' : 'text-gray-900')}>
                        {template.title}
                      </div>
                      {template.isCustom && (
                        <Badge variant="secondary" className={cn(
                          "text-xs px-1.5 py-0",
                          isSelected ? "bg-white/20 text-white border-white/30" : ""
                        )}>
                          Custom
                        </Badge>
                      )}
                      {template.permissions && template.permissions.length > 0 && (
                        <Shield className={cn("w-3 h-3", isSelected ? "text-white" : "text-gray-400")} />
                      )}
                    </div>
                    <div
                      className={cn(
                        'text-xs mt-1 line-clamp-2',
                        isSelected ? 'text-white/80' : 'text-gray-500'
                      )}
                    >
                      {template.description}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}