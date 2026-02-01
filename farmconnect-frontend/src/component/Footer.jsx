import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8 mt-12">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">

                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold text-green-500 mb-4">🌿 FarmConnect</h2>
                    <p className="text-gray-400 text-sm">
                        Connecting farmers directly to consumers for fresh, organic, and affordable produce.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><Link to="/home" className="hover:text-green-500">Home</Link></li>
                        <li><Link to="/products" className="hover:text-green-500">Products</Link></li>
                        <li><Link to="/about" className="hover:text-green-500">About Us</Link></li>
                        <li><Link to="/services" className="hover:text-green-500">Services</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="flex items-center gap-2"><MapPin size={16} /> 123 Farm Road, Agro City</li>
                        <li className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</li>
                        <li className="flex items-center gap-2"><Mail size={16} /> support@farmconnect.com</li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-green-600 transition"><Facebook size={20} /></a>
                        <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-twitter-500 transition"><Twitter size={20} /></a>
                        <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition"><Instagram size={20} /></a>
                    </div>
                </div>

            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} FarmConnect. All rights reserved.
            </div>
        </footer>
    );
}
