import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Plus, Search, Edit2, Trash2, Save, BookOpen, Tag } from 'lucide-react';
import { KnowledgeBaseItem } from '../data/templates';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

interface KnowledgeBaseManagerProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBase: KnowledgeBaseItem[];
  onSave: (items: KnowledgeBaseItem[]) => void;
}

export function KnowledgeBaseManager({ isOpen, onClose, knowledgeBase, onSave }: KnowledgeBaseManagerProps) {
  const [items, setItems] = useState<KnowledgeBaseItem[]>(knowledgeBase);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<KnowledgeBaseItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddNew = () => {
    setEditForm({ title: '', content: '', category: '', tags: '' });
    setSelectedItem(null);
    setIsEditing(true);
  };

  const handleEdit = (item: KnowledgeBaseItem) => {
    setEditForm({
      title: item.title,
      content: item.content,
      category: item.category,
      tags: item.tags.join(', ')
    });
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Knowledge base item deleted');
  };

  const handleSaveItem = () => {
    if (!editForm.title || !editForm.content) {
      toast.error('Please fill in title and content');
      return;
    }

    const newItem: KnowledgeBaseItem = {
      id: selectedItem?.id || `kb-${Date.now()}`,
      title: editForm.title,
      content: editForm.content,
      category: editForm.category || 'General',
      tags: editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: selectedItem?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (selectedItem) {
      setItems(items.map(item => item.id === selectedItem.id ? newItem : item));
      toast.success('Knowledge base item updated');
    } else {
      setItems([...items, newItem]);
      toast.success('Knowledge base item created');
    }

    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleSaveAll = () => {
    onSave(items);
    toast.success('Knowledge base saved successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Knowledge Base Manager</DialogTitle>
          <DialogDescription>
            Create and manage reusable content snippets for document generation
          </DialogDescription>
        </DialogHeader>

        {!isEditing ? (
          <div className="flex-1 flex overflow-hidden">
            {/* List View */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search knowledge base..."
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleAddNew} className="gap-2 bg-[#2563EB] hover:bg-[#1d4ed8]">
                  <Plus className="w-4 h-4" />
                  Add New
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {searchQuery ? 'No items found' : 'No knowledge base items yet'}
                    </p>
                    {!searchQuery && (
                      <Button
                        variant="outline"
                        onClick={handleAddNew}
                        className="mt-4 gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create First Item
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:border-[#2563EB] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {item.content}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs gap-1">
                                <Tag className="w-3 h-3" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Edit View */
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="kb-title">Title *</Label>
              <Input
                id="kb-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="e.g., Company Signature Block"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kb-content">Content *</Label>
              <Textarea
                id="kb-content"
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                placeholder="Enter the reusable content..."
                rows={8}
              />
              <p className="text-xs text-gray-500">
                This content can be referenced in your letter templates
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kb-category">Category</Label>
                <Input
                  id="kb-category"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  placeholder="e.g., Signatures, Headers, Legal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kb-tags">Tags (comma-separated)</Label>
                <Input
                  id="kb-tags"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="e.g., corporate, formal, legal"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveItem} className="gap-2 bg-[#2563EB] hover:bg-[#1d4ed8]">
                <Save className="w-4 h-4" />
                {selectedItem ? 'Update' : 'Create'} Item
              </Button>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSaveAll} className="gap-2 bg-[#2563EB] hover:bg-[#1d4ed8]">
              <Save className="w-4 h-4" />
              Save All Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
