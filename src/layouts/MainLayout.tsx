import { ReactNode } from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
