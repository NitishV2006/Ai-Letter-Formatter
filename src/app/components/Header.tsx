import { User, ChevronDown, Plus, BookOpen, Shield, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AccountData } from './AccountManager';

interface HeaderProps {
  onOpenTemplateBuilder: () => void;
  onOpenKnowledgeBase: () => void;
  onOpenSettings: () => void;
  onOpenAccount: () => void;
  accountData: AccountData | null;
  onLogout: () => void;
}

export function Header({ 
  onOpenTemplateBuilder, 
  onOpenKnowledgeBase, 
  onOpenSettings, 
  onOpenAccount,
  accountData,
  onLogout
}: HeaderProps) {
  const displayName = accountData?.fullName || 'Guest User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
          <span className="text-white font-bold text-sm">LA</span>
        </div>
        <h1 className="font-semibold text-gray-900">Letter Agent</h1>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Create
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onOpenTemplateBuilder} className="gap-2">
              <Plus className="w-4 h-4" />
              Custom Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenKnowledgeBase} className="gap-2">
              <BookOpen className="w-4 h-4" />
              Knowledge Base
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" onClick={onOpenSettings}>
          <Settings className="w-4 h-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                <span className="text-white text-xs font-medium">{initials}</span>
              </div>
              <span className="text-sm text-gray-700">{displayName}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onOpenAccount} className="gap-2">
              <User className="w-4 h-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="gap-2 text-red-600">
              <LogOut className="w-4 h-4" />
              Clear Account Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}