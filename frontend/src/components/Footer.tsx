import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { API_BASE_URL } from '../api/config';

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
] as const;

type SupportedLangCode = typeof SUPPORTED_LANGUAGES[number]['code'];
const VALID_LANG_CODES = SUPPORTED_LANGUAGES.map((l) => l.code) as readonly string[];

const Footer: React.FC = () => {
  const { darkMode } = useTheme();
  const [selectedLang, setSelectedLang] = React.useState<SupportedLangCode>('en');

  // Validate lang code before embedding it in the URL to prevent injection
  const safeLang: SupportedLangCode = VALID_LANG_CODES.includes(selectedLang) ? selectedLang : 'en';
  const termsDownloadUrl = `${API_BASE_URL}/api/terms/download?lang=${safeLang}`;

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (VALID_LANG_CODES.includes(value)) {
      setSelectedLang(value as SupportedLangCode);
    }
  };

  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-200 text-gray-700'} py-8 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">About</h2>
            <p className="text-sm">
              OctoCAT Supply is the leading provider of AI-powered smart products for your feline companions. Our innovative technology enhances your cat's wellbeing through intelligent monitoring, interactive entertainment, and personalized comfort solutions.
            </p>
          </div>

          {/* Account Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">Account</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">My Cart</a></li>
              <li><a href="#" className="hover:text-primary">Checkout</a></li>
              <li><a href="#" className="hover:text-primary">Shopping Details</a></li>
              <li><a href="#" className="hover:text-primary">Order</a></li>
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
            </ul>
          </div>

          {/* Helpful Links Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">Helpful Links</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">Services</a></li>
              <li><a href="#" className="hover:text-primary">Supports</a></li>
              <li><a href="#" className="hover:text-primary">Feedback</a></li>
              <li className="flex items-center gap-2 flex-wrap">
                <a
                  href={termsDownloadUrl}
                  className="hover:text-primary flex items-center gap-1"
                  download={`terms-and-conditions-${safeLang}.txt`}
                  title={`Download Terms & Conditions (${safeLang.toUpperCase()})`}
                >
                  Terms &amp; Conditions
                  <span aria-hidden="true">⬇</span>
                </a>
                <select
                  aria-label="Select language for Terms & Conditions download"
                  value={selectedLang}
                  onChange={handleLangChange}
                  className={`text-xs rounded px-1 py-0.5 border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-600 text-gray-300'
                      : 'bg-white border-gray-400 text-gray-700'
                  }`}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">Social Media</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">Twitter</a></li>
              <li><a href="#" className="hover:text-primary">Facebook</a></li>
              <li><a href="#" className="hover:text-primary">Youtube</a></li>
              <li><a href="#" className="hover:text-primary">Linkedin</a></li>
              <li><a href="#" className="hover:text-primary">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className={`mt-8 pt-8 ${darkMode ? 'border-gray-700' : 'border-gray-300'} border-t text-center text-sm transition-colors duration-300`}>
          <p>Copyright © 2025 OctoCAT Supply. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;