import React, { useState, useEffect } from 'react';
import logo from './images/logo.jpg';
import tomatoimg from './images/fresh tomato';
import potatoimg from './images/potato';
import bananaimg from './images/banana.jpg';
import onionimg from './images/onion';
import mirchiimg from './images/green chilli.webp';
import orangeimg from './images/orange.jpg';
import spinachimg from './images/spinach.jpeg';
import carrotimg from './images/carrots.jpg';
import appleimg from './images/apples.jpg';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { auth } from "./firebase";
// --- IMPORTANT: REPLACE WITH YOUR FIREBASE CONFIG ---
 

// --- SVG Icons ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

// --- UI Components ---

const Navbar = ({ page, setPage, user, handleLogout, setLoginModalOpen, setSignupModalOpen }) => (
    <nav className="bg-white/70 backdrop-blur-lg shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
    <img src={logo} alt="freshpricer logo" className="h-16 w-auto mr-2"/>
    <span className="font-bold text-2xl text-green-600"><h1><b>FreshPricer</b></h1></span>
</div>
                <div className="hidden md:flex items-center space-x-4">
                    <button
  onClick={() => setPage('home')}
  className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
    page === 'home' && 'text-green-600 font-semibold'
  }`}
>
  Home
</button>

<button
  onClick={() => setPage('about')}
  className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
    page === 'about' && 'text-green-600 font-semibold'
  }`}
>
  About
</button>

<button
  onClick={() => setPage('contact')}
  className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
    page === 'contact' && 'text-green-600 font-semibold'
  }`}
>
  Contact
</button>

                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-gray-700 text-sm font-medium">Welcome, {user.email.split('@')[0]}</span>
                            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">Logout</button>
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
// A new component for submitting reviews
const RatingModal = ({ isOpen, onClose, shop, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Basic validation
    if (rating === 0) {
      alert('Please select a rating and write a review.');
      return;
    }
    onSubmit({ shopName: shop.name, rating, reviewText });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Rate {shop.name}</h2>
        
        {/* Star Rating Input */}
        <div className="flex justify-center my-4">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)} className="text-4xl">
              <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
            </button>
          ))}
        </div>

        {/* Review Text Area */}
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience..."
          className="shadow-inner appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-700 h-28"
        />

        <button onClick={handleSubmit} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg">
          Submit Review
        </button>
      </div>
    </div>
  );
};
const FeaturedItems = ({ handleItemClickSearch }) => {
    const items = [
        { name: 'Tomato', image: tomatoimg },
        { name: 'Onion', image: onionimg },
        { name: 'Apple', image: appleimg },
        { name: 'Potato', image: potatoimg },
        { name: 'Banana', image: bananaimg },
        { name: 'Carrot', image: carrotimg },
        { name: 'Orange', image: orangeimg },
        { name: 'Spinach', image:spinachimg },
        { name: 'chilli', image: mirchiimg }
    ];
    return (
        <div className="w-full overflow-hidden relative py-12 group">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Or Click to Search Popular Items</h2>
            <div className="flex animate-scroll group-hover:pause">
                {/* This line duplicates the items array to ensure a seamless loop */}
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
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 animate-fade-in-down main-heading">
                Find the <span className="text-green-300">Best</span> Prices
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-down sub-heading">
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

const SearchResultsPage = ({ searchTerm, location, searchResults, setPage, filters, setFilters, setShopToRate, setRatingModalOpen }) => {
  // Logic to sort the results based on the current sortOrder state
  const sortedResults = React.useMemo(() => {
    if (!searchResults || searchResults.length === 0) return [];

    const sortedShops = [...searchResults[0].shops];

    // First, sort by the active rating filter (if any)
    if (filters.rating) {
        sortedShops.sort((a, b) => filters.rating === 'asc' ? a.rating - b.rating : b.rating - a.rating);
    }

    // Then, sort by the active price filter (this will be the primary sort if rating is not set)
    if (filters.price) {
        sortedShops.sort((a, b) => {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
            const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
            return filters.price === 'asc' ? priceA - priceB : priceB - priceA;
        });
    }

    return [{ ...searchResults[0], shops: sortedShops }];
}, [searchResults, filters]);


  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white mb-2 main-heading">Results for "<span className="text-green-300">{searchTerm}</span>"</h2>
        <p className="text-blue-100 sub-heading">Showing prices near {location}</p>
      </div>

      {/* --- THIS IS THE NEW FILTER BUTTONS UI --- */}
      {/* --- THIS IS THE NEW FILTER BUTTONS UI --- */}
<div className="max-w-4xl mx-auto mb-8 flex justify-center flex-wrap gap-2 filter-buttons">
    <button 
        onClick={() => setFilters(f => ({ ...f, price: f.price === 'asc' ? null : 'asc' }))} 
        className={filters.price === 'asc' ? 'active' : ''}
    >
        Price: Low to High
    </button>
    <button 
        onClick={() => setFilters(f => ({ ...f, price: f.price === 'desc' ? null : 'desc' }))} 
        className={filters.price === 'desc' ? 'active' : ''}
    >
        Price: High to Low
    </button>
    <button 
        onClick={() => setFilters(f => ({ ...f, rating: f.rating === 'desc' ? null : 'desc' }))} 
        className={filters.rating === 'desc' ? 'active' : ''}
    >
        Rating: High to Low
    </button>
    <button 
        onClick={() => setFilters(f => ({ ...f, rating: f.rating === 'asc' ? null : 'asc' }))} 
        className={filters.rating === 'asc' ? 'active' : ''}
    >
        Rating: Low to High
    </button>
</div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* We now map over 'sortedResults' instead of 'searchResults' */}
        {sortedResults.length > 0 ? (
          sortedResults.map((item, index) => (
            <div key={item.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 animate-slide-in-up" style={{ animationDelay: `${index * 120}ms` }}>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">{item.name}</h3>
              
<div className="space-y-4">
  
  {item.shops.map(shop => (
      <div key={shop.name} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-lg hover:bg-green-50 transition-colors">
          <div>
              <p className="font-semibold text-lg text-gray-700">{shop.name}</p>
              <div className="flex items-center mt-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-gray-600 font-bold ml-1">{shop.rating}</span>
                  <span className="text-gray-500 text-sm ml-2">({shop.reviews} reviews)</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{shop.distance}</p>
          </div>
          <div className="flex flex-col items-end">
              <p className="text-xl font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">{shop.price}</p>
              <button 
                onClick={() => { setShopToRate(shop); setRatingModalOpen(true); }}
                className="mt-2 text-xs text-blue-600 hover:underline"
              >
                Rate & Review
              </button>
          </div>
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
      <button onClick={() => setPage('home')} className="mt-12 mx-auto block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 shadow-lg transition-all transform hover:scale-105">
        Back to Home
      </button>
    </div>
  );
};

const AboutPage = () => (
     <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
         <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-lg">
               <h1 className="text-4xl font-extrabold text-gray-900 text-center">About freshpricer</h1>
               <p className="mt-4 text-lg text-gray-600 text-center">Our mission is to bring transparency to local markets, helping you find the freshest produce at the best prices.</p>
              <div className="mt-8">
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

 // This is the NEW code for the Footer component

const Footer = () => (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Get In Touch</h3>
            <p className="text-gray-400 mb-6">Have questions or feedback? I'd love to hear from you.</p>
            <div className="flex justify-center items-center space-x-6 mb-8">
                <a href="mailto:vedaakashyendluri@gmail.com" className="text-sky-400 hover:text-sky-300 transition-colors">
                    vedaakashyendluri@gmail.com
                </a>
                <span className="text-gray-500">|</span>
                <p className="text-gray-300">Ahmamau, Uttar Pradesh, India</p>
            </div>
            <div className="border-t border-gray-700 pt-6">
                <p className="text-gray-500 text-sm">&copy; 2024 VeggieFinder by Veda Akash. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);
export default function App() {
    const [page, setPage] = useState('home');
    const [location, setLocation] = useState('Lucknow, Uttar Pradesh');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setSignupModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [filters, setFilters] = useState({ price: 'asc', rating: null });
    const [isRatingModalOpen, setRatingModalOpen] = useState(false);
  const [shopToRate, setShopToRate] = useState(null);

  // ...
  
  // Add this new handler function
  const handleReviewSubmit = (reviewData) => {
    console.log("New Review Submitted:", reviewData);
    
    setDb(currentDb => {
      // Create a deep copy of the database to safely modify it
      const newDb = JSON.parse(JSON.stringify(currentDb));
      
      // Find the specific shop that was reviewed
      for (const item of newDb) {
        const shop = item.shops.find(s => s.name === reviewData.shopName);
        if (shop) {
          // Calculate the new average rating
          const totalRating = shop.rating * shop.reviews;
          const newTotalReviews = shop.reviews + 1;
          const newAverageRating = (totalRating + reviewData.rating) / newTotalReviews;
          
          // Update the shop's data
          shop.rating = Math.round(newAverageRating * 10) / 10; // Round to one decimal place
          shop.reviews = newTotalReviews;
          break; // Stop searching once the shop is found and updated
        }
      }
      return newDb;
    });

    setRatingModalOpen(false); // Close the modal
    alert(`Thank you for reviewing ${reviewData.shopName}!`);
  };



    const initialDb = [
    { id: 1, name: 'Tomato', shops: [
      { name: 'Fresh Veggies Co.', price: '₹25/kg', distance: '1.2km', city: 'Lucknow', rating: 4.2, reviews: 88 },
      { name: 'Farm Fresh', price: '₹22/kg', distance: '0.8km', city: 'Lucknow', rating: 4.8, reviews: 152 },
      { name: 'Daily Needs Grocery', price: '₹28/kg', distance: '2.5km', city: 'Lucknow', rating: 3.9, reviews: 45 },
      { name: 'Kanpur Mandi', price: '₹24/kg', distance: '1.5km', city: 'Kanpur', rating: 4.5, reviews: 210 },
    ]},
    { id: 2, name: 'Onion', shops: [
      { name: 'Farm Fresh', price: '₹30/kg', distance: '0.8km', city: 'Lucknow', rating: 4.8, reviews: 152 },
      { name: 'Organic World', price: '₹35/kg', distance: '3.1km', city: 'Lucknow', rating: 4.6, reviews: 95 },
      { name: 'Fresh Veggies Co.', price: '₹32/kg', distance: '1.2km', city: 'Lucknow', rating: 4.2, reviews: 88 },
      { name: 'Varanasi Veggies', price: '₹28/kg', distance: '2.2km', city: 'Varanasi', rating: 4.7, reviews: 180 },
    ]},
    { id: 3, name: 'Potato', shops: [
      { name: 'Daily Needs Grocery', price: '₹20/kg', distance: '2.5km', city: 'Lucknow', rating: 3.9, reviews: 45 },
      { name: 'Fresh Veggies Co.', price: '₹18/kg', distance: '1.2km', city: 'Lucknow', rating: 4.2, reviews: 88 },
      { name: 'Kanpur Mandi', price: '₹15/kg', distance: '1.5km', city: 'Kanpur', rating: 4.5, reviews: 210 },
      { name: 'Farm Fresh', price: '₹21/kg', distance: '0.8km', city: 'Lucknow', rating: 4.8, reviews: 152 },
    ]},
    { id: 7, name: 'Apple', shops: [ 
      { name: 'Fruit Junction', price: '₹120/kg', distance: '1.5km', city: 'Lucknow', rating: 4.9, reviews: 250 }, 
      { name: 'Farm Fresh', price: '₹110/kg', distance: '0.8km', city: 'Lucknow', rating: 4.8, reviews: 152 } 
    ]},
    { id: 8, name: 'Banana', shops: [ 
      { name: 'Daily Needs Grocery', price: '₹40/dozen', distance: '2.5km', city: 'Kanpur', rating: 4.1, reviews: 112 }, 
      { name: 'Fruit Junction', price: '₹45/dozen', distance: '1.5km', city: 'Varanasi', rating: 4.3, reviews: 89 } 
    ]},
    { id: 9, name: 'Orange', shops: [ 
      { name: 'Farm Fresh', price: '₹80/kg', distance: '0.8km', city: 'Kanpur', rating: 4.8, reviews: 152 } 
    ]}
  ];
  
  const [db, setDb] = useState(initialDb);

    // In the App() component, below your other useEffect
// In your App() component

    useEffect(() => { 
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, currentUser => setUser(currentUser)); 
        return () => unsubscribe(); 
    }, []);
  useEffect(() => {
    // This effect runs whenever the search term or the main database changes
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const item = db.find(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (item) {
      const filteredShops = item.shops.filter(shop => 
        shop.city && shop.city.toLowerCase().includes(location.split(',')[0].toLowerCase())
      );
      
      // We keep a temporary copy of the found item but with the filtered shops
      const result = [{ ...item, shops: filteredShops }];
      setSearchResults(result);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, location, db]); // The key is adding `db` to this list
    
    const resetSearch = () => {
      setSearchTerm('');
      setSearchResults([]);
      setPage('home');
    }

    const handleSearch = (e) => {
  e.preventDefault();
  setPage('search');
  // The useEffect will now handle the rest
};

const handleItemClickSearch = (itemName) => {
  setSearchTerm(itemName);
  setPage('search');
  // The useEffect will now handle the rest
};

     
  

    const handleSignup = async (email, password) => { setAuthError(null); try { await createUserWithEmailAndPassword(auth, email, password); setSignupModalOpen(false); } catch (error) { setAuthError(error.message); } };
    const handleLogin = async (email, password) => { setAuthError(null); try { await signInWithEmailAndPassword(auth, email, password); setLoginModalOpen(false); } catch (error) { setAuthError(error.message); } };
    const handleLogout = async () => { await signOut(auth); };

    const renderPage = () => {
      switch(page) {
        case 'home':
          return <HomePage handleSearch={handleSearch} location={location} setLocation={setLocation} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleItemClickSearch={handleItemClickSearch} />;
        case 'search':
  return <SearchResultsPage
    searchTerm={searchTerm} 
    location={location} 
    searchResults={searchResults} 
    setPage={resetSearch}
    filters={filters}
    setFilters={setFilters}
    setShopToRate={setShopToRate}
    setRatingModalOpen={setRatingModalOpen}
  />;
        case 'about':
          return <AboutPage />;
        case 'contact':
          return <ContactPage />;
        default:
          return <HomePage handleSearch={handleSearch} location={location} setLocation={setLocation} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleItemClickSearch={handleItemClickSearch} />;
      }
    };
  
    return (
        <div className="font-sans">
          <Navbar page={page} setPage={resetSearch} user={user} handleLogout={handleLogout} setLoginModalOpen={setLoginModalOpen} setSignupModalOpen={setSignupModalOpen} />
          <main>
              {renderPage()}
          </main>
           
          <AuthModal type="login" isOpen={isLoginModalOpen} onClose={() => { setLoginModalOpen(false); setAuthError(null); }} handleAuth={handleLogin} authError={authError} />
          <AuthModal type="signup" isOpen={isSignupModalOpen} onClose={() => { setSignupModalOpen(false); setAuthError(null); }} handleAuth={handleSignup} authError={authError} />
          <RatingModal 
        isOpen={isRatingModalOpen} 
        onClose={() => setRatingModalOpen(false)} 
        shop={shopToRate}
        onSubmit={handleReviewSubmit}
      />
          <Footer/>
        </div>
    );
  
  }
  