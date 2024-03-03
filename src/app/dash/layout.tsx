import { SideNav } from "@/components/side-nav";

const DashLayout = ({ children }: { children: React.ReactNode}) => {
  return (
    <main className="container mx-auto mt-12 flex">
      <SideNav className="w-64  p-4" />
        {children}
    </main>
  )
}

export default DashLayout;