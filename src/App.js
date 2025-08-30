import React, { useState, useEffect } from 'react';
// This assumes you have a firebase.js file in your project.
// If not, you'll need to add your firebase config here.
// import { auth } from './firebase'; 
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";


// --- MOCK FIREBASE CONFIG (REPLACE WITH YOURS) ---
// IMPORTANT: Replace this with your actual Firebase config for the app to work.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// --- SVG Icons ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


// --- All UI Components are now defined OUTSIDE of the main App component ---

const Navbar = ({ page, setPage, user, handleLogout, setLoginModalOpen, setSignupModalOpen, setSearchTerm, setSearchResults }) => (
    <nav className="bg-white/70 backdrop-blur-lg shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <span className="font-bold text-2xl text-green-600 cursor-pointer" onClick={() => { setPage('home'); setSearchTerm(''); setSearchResults([]); }}>
                        <b>freshpricer</b>
                    </span>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <a onClick={() => setPage('home')} className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${page === 'home' && 'text-green-600 font-semibold'}`}>Home</a>
                    <a onClick={() => setPage('about')} className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${page === 'about' && 'text-green-600 font-semibold'}`}>About</a>
                    <a onClick={() => setPage('contact')} className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${page === 'contact' && 'text-green-600 font-semibold'}`}>Contact</a>
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-gray-700 text-sm font-medium">Welcome, {user.email}</span>
                            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setLoginModalOpen(true)} className="login-button-hover bg-transparent text-green-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Login</button>
                            <button onClick={() => setSignupModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-md hover:shadow-lg transition-all">Sign Up</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    </nav>
);

const AuthModal = ({ type, isOpen, onClose, handleAuth, authError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    if (!isOpen) return null;
    const title = type === 'login' ? 'Welcome Back!' : 'Create an Account';
    const handleSubmit = (e) => { e.preventDefault(); handleAuth(email, password); };
    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-slide-in-up-modal">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><XIcon /></button>
                <div className="text-center mb-6"><h2 className="text-2xl font-bold text-gray-800">{title}</h2></div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4"><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`${type}-email`}>Email</label><input className="shadow-inner appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-700" id={`${type}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                    <div className="mb-6"><label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`${type}-password`}>Password</label><input className="shadow-inner appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-700" id={`${type}-password`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                    {authError && <p className="text-red-500 text-xs italic mb-4">{authError}</p>}
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105" type="submit">{type === 'login' ? 'Login' : 'Sign Up'}</button>
                </form>
            </div>
        </div>
    );
};

const FeaturedItems = ({ handleItemClickSearch }) => {
    const items = [
        { name: 'Tomato', image: 'https://placehold.co/300x200/FF6347/FFFFFF?text=Tomato' },
        { name: 'Onion', image: 'https://placehold.co/300x200/DDA0DD/FFFFFF?text=Onion' },
        { name: 'Apple', image: 'https://placehold.co/300x200/FF0000/FFFFFF?text=Apple' },
        { name: 'Potato', image: 'https://placehold.co/300x200/DEB887/FFFFFF?text=Potato' },
        { name: 'Banana', image: 'https://placehold.co/300x200/FFFF00/000000?text=Banana' },
        { name: 'Carrot', image: 'https://placehold.co/300x200/FF7F50/FFFFFF?text=Carrot' },
        { name: 'Orange', image: 'https://placehold.co/300x200/FFA500/FFFFFF?text=Orange' },
        { name: 'Spinach', image: 'https://placehold.co/300x200/2E8B57/FFFFFF?text=Spinach' },
        { name: 'Broccoli', image: 'https://placehold.co/300x200/008000/FFFFFF?text=Broccoli' }
    ];
    return (
        <div className="w-full overflow-hidden relative py-12 group">
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Or Click to Search Popular Items</h2>
            <div className="flex animate-scroll group-hover:pause">
                {[...items, ...items].map((item, index) => (
                    <div key={index} onClick={() => handleItemClickSearch(item.name)} className="flex-shrink-0 w-48 mx-4 text-center cursor-pointer">
                        <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300" />
                        <p className="mt-2 font-semibold text-gray-600">{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const HomePage = ({ handleSearch, location, setLocation, searchTerm, setSearchTerm, handleItemClickSearch }) => (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
        <div className="text-center p-8 max-w-4xl mx-auto w-full">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 animate-fade-in-down" style={{ animationDelay: '0.2s', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
                Find the <span className="text-green-300">Best</span> Prices
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-down" style={{ animationDelay: '0.4s' }}>
                Your one-stop destination to compare local vegetable & fruit prices. Save money and eat fresh every day!
            </p>
            <div className="bg-white p-4 rounded-full shadow-2xl max-w-2xl w-full mx-auto animate-fade-in-down" style={{ animationDelay: '0.6s' }}>
                <form onSubmit={handleSearch} className="flex items-center">
                    <div className="flex items-center text-gray-500 pl-4 pr-2"><LocationIcon /><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-48 ml-2 bg-transparent focus:outline-none text-sm"/></div>
                    <div className="h-8 border-l border-gray-200 mx-4"></div>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full text-lg bg-transparent focus:outline-none" placeholder="Search for 'Tomato'..." />
                    <button type="submit" className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-all transform hover:scale-110"><SearchIcon /></button>
                </form>
            </div>
        </div>
        <FeaturedItems handleItemClickSearch={handleItemClickSearch} />
    </div>
);

const SearchResultsPage = ({ searchTerm, location, searchResults, setPage, setSearchTerm, setSearchResults }) => (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-2" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)'}}>Results for "<span className="text-green-300">{searchTerm}</span>"</h2>
            <p className="text-blue-100">Showing prices near {location}</p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
           {searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                    <div key={item.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 animate-slide-in-up" style={{ animationDelay: `${index * 120}ms` }}>
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">{item.name}</h3>
                        <div className="space-y-4">
                            {item.shops.map(shop => (
                                <div key={shop.name} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-lg hover:bg-green-50 transition-colors">
                                    <div>
                                        <p className="font-semibold text-lg text-gray-700">{shop.name}</p>
                                        <p className="text-sm text-gray-500">{shop.distance}</p>
                                    </div>
                                    <p className="text-xl font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">{shop.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-16 bg-white/50 rounded-2xl animate-slide-in-up">
                    <p className="text-2xl font-semibold text-gray-600">No results found for "{searchTerm}".</p>
                    <p className="text-gray-400 mt-2">Try searching for another item.</p>
                </div>
            )}
        </div>
         <button onClick={() => { setPage('home'); setSearchTerm(''); setSearchResults([]); }} className="mt-12 mx-auto block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 shadow-lg transition-all transform hover:scale-105">
            Back to Home
        </button>
    </div>
);

const AboutPage = () => (
     <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
         <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-lg">
               <h1 className="text-4xl font-extrabold text-gray-900 text-center">About freshpricer</h1>
               <p className="mt-4 text-lg text-gray-600 text-center">Our mission is to bring transparency to local markets, helping you find the freshest produce at the best prices.</p>
              <div className="mt-8 text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Meet the Creator</h2>
                <p className="text-gray-700 mb-4 text-center">My name is <span className="font-bold">Veda Akash</span>, and I'm a passionate developer dedicated to building tools that solve real-world problems. freshpricer was born from a simple idea: what if you could know the price of vegetables at different local shops before you even left the house?</p>
                <p className="text-gray-700 text-center">This project combines my love for technology with a desire to help my community make smarter, healthier choices. I hope you find it useful!</p>
              </div>
         </div>
     </div>
);

const ContactPage = () => (
     <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
         <div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-lg">
               <h1 className="text-4xl font-extrabold text-gray-900">Get In Touch</h1>
               <p className="mt-4 text-lg text-gray-600">Have questions, suggestions, or feedback? I'd love to hear from you!</p>
         </div>
     </div>
);

const Footer = () => (<footer className="text-blue-100 py-8 mt-16 text-center"><p>&copy; 2024 freshpricer by Veda Akash. All Rights Reserved.</p></footer>);

export default function App() {
    const [page, setPage] = useState('home');
    const [location, setLocation] = useState('Ahmamau, Uttar Pradesh, India');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setSignupModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const mockDb = [
        // Vegetables
        { id: 1, name: 'Tomato', shops: [ { name: 'Fresh Veggies Co.', price: '₹25/kg', distance: '1.2km' }, { name: 'Farm Fresh', price: '₹22/kg', distance: '0.8km' }, { name: 'Daily Needs Grocery', price: '₹28/kg', distance: '2.5km' } ]},
        { id: 2, name: 'Onion', shops: [ { name: 'Farm Fresh', price: '₹30/kg', distance: '0.8km' }, { name: 'Organic World', price: '₹35/kg', distance: '3.1km' }, { name: 'Fresh Veggies Co.', price: '₹32/kg', distance: '1.2km' } ]},
        { id: 3, name: 'Potato', shops: [ { name: 'Daily Needs Grocery', price: '₹20/kg', distance: '2.5km' }, { name: 'Fresh Veggies Co.', price: '₹18/kg', distance: '1.2km' }, { name: 'Farm Fresh', price: '₹21/kg', distance: '0.8km' }, { name: 'Local Market Stall', price: '₹17/kg', distance: '0.5km' } ]},
        { id: 4, name: 'Carrot', shops: [ { name: 'Organic World', price: '₹40/kg', distance: '3.1km' }, { name: 'Fresh Veggies Co.', price: '₹38/kg', distance: '1.2km' } ]},
        { id: 5, name: 'Spinach', shops: [ { name: 'Fresh Veggies Co.', price: '₹15/bunch', distance: '1.2km' }, { name: 'Organic World', price: '₹20/bunch', distance: '3.1km' } ]},
        { id: 6, name: 'Broccoli', shops: [ { name: 'Organic World', price: '₹50/piece', distance: '3.1km' }, { name: 'Daily Needs Grocery', price: '₹55/piece', distance: '2.5km' } ]},
        // Fruits
        { id: 7, name: 'Apple', shops: [ { name: 'Fruit Junction', price: '₹120/kg', distance: '1.5km' }, { name: 'Farm Fresh', price: '₹110/kg', distance: '0.8km' } ]},
        { id: 8, name: 'Banana', shops: [ { name: 'Daily Needs Grocery', price: '₹40/dozen', distance: '2.5km' }, { name: 'Fruit Junction', price: '₹45/dozen', distance: '1.5km' } ]},
        { id: 9, name: 'Orange', shops: [ { name: 'Farm Fresh', price: '₹80/kg', distance: '0.8km' }, { name: 'Local Market Stall', price: '₹75/kg', distance: '0.5km' } ]}
    ];

    useEffect(() => { const unsubscribe = onAuthStateChanged(auth, currentUser => setUser(currentUser)); return () => unsubscribe(); }, []);

    const handleSearch = (e) => { e.preventDefault(); if (searchTerm.trim() === '') return; performSearch(searchTerm); };
    const handleItemClickSearch = (itemName) => { setSearchTerm(itemName); performSearch(itemName); }
    const performSearch = (term) => {
        setPage('search');
        setSearchResults(mockDb.filter(item => item.name.toLowerCase().includes(term.toLowerCase())));
    }

    const handleSignup = async (email, password) => { setAuthError(null); try { await createUserWithEmailAndPassword(auth, email, password); setSignupModalOpen(false); } catch (error) { setAuthError(error.message); } };
    const handleLogin = async (email, password) => { setAuthError(null); try { await signInWithEmailAndPassword(auth, email, password); setLoginModalOpen(false); } catch (error) { setAuthError(error.message); } };
    const handleLogout = async () => { await signOut(auth); };

    const renderPage = () => {
        const pageContent = {
            'home': <HomePage handleSearch={handleSearch} location={location} setLocation={setLocation} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleItemClickSearch={handleItemClickSearch} />,
            'search': <SearchResultsPage searchTerm={searchTerm} location={location} searchResults={searchResults} setPage={setPage} setSearchTerm={setSearchTerm} setSearchResults={setSearchResults} />,
            'about': <AboutPage />,
            'contact': <ContactPage />
        };
        return (
            <div key={page} className="animate-page-transition">
                {pageContent[page] || pageContent['home']}
            </div>
        );
    };

    return (
      <React.Fragment>
        {/* This script tag is the key to making Tailwind CSS work! */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        <div className="font-sans app-container">
            <style>{`
                .app-container {
                    background-color: #00bfff;
                    min-height: 100vh;
                }
                
                .login-button-hover:hover {
                    background-color: #16a34a; /* green-600 */
                    color: white;
                }

                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

                @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; opacity: 0; }
                
                @keyframes slide-in-up { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-slide-in-up { opacity: 0; animation: slide-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                
                @keyframes slide-in-up-modal { 0% { opacity: 0; transform: translateY(30px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
                .animate-slide-in-up-modal { animation: slide-in-up-modal 0.4s ease-out forwards; }

                @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                /* Animation speed increased: 20s -> 15s */
                .animate-scroll { animation: scroll 15s linear infinite; }
                .group-hover\\:pause:hover { animation-play-state: paused; }
                
                /* Page transition animation */
                @keyframes page-transition-in { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-page-transition { animation: page-transition-in 0.5s ease-out; }
            `}</style>

            <Navbar page={page} setPage={setPage} user={user} handleLogout={handleLogout} setLoginModalOpen={setLoginModalOpen} setSignupModalOpen={setSignupModalOpen} setSearchTerm={setSearchTerm} setSearchResults={setSearchResults} />
            <main>
                {renderPage()}
            </main>
            <AuthModal type="login" isOpen={isLoginModalOpen} onClose={() => { setLoginModalOpen(false); setAuthError(null); }} handleAuth={handleLogin} authError={authError} />
            <AuthModal type="signup" isOpen={isSignupModalOpen} onClose={() => { setSignupModalOpen(false); setAuthError(null); }} handleAuth={handleSignup} authError={authError} />
            <Footer/>
        </div>
      </React.Fragment>
    );
}

