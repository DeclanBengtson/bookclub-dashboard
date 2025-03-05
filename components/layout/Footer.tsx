export default function Footer() {
    return (
      <footer className="bg-amber-900/80 backdrop-blur-sm border-t border-amber-800 text-center py-4">
        <p className="text-amber-300 text-sm">
          © {new Date().getFullYear()} Book Clurb Lounge | Savor the Pages
        </p>
      </footer>
    );
  }