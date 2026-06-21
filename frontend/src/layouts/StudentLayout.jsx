import { Outlet } from 'react-router-dom';

/**
 * StudentLayout Component
 * 
 * Renders the container layout for student dashboard pages.
 * Displays the page contents and decorative background gradients.
 */
const StudentLayout = () => {
  return (
    <div className="h-full overflow-y-auto p-5 lg:p-7 relative bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
          bg-gradient-to-br from-purple-200/40 to-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full
          bg-gradient-to-tr from-blue-200/35 to-purple-200/25 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[350px] h-[350px] rounded-full
          bg-gradient-to-br from-indigo-100/30 to-pink-100/20 blur-3xl" />
      </div>

      <Outlet />
    </div>
  );
};

export default StudentLayout;
