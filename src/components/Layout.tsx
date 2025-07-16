
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b bg-white px-4">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-xl font-semibold text-gray-800">Employee Management System</h1>
        </header>
        <main className="flex-1 bg-slate-50">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
