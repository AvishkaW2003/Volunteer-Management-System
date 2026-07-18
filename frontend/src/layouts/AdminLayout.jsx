import { Outlet } from 'react-router-dom';

/**
 * AdminLayout Component
 * 
 * Renders the container layout for admin dashboard pages.
 * Displays the page contents and decorative background gradients.
 */
const AdminLayout = () => {
  return (
    <div className="h-full overflow-y-auto p-5 lg:p-7 relative bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
          bg-gradient-to-br from-teal-200/40 to-cyan-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full
          bg-gradient-to-tr from-cyan-200/35 to-teal-200/25 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[350px] h-[350px] rounded-full
          bg-gradient-to-br from-teal-100/30 to-emerald-100/20 blur-3xl" />
      </div>

      <Outlet />
    </div>
  );
};

export default AdminLayout;
