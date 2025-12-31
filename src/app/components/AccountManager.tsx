import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Save, User } from 'lucide-react';
import { toast } from 'sonner';

export interface AccountData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  organization: string;
  department: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  signature: string;
}

interface AccountManagerProps {
  isOpen: boolean;
  onClose: () => void;
  accountData: AccountData;
  onSave: (data: AccountData) => void;
}

export const defaultAccountData: AccountData = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  organization: '',
  department: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  signature: ''
};

export function AccountManager({ isOpen, onClose, accountData, onSave }: AccountManagerProps) {
  const [formData, setFormData] = useState<AccountData>(accountData);

  useEffect(() => {
    setFormData(accountData);
  }, [accountData]);

  const handleChange = (field: keyof AccountData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.fullName || !formData.email) {
      toast.error('Please fill in at least your name and email');
      return;
    }

    onSave(formData);
    toast.success('Account details saved successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Management
          </DialogTitle>
          <DialogDescription>
            Manage your account details. This information will be automatically used in your generated letters.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title/Position</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Senior Manager"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Organization Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization/Company</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleChange('organization', e.target.value)}
                  placeholder="Acme Corporation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="Human Resources"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Address Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="New York"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  placeholder="10001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Signature</h3>
            
            <div className="space-y-2">
              <Label htmlFor="signature">Custom Signature (Optional)</Label>
              <Textarea
                id="signature"
                value={formData.signature}
                onChange={(e) => handleChange('signature', e.target.value)}
                placeholder="Best regards,&#10;John Doe&#10;Senior Manager"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Leave blank to use default signature format with your name and title
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-xs text-gray-500">
            Your data is stored locally in your browser
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2 bg-[#2563EB] hover:bg-[#1d4ed8]">
              <Save className="w-4 h-4" />
              Save Account Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}