import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-black border-b border-neutral-800 px-6 flex items-center justify-between text-white sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <h1 className="text-base font-bold tracking-wider uppercase">School System</h1>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-[#1b2d53] flex items-center justify-center text-white">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-semibold text-white text-xs">{user.full_name}</p>
              <p className="text-[11px] text-neutral-400 capitalize">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center space-x-2 px-3 py-1.5 rounded bg-neutral-900 hover:bg-[#1b2d53] text-white text-xs border border-neutral-800 transition duration-150"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
