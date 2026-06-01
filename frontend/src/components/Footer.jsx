/**
 * Footer — simple branded footer for auth / landing pages.
 */
const Footer = () => (
  <footer className="w-full py-5 px-4 text-center">
    <p className="text-xs text-gray-400">
      &copy; {new Date().getFullYear()}{' '}
      <span className="font-semibold text-gray-500">VolunteerHub</span>
      {' '}— Built for community, powered by volunteers.
    </p>
  </footer>
);

export default Footer;
