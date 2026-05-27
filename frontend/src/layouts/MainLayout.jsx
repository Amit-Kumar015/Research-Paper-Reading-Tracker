import { Outlet, Link, useLocation } from "react-router-dom";

function MainLayout() {
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      path: "/",
    },
    {
      label: "Add Paper",
      path: "/add-paper",
    },
    {
      label: "Library",
      path: "/library",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r bg-slate-100 p-4">
        <h1 className="mb-2 text-2xl font-bold">
          Research Tracker
        </h1>

        <hr className="mb-5"/>

        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-lg px-4 py-2 ${
                location.pathname === item.path
                  ? "bg-black text-white"
                  : "hover:bg-slate-200"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;