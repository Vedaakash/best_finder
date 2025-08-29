// NEW: Import the 'auth' object we configured and the Firebase functions we need

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import React, { useState, useEffect, useRef } from 'react';

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

// --- Main App Component ---
export default function App() {
    // --- State Management ---
    const [page, setPage] = useState('home'); // 'home', 'search', 'about', 'contact'
    const [location, setLocation] = useState('Ahmamau, Uttar Pradesh, India');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setSignupModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Mock search results data
    const mockResults = [
        { id: 1, name: 'Tomato', price: '₹25/kg', shop: 'Fresh Veggies Co.', distance: '1.2km' },
        { id: 2, name: 'Onion', price: '₹30/kg', shop: 'Farm Fresh', distance: '0.8km' },
        { id: 3, name: 'Potato', price: '₹20/kg', shop: 'Daily Needs Grocery', distance: '2.5km' },
        { id: 4, name: 'Carrot', price: '₹40/kg', shop: 'Organic World', distance: '3.1km' },
        { id: 5, name: 'Spinach', price: '₹15/bunch', shop: 'Fresh Veggies Co.', distance: '1.2km' },
        { id: 6, name: 'Broccoli', price: '₹50/piece', shop: 'Organic World', distance: '3.1km' }
    ];

    const [searchResults, setSearchResults] = useState([]);

    // --- Effects ---
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation(`Near You (${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)})`);
            },
            () => {
                console.warn("Could not get user location. Defaulting to placeholder.");
            }
        );
    }, []);

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            // User is signed in
            setUser(currentUser);
            console.log("User is logged in:", currentUser.email);
        } else {
            // User is signed out
            setUser(null);
            console.log("User is logged out.");
        }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
}, []);

    // --- Handlers ---
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }
        setPage('search');
        const filteredResults = mockResults.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    // --- Components ---

    const Navbar = () => (
        <nav className="bg-white/80 backdrop-blur-md shadow-md fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span
                            className="font-bold text-2xl text-green-600 cursor-pointer"
                            onClick={() => { setPage('home'); setSearchTerm(''); setSearchResults([]); }}
                        >
                            VeggieFinder
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <a onClick={() => setPage('home')} className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${page === 'home' && 'text-green-600'}`}>Home</a>
                        <a onClick={() => setPage('about')} className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${page === 'about' && 'text-green-600'}`}>About</a>
                        <a onClick={() => setPage('contact')} className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${page === 'contact' && 'text-green-600'}`}>Contact</a>
                    </div>
                    
<div className="flex items-center space-x-4">
    {user ? (
        // If the user IS logged in, show this:
        <>
            <span className="text-gray-700 text-sm font-medium">Welcome, {user.email}</span>
            <button className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600">
                Logout
            </button>
        </>
    ) : (
        // If the user IS NOT logged in, show this:
        <>
            <button onClick={() => setLoginModalOpen(true)} className="bg-transparent text-green-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-50">Login</button>
            <button onClick={() => setSignupModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 shadow">Sign Up</button>
        </>
    )}
</div>
                </div>
            </div>
        </nav>
    );

    const AuthModal = ({ type, isOpen, onClose }) => {
        // NEW: Add state for email and password inputs
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        if (!isOpen) return null;
        const title = type === 'login' ? 'Welcome Back!' : 'Create an Account';
        const subtitle = type === 'login' ? 'Sign in to continue' : 'Get started with VeggieFinder';
        
        // NEW: Handle form submission
        const handleSubmit = async (e) => {
            e.preventDefault(); // Prevent the page from reloading
            
            // Basic validation
            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            try {
                if (type === 'signup') {
                    // Use the Firebase function to create a new user
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    console.log('Account Created!', userCredential.user);
                    alert('Success! Your account has been created.');
                } else { // type === 'login'
                    // Use the Firebase function to sign in an existing user
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    console.log('Logged In!', userCredential.user);
                    alert('Welcome back!');
                }
                onClose(); // Close the modal on success
            } catch (error) {
                // If Firebase returns an error, show it to the user
                console.error("Authentication Error:", error.message);
                alert(`Error: ${error.message}`);
            }
        };


        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <XIcon />
                    </button>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                        <p className="text-gray-500">{subtitle}</p>
                    </div>
                    {/* NEW: Use a form element with our new handleSubmit function */}
                    <form onSubmit={handleSubmit}>
                        {type === 'signup' && (
                             <div className="mb-4">
                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                                 <input className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500" id="name" type="text" placeholder="John Doe" />
                             </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
                            {/* NEW: Connect input to state */}
                            <input
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                            {/* NEW: Connect input to state */}
                            <input
                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                id="password"
                                type="password"
                                placeholder="••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* NEW: Changed button type to "submit" to trigger the form's onSubmit */}
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105" type="submit">
                           {type === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    const HomePage = () => (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 pt-16">
            <div className="text-center p-8 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 mb-4 animate-fade-in-down">
                    Find the <span className="text-green-600">Freshest</span> Prices
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up">
                    Your one-stop destination to compare local vegetable prices. Save money and eat fresh every day!
                </p>
                <div className="bg-white p-4 rounded-full shadow-2xl max-w-2xl w-full mx-auto animate-zoom-in">
                    <form onSubmit={handleSearch} className="flex items-center">
                        <div className="flex items-center text-gray-500 pl-4 pr-2">
                             <LocationIcon />
                             <input
                                 type="text"
                                 value={location}
                                 onChange={(e) => setLocation(e.target.value)}
                                 className="w-48 ml-2 bg-transparent focus:outline-none text-sm"
                                 placeholder="Enter your location"
                            />
                        </div>
                        <div className="h-8 border-l border-gray-200 mx-4"></div>
                         <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-lg bg-transparent focus:outline-none"
                            placeholder="Search for 'Tomato' or 'Onion'..."
                        />
                        <button type="submit" className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-110">
                            <SearchIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    const SearchResultsPage = () => (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Search Results for "{searchTerm}"</h2>
            <p className="text-center text-gray-500 mb-8">Showing prices near {location}</p>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {searchResults.length > 0 ? (
                        searchResults.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 animate-slide-in"
                                style={{animationDelay: `${index * 100}ms`}}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800">{item.name}</h3>
                                            <p className="text-green-600 font-semibold text-lg">{item.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-700 font-medium">{item.shop}</p>
                                            <p className="text-sm text-gray-500">{item.distance}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-500 h-2 w-full"></div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                             <p className="text-xl text-gray-500">No results found for "{searchTerm}".</p>
                             <p className="text-gray-400 mt-2">Try searching for another vegetable.</p>
                        </div>
                    )}
                </div>
            </div>
             <button
                onClick={() => { setPage('home'); setSearchTerm(''); setSearchResults([]); }}
                className="mt-12 mx-auto block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow"
            >
                Back to Home
            </button>
        </div>
    );

    const AboutPage = () => (
         <div className="min-h-screen bg-white pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                 <h1 className="text-4xl font-extrabold text-gray-900">About VeggieFinder</h1>
                 <p className="mt-4 text-lg text-gray-600">
                    Our mission is to bring transparency to local vegetable markets, helping you find the freshest produce at the best prices.
                 </p>
            </div>
            <div className="max-w-4xl mx-auto mt-16 bg-gray-50 p-8 rounded-lg shadow-inner">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Meet the Creator</h2>
                 <p className="text-gray-700 mb-4">
                    My name is <span className="font-bold">Veda Akash</span>, and I'm a passionate developer dedicated to building tools that solve real-world problems. VeggieFinder was born from a simple idea: what if you could know the price of vegetables at different local shops before you even left the house?
                 </p>
                 <p className="text-gray-700">
                    This project combines my love for technology with a desire to help my community make smarter, healthier choices. I hope you find it useful!
                 </p>
            </div>
        </div>
    );

    const ContactPage = () => (
         <div className="min-h-screen bg-white pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                 <h1 className="text-4xl font-extrabold text-gray-900">Get In Touch</h1>
                 <p className="mt-4 text-lg text-gray-600">
                    Have questions, suggestions, or feedback? I'd love to hear from you!
                 </p>
            </div>
            <div className="max-w-lg mx-auto mt-16">
                 <form className="space-y-6">
                    <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="contact-name" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
                    </div>
                     <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="contact-email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
                    </div>
                     <div>
                        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea id="contact-message" rows="4" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Send Message
                        </button>
                    </div>
                 </form>
            </div>
        </div>
    );


const Footer = () => (
    <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 VeggieFinder. All Rights Reserved.</p>
            <p className="text-gray-400 text-sm mt-2">Created with ❤ by Veda Akash</p>
        </div>
    </footer>
);


    const renderPage = () => {
        switch (page) {
            case 'home':
                return <HomePage />;
            case 'search':
                return <SearchResultsPage />;
            case 'about':
                return <AboutPage />;
            case 'contact':
                return <ContactPage />;
            default:
                return <HomePage />;
        }
    }

    return (
        <div className="bg-white font-sans">
            <style>{`
                @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes zoom-in { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
                @keyframes slide-in { 0% { opacity: 0; transform: translateX(-30px); } 100% { opacity: 1; transform: translateX(0); } }
                .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out 0.3s forwards; }
                .animate-zoom-in { animation: zoom-in 0.6s ease-out 0.6s forwards; }
                .animate-slide-in { opacity: 0; animation: slide-in 0.5s ease-out forwards; }
            `}</style>

            <Navbar />
            
            <main>
                {renderPage()}
            </main>

            <AuthModal type="login" isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
            <AuthModal type="signup" isOpen={isSignupModalOpen} onClose={() => setSignupModalOpen(false)} />
             <Footer/>
        </div>
    );
}