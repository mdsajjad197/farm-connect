import { ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  // Sliding Pill State
  const [hoveredRect, setHoveredRect] = useState(null);
  const navRef = useRef(null);
  const [hoveredPath, setHoveredPath] = useState(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update pill position when path changes or hover changes
  useEffect(() => {
    // Basic implementation: if hovering, use hover; else use current path (if visible)
    // For this demo, we'll simpler: just track hover. If not hovering, no pill or reset to active?
    // Let's make it track hover only for the "flowing" feel.
    if (!hoveredRect) return;
  }, [hoveredRect]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const categories = [
    { name: "Fresh Vegetables", image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=200&auto=format&fit=crop", path: "/products?category=vegetables" },
    { name: "Organic Fruits", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=200&auto=format&fit=crop", path: "/products?category=fruits" },
    { name: "Dairy Products", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=200&auto=format&fit=crop", path: "/products?category=dairy" },
    { name: "Grains & Pulses", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop", path: "/products?category=grains" },
  ];

  // Helper to handle mouse enter on nav items
  const handleMouseEnter = (e, path) => {
    if (!e.target) return;
    const rect = e.target.closest('a').getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();
    setHoveredRect({
      left: rect.left - navRect.left,
      width: rect.width,
      height: rect.height,
      top: rect.top - navRect.top
    });
    setHoveredPath(path);
    if (path === '/products') setShowMegaMenu(true);
    else setShowMegaMenu(false);
  };

  const handleMouseLeave = () => {
    setHoveredRect(null);
    setShowMegaMenu(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-md shadow-md py-2 border-b border-white/50" : " py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h1
            onClick={() => {
              navigate("/home");
              setIsMenuOpen(false);
            }}
            className={`text-xl md:text-2xl font-bold cursor-pointer flex items-center gap-1 md:gap-2 transition-colors text-white drop-shadow-md`}
          >
            🌿 FarmConnect
          </h1>

          {/* Desktop Links Container */}
          <div className="hidden md:flex relative h-12 items-center bg-white/10 backdrop-blur-sm rounded-full px-2 border border-white/20 shadow-lg" ref={navRef} onMouseLeave={handleMouseLeave}>

            {/* Sliding Pill */}
            {hoveredRect && (
              <div
                className="absolute bg-white/20 rounded-full transition-all duration-300 ease-out shadow-sm"
                style={{
                  left: hoveredRect.left,
                  width: hoveredRect.width,
                  height: hoveredRect.height - 8, // slight padding
                  top: 4,
                  opacity: 1
                }}
              />
            )}

            {[
              { path: "/home", label: t('nav.home') },
              { path: "/products", label: t('nav.products'), hasDropdown: true },
              { path: "/about", label: t('nav.about') },
              { path: "/services", label: t('nav.services') },
            ].map((link) => (
              <div
                key={link.path}
                className="relative z-10 h-full flex items-center"
                onMouseEnter={(e) => handleMouseEnter(e, link.path)}
              >
                <Link
                  to={link.path}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-colors duration-200 flex items-center gap-1 ${hoveredPath === link.path
                    ? "text-green-400 font-bold"
                    : "text-white hover:text-green-200"
                    }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} className={`transition-transform ${showMegaMenu ? "rotate-180" : ""}`} />}
                </Link>

                {/* Mega Menu Dropdown */}
                {link.hasDropdown && (
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-black/95 rounded-2xl shadow-2xl border border-white/10 p-6 transition-all duration-300 transform origin-top ${showMegaMenu
                      ? "opacity-100 translate-y-4 scale-100 pointer-events-auto"
                      : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                      }`}
                    onMouseEnter={() => setShowMegaMenu(true)} // Keep open when hovering menu
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/95 rotate-45 border-t border-l border-white/10"></div>

                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                      Explore Categories
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((cat, idx) => (
                        <Link
                          key={idx}
                          to={cat.path}
                          onClick={() => setShowMegaMenu(false)}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all hover:scale-[1.02] group/item"
                        >
                          <img src={cat.image} alt={cat.name} className="w-14 h-14 object-cover rounded-lg shadow-sm group-hover/item:shadow-md transition-shadow" />
                          <div>
                            <p className="font-bold text-gray-200 text-sm group-hover/item:text-green-400">{cat.name}</p>
                            <span className="text-[10px] text-green-500 font-medium opacity-0 group-hover/item:opacity-100 transition-opacity uppercase tracking-wider">Browse</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Section: Icons & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-6">

            {/* Language Switcher Desktop */}
            {/* Language Switcher */}
            <div className={`flex items-center gap-1 rounded-full px-2 py-1 md:px-3 md:py-1.5 backdrop-blur-md border border-white/20 transition-colors bg-white/10 text-white`}>
              <Globe size={16} />
              <select
                className={`bg-transparent text-xs font-medium outline-none cursor-pointer text-white`}
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
              >
                <option value="en" className="text-black">Eng</option>
                <option value="hi" className="text-black">हिंदी</option>
                <option value="ta" className="text-black">தமிழ்</option>
              </select>
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className={`p-2 rounded-full transition-colors hover:bg-white/20 text-white`}>
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link to="/profile" className="hidden sm:block">
              <div className={`p-2 rounded-full transition-colors hover:bg-white/20 text-white`}>
                <User className="w-5 h-5 hover:scale-110 transition-transform" />
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 -mr-2 transition-colors text-white`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-t border-gray-100 bg-white shadow-xl">
          <div className="px-4 pt-4 pb-8 space-y-3 flex flex-col">
            <Link
              to="/home"
              className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-green-700 hover:bg-green-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <div className="space-y-1">
              <Link
                to="/products"
                className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-green-700 hover:bg-green-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              {/* Mobile Submenu Categories */}
              <div className="pl-6 grid grid-cols-2 gap-2 mt-2">
                {categories.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={cat.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center bg-gray-50 p-2 rounded-lg text-xs text-gray-600 hover:text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <img src={cat.image} className="w-8 h-8 rounded-full mb-1 object-cover" />
                    {cat.name.split(" ")[0]}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/about"
              className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-green-700 hover:bg-green-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.about')}
            </Link>
            <Link
              to="/services"
              className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-green-700 hover:bg-green-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.services')}
            </Link>

            <Link
              to="/profile"
              className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 sm:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.myProfile')}
            </Link>

            {/* Mobile Language Switcher */}
            <div className="mt-2 pt-4 border-t border-gray-100">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Language</p>
              <div className="px-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    changeLanguage('en');
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${i18n.language === 'en'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    changeLanguage('hi');
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${i18n.language === 'hi'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => {
                    changeLanguage('ta');
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${i18n.language === 'ta'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </nav >
  );
}
