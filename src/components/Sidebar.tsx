import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Wheat,
  ClipboardList,
  Users,
  LogOut,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-green-800 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-green-700">
        {!collapsed && <h1 className="text-xl font-bold">Farm Feed Calc</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-green-700"
        >
          <Menu size={20} />
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          to="/dashboard"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Receipt size={20} />}
          label="Receipts"
          to="/receipts"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Wheat size={20} />}
          label="Ingredients"
          to="/ingredients"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<ClipboardList size={20} />}
          label="Activity Log"
          to="/activity-log"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Users size={20} />}
          label="Agents"
          to="/agents"
          collapsed={collapsed}
        />
      </nav>

      <div className="p-2 border-t border-green-700">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-white hover:bg-green-700',
            collapsed && 'justify-center'
          )}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed: boolean;
};

const SidebarItem = ({ icon, label, to, collapsed }: SidebarItemProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start text-white hover:bg-green-700',
        collapsed && 'justify-center'
      )}
      onClick={() => navigate(to)}
    >
      {icon}
      {!collapsed && <span className="ml-2">{label}</span>}
    </Button>
  );
};

export default Sidebar;
