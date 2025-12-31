import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, Save, Shield, User, Users } from 'lucide-react';
import { TemplatePermission } from '../data/templates';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

interface PermissionsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'template' | 'knowledge';
  entityName: string;
  currentPermissions: TemplatePermission[];
  onSave: (permissions: TemplatePermission[]) => void;
}

export function PermissionsManager({
  isOpen,
  onClose,
  entityType,
  entityName,
  currentPermissions,
  onSave
}: PermissionsManagerProps) {
  const [permissions, setPermissions] = useState<TemplatePermission[]>(currentPermissions);
  const [newPermission, setNewPermission] = useState<{
    type: 'user' | 'role';
    value: string;
    access: 'view' | 'edit' | 'admin';
  }>({
    type: 'user',
    value: '',
    access: 'view'
  });

  const handleAddPermission = () => {
    if (!newPermission.value.trim()) {
      toast.error('Please enter a user ID or role name');
      return;
    }

    const permission: TemplatePermission = {
      ...(newPermission.type === 'user' 
        ? { userId: newPermission.value } 
        : { role: newPermission.value }),
      access: newPermission.access
    };

    setPermissions([...permissions, permission]);
    setNewPermission({ type: 'user', value: '', access: 'view' });
    toast.success('Permission added');
  };

  const handleRemovePermission = (index: number) => {
    setPermissions(permissions.filter((_, i) => i !== index));
    toast.success('Permission removed');
  };

  const handleSavePermissions = () => {
    onSave(permissions);
    toast.success('Permissions saved successfully');
    onClose();
  };

  const getAccessBadgeColor = (access: string) => {
    switch (access) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'edit':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'view':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Control who can access and modify "{entityName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add New Permission */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Permission
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newPermission.type}
                  onValueChange={(val) => setNewPermission({ ...newPermission, type: val as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="role">Role</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  {newPermission.type === 'user' ? 'User ID/Email' : 'Role Name'}
                </Label>
                <Input
                  value={newPermission.value}
                  onChange={(e) => setNewPermission({ ...newPermission, value: e.target.value })}
                  placeholder={newPermission.type === 'user' ? 'user@example.com' : 'admin, editor, viewer'}
                />
              </div>

              <div className="space-y-2">
                <Label>Access Level</Label>
                <Select
                  value={newPermission.access}
                  onValueChange={(val) => setNewPermission({ ...newPermission, access: val as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View Only</SelectItem>
                    <SelectItem value="edit">Can Edit</SelectItem>
                    <SelectItem value="admin">Full Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAddPermission}
              className="w-full gap-2 bg-[#2563EB] hover:bg-[#1d4ed8]"
            >
              <Plus className="w-4 h-4" />
              Add Permission
            </Button>
          </div>

          {/* Permissions List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Current Permissions ({permissions.length})
            </h3>

            {permissions.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  No permissions set. This {entityType} is accessible to everyone.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {permissions.map((permission, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-3">
                      {permission.userId ? (
                        <User className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Users className="w-4 h-4 text-gray-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {permission.userId || permission.role}
                        </p>
                        <p className="text-xs text-gray-500">
                          {permission.userId ? 'User' : 'Role'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getAccessBadgeColor(permission.access)}>
                        {permission.access === 'view' && 'View Only'}
                        {permission.access === 'edit' && 'Can Edit'}
                        {permission.access === 'admin' && 'Full Admin'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePermission(index)}
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

          {/* Access Level Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
            <h4 className="font-semibold text-blue-900 text-sm">Access Levels Explained</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li><strong>View Only:</strong> Can view and use the {entityType}</li>
              <li><strong>Can Edit:</strong> Can modify the {entityType} content</li>
              <li><strong>Full Admin:</strong> Can edit content and manage permissions</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSavePermissions} className="gap-2 bg-[#2563EB] hover:bg-[#1d4ed8]">
            <Save className="w-4 h-4" />
            Save Permissions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}