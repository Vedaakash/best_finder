import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
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

const Navbar = ({ page, setPage, user, handleLogout, setLoginModalOpen, setSignupModalOpen, setGameModalOpen, setSubscriptionModalOpen }) => (
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

<button 
      onClick={() => setGameModalOpen(true)} 
      className="bg-purple-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600"
    >
      Play Game 🎮
    </button>

     <button 
      onClick={() => setSubscriptionModalOpen(true)}
      className="bg-yellow-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-600"
    >
      Subscribe
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
// In src/App.js, add these two new components

const SubscriptionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Your Subscription</h2>
        <p className="text-gray-600 mb-2">Get full access to all features and be eligible for weekly game contests!</p>
        <p className="text-lg font-bold text-green-600 mb-6">First month is FREE, then only ₹10/month.</p>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg">
          Subscribe Now (First Month Free)
        </button>
      </div>
    </div>
  );
};

const ContestModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const rewards = {
    top10: 150,
    top100: 80,
    top200: 60,
  };
  const items = [
    { name: '1kg Mangoes', price: 60 }, { name: '1kg Tomatoes', price: 25 },
    { name: '1kg Carrots', price: 25 }, { name: '1 Spinach Bundle', price: 10 },
    { name: '1 Curry Leaves', price: 5 }, { name: '1 Watermelon', price: 40 },
    { name: '1 Dozen Bananas', price: 50 }, { name: '1kg Onions', price: 30 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      {/* This will create a confetti blast when the modal is open */}
      {isOpen && <Confetti />}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Weekly Veggie Catcher Contest</h2>
        
        <div className="text-center mb-6">
          <p className="text-gray-700">Play the game, get the highest score, and win fresh produce!</p>
          <p className="text-sm text-gray-500">(Subscription required to participate)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold">Top 10 Ranks</h3>
            <p className="text-green-600 font-semibold">Win Items worth ₹{rewards.top10}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold">Ranks 11-100</h3>
            <p className="text-green-600 font-semibold">Win Items worth ₹{rewards.top100}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold">Ranks 101-200</h3>
            <p className="text-green-600 font-semibold">Win Items worth ₹{rewards.top200}</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-bold text-center mb-2">Choose Your Reward Items</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {items.map(item => (
              <span key={item.name} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{item.name} - ₹{item.price}</span>
            ))}
          </div>
        </div>

        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg">
          Pay ₹20 Entry Fee & Play
        </button>
      </div>
    </div>
  );
};

const InvitationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      {/* This adds the confetti blast */}
    {isOpen && <Confetti />}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon /></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎁 Invite Friends & Get Rewards!</h2>
        <p className="text-gray-600 mb-6">Share your unique code and earn free stuff when your friends sign up.</p>
        
        <div className="space-y-4 text-left">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg">Invite 5 Friends</h3>
            <p className="text-green-600">Get 1 Month Subscription FREE!</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold text-lg">Invite 10 Friends</h3>
            <p className="text-green-600">Get 1kg Guavas OR 1 Dozen Bananas + 1 Month FREE!</p>
          </div>
        </div>
        
        <p className="text-lg font-bold my-4">Your Invite Code: <span className="text-purple-600 bg-purple-100 px-2 py-1 rounded">VEDA2025</span></p>

        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg">
          Share Your Code
        </button>
      </div>
    </div>
  );
};
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

// In src/App.js, replace your old GameModal with this new version

// In src/App.js, replace your old GameModal with this new, high-performance version

// In src/App.js, replace your old GameModal with this new, final version

// In src/App.js, replace your GameModal with this final version

const GameModal = React.forwardRef(({ isOpen, onClose }, ref) => {
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [veggies, setVeggies] = useState([]);
  const [basketPosition, setBasketPosition] = useState({ x: GAME_WIDTH / 2 });
  const [gameState, setGameState] = useState('lobby');
  const [gameMode, setGameMode] = useState(null);
  const [lives, setLives] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState('');
  const lastMilestone = React.useRef(0);
  const spawnCooldown = Math.max(200, 800 - score);
  const lastSpawnTime = React.useRef(0);

  // --- State for Custom Game Settings ---
  const [customTime, setCustomTime] = useState(180); // Default 3 minutes (180s)
  const [customLives, setCustomLives] = useState(10);  // Default 10 lives

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      ref.current?.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'active') return;
    const gameInterval = setInterval(() => {
      setVeggies(currentVeggies =>
        currentVeggies.map(v => ({...v, y: v.y + v.speed, rotation: v.rotation + v.rotationSpeed})).filter(v => v.y < GAME_HEIGHT + 50)
      );
      const now = Date.now();
      if (now - lastSpawnTime.current > spawnCooldown) {
        lastSpawnTime.current = now;
        const veggieTypes = [
          { type: '🍅', points: 10 }, { type: '🧅', points: 5 }, { type: '🍎', points: 15 },
          { type: '🍌', points: 20 }, { type: '🍉', points: 25 }, { type: '🤢', points: -15 }
        ];
        const randomVeggie = veggieTypes[Math.floor(Math.random() * veggieTypes.length)];
        const newVeggie = {id: now, x: Math.random() * (GAME_WIDTH - 50) + 25, y: -50, speed: Math.random() * 2 + 3, rotation: 0, rotationSpeed: (Math.random() - 0.5) * 4, ...randomVeggie};
        setVeggies(currentVeggies => [...currentVeggies, newVeggie]);
      }
    }, 1000 / 60);
    return () => clearInterval(gameInterval);
  }, [gameState, score]);

  // Handle Collisions
  useEffect(() => {
    const veggiesAfterCollision = [];
    let scoreGained = 0;
    for (const veggie of veggies) {
      const basketLeft = basketPosition.x - 50;
      const basketRight = basketPosition.x + 50;
      if (veggie.y > GAME_HEIGHT - 60 && veggie.y < GAME_HEIGHT - 30 && veggie.x > basketLeft && veggie.x < basketRight) {
        scoreGained += veggie.points;
        if (veggie.points > 0) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 200);
        } else {
          if (gameMode === 'lives') setLives(l => l - 1);
        }
      } else {
        veggiesAfterCollision.push(veggie);
      }
    }
    if (scoreGained !== 0) {
      setScore(s => s + scoreGained);
      setVeggies(veggiesAfterCollision);
    }
  }, [veggies, basketPosition.x, gameMode]);

  // Timer, Lives, and Milestone Messages Logic
  useEffect(() => {
    if (gameState !== 'active') return;
    const milestones = { 200: "Good!", 400: "Excellent!", 600: "Marvelous!" };
    for (const ms in milestones) {
      if (score >= ms && lastMilestone.current < ms) {
        lastMilestone.current = parseInt(ms);
        setMilestoneMessage(milestones[ms]);
        setTimeout(() => setMilestoneMessage(''), 2000);
      }
    }
    if (gameMode === 'timer' && timeLeft <= 0) {
        setGameState('gameOver');
    } else if (gameMode === 'lives' && lives <= 0) {
        setGameState('gameOver');
    }
    if (gameMode === 'timer') {
      const timerInterval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timerInterval);
    }
  }, [gameState, gameMode, lives, timeLeft, score]);

  // Handle Mouse Movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if(gameState !== 'active') return;
      const gameArea = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - gameArea.left;
      if (newX > 50 && newX < GAME_WIDTH - 50) setBasketPosition({ x: newX });
    };
    const gameArea = document.getElementById('game-area');
    if (gameArea) gameArea.addEventListener('mousemove', handleMouseMove);
    return () => { if (gameArea) gameArea.removeEventListener('mousemove', handleMouseMove); };
  }, [gameState]);

  const startGame = (mode, value) => {
    setGameMode(mode);
    setScore(0);
    setVeggies([]);
    if (mode === 'timer') {
      setTimeLeft(value);
      setLives(0);
    } else if (mode === 'lives') {
      setLives(value);
      setTimeLeft(0);
    }
    setGameState('active');
    lastMilestone.current = 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div ref={ref} className="bg-gradient-to-b from-sky-400 to-sky-600 rounded-2xl shadow-2xl p-4 w-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white/70 hover:text-white z-30"><XIcon /></button>
        <div id="game-area" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }} className={`overflow-hidden relative rounded-lg ${isShaking ? 'shake' : ''}`}>
          
          <div className="absolute top-0 left-0 w-full flex justify-between p-4 text-white font-bold text-2xl z-20" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
            <span>Score: {score}</span>
            {gameMode === 'timer' && <span>Time: {timeLeft}</span>}
            {gameMode === 'lives' && <span>Lives: {lives}</span>}
          </div>
          <button onClick={toggleFullScreen} className="absolute top-2 left-2 text-white/70 hover:text-white z-30">⛶</button>

          {milestoneMessage && (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <span className="milestone-popup">{milestoneMessage}</span>
            </div>
          )}

          {gameState !== 'active' && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20">
              {gameState === 'lobby' && <>
                <h2 className="text-5xl text-white font-bold mb-8">Veggie Catcher</h2>
                
                {/* --- New Lobby UI with Sliders --- */}
                <div className="bg-white/20 p-6 rounded-lg w-full max-w-sm text-white">
                  <div className="mb-4">
                    <label className="block font-bold mb-2">Timer Mode</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="60" max="300" step="60" value={customTime} onChange={e => setCustomTime(e.target.value)} className="w-full" />
                      <span className="w-20 text-center">{customTime / 60} min</span>
                    </div>
                    <button onClick={() => startGame('timer', customTime)} className="w-full mt-2 bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-bold hover:bg-blue-600">Start Timer Mode</button>
                  </div>
                  <div>
                    <label className="block font-bold mb-2">Mistakes Mode</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="1" max="10" step="1" value={customLives} onChange={e => setCustomLives(e.target.value)} className="w-full" />
                      <span className="w-20 text-center">{customLives} lives</span>
                    </div>
                    <button onClick={() => startGame('lives', customLives)} className="w-full mt-2 bg-red-500 text-white px-6 py-2 rounded-lg text-lg font-bold hover:bg-red-600">Start Mistakes Mode</button>
                  </div>
                </div>

              </>}
              {gameState === 'gameOver' && <>
                <h2 className="text-5xl text-white font-bold mb-4">Game Over!</h2>
                <p className="text-2xl text-white mb-8">Final Score: {score}</p>
                <button onClick={() => setGameState('lobby')} className="bg-green-500 text-white px-8 py-4 rounded-lg text-2xl font-bold hover:bg-green-600">Play Again</button>
              </>}
            </div>
          )}

          {veggies.map(veggie => (
            <div key={veggie.id} className="text-4xl absolute" style={{ left: veggie.x, top: veggie.y, transform: `rotate(${veggie.rotation}deg)` }}>
              {veggie.type}
            </div>
          ))}

          <div className="text-6xl absolute" style={{ left: basketPosition.x - 50, top: GAME_HEIGHT - 60 }}>🧺</div>
        </div>
      </div>
    </div>
  );
});

// In src/App.js, add this new component
// In src/App.js, replace the old OfferCube component with this

// In src/App.js, replace the old OfferCube component with this

const OfferCube = ({ setContestModalOpen, setInvitationModalOpen }) => {
  // State for the cube's position on the screen
  const [position, setPosition] = useState({ x: 20, y: 20 }); // right, bottom
  // State to track if the user is currently dragging
  const [isMoving, setIsMoving] = useState(false);

  const prevMousePos = React.useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsMoving(true);
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isMoving) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;

    // Update position based on mouse movement
    setPosition(prev => ({
      x: prev.x - deltaX,
      y: prev.y - deltaY,
    }));

    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsMoving(false);
  };

  useEffect(() => {
    // We add listeners to the whole window for smooth dragging
    if (isMoving) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMoving]);

  const openContest = () => {
    if (!isMoving) {
      setContestModalOpen(true);
    }
  };
   const openInvitation = () => {
    if (!isMoving) {
      setInvitationModalOpen(true);
    }
  };

  return (
    <div 
      className="scene" 
      onMouseDown={handleMouseDown}
      // The style now controls the position on the screen
      style={{ bottom: `${position.y}px`, right: `${position.x}px` }}
    >
      <div className="cube">
        {/* We only allow clicking if the user is not in the middle of a drag */}
        <div className="cube__face cube__face--front" onClick={openContest}>
  🏆 Weekly Contest! Click to open.
</div>
<div className="cube__face cube__face--back" onClick={openContest}>
  🏆 Weekly Contest! Click to open.
</div>
<div className="cube__face cube__face--right" onClick={openInvitation}>
   🎁 Invite friends & get free stuff!
</div>
<div className="cube__face cube__face--left" onClick={openInvitation}>
   🎁 Invite friends & get free stuff!
</div>
<div className="cube__face cube__face--top" onClick={openContest}>
  🏆 Weekly Contest! Click to open.
</div>
<div className="cube__face cube__face--bottom" onClick={openInvitation}>
   🎁 Invite friends & get free stuff!
</div>
      </div>
    </div>
  );
};
const FeaturedItems = ({ handleItemClickSearch }) => {
    const items = [
        { name: 'Tomato', image: tomatoimg },
        { name: 'Onion', image: onionimg },
        { name: 'Apple', image: appleimg},
        { name: 'Potato', image: potatoimg },
        { name: 'Banana', image: bananaimg },
        { name: 'Carrot', image: carrotimg },
        { name: 'Orange', image: orangeimg},
        { name: 'Spinach', image: spinachimg },
        { name: 'Chilli', image: mirchiimg }
    ];

    return (
        <div className="w-full py-12">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 mt-16">Or Click to Search Popular Items</h2>
            
            <div className="floating-container">
                <div className="water"></div>
                <div className="bubble-track">
                    {/* We duplicate the list 3 times for a perfectly seamless loop */}
                    {[...items, ...items, ...items].map((item, index) => (
                        <div 
                          key={index} 
                          className="bubble" 
                          onClick={() => handleItemClickSearch(item.name)}
                          // This makes each bubble float at a different time
                          style={{ animationDelay: `${index * 0.3}s` }} 
                        >
                            <img src={item.image} alt={item.name} />
                            <div className="label">{item.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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
  const [isGameModalOpen, setGameModalOpen] = useState(false);
  const [isInvitationModalOpen, setInvitationModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [isContestModalOpen, setContestModalOpen] = useState(false);
const gameModalRef = React.useRef(null);

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
      { name: 'Fruit Junction', price: '₹45/dozen', distance: '1.5km', city: 'Varanasi', rating: 4.3, reviews: 89 },
      { name: 'Fruit Junction', price: '₹50/kg', distance: '1.5km', city: 'Lucknow', rating: 4.9, reviews: 250 }, 
      { name: 'Farm veggie', price: '₹42/kg', distance: '0.8km', city: 'Lucknow', rating: 4.8, reviews: 152 }
    ]},
    { id: 9, name: 'Orange', shops: [ 
      { name: 'Farm Fresh', price: '₹80/kg', distance: '0.8km', city: 'Kanpur', rating: 4.8, reviews: 152 },
      { name: 'Fruit Junction', price: '₹75/kg', distance: '1.5km', city: 'Lucknow', rating: 4.9, reviews: 250 }, 
      { name: 'Farm veggie', price: '₹72/kg', distance: '0.8km', city: 'Lucknow', rating: 4.8, reviews: 152 }
    ]},
     { id: 4, name: 'chilli', shops: [ 
      { name: 'Farm Fresh', price: '₹130/kg', distance: '0.8km', city: 'Kanpur', rating: 4.8, reviews: 152 },
      { name: 'Fruit Junction', price: '125/kg', distance: '1.5km', city: 'Lucknow', rating: 4.9, reviews: 250 }, 
      { name: 'Farm veggie', price: '₹135/kg', distance: '0.8km', city: 'Lucknow', rating: 4.8, reviews: 152 }
    ]},
    { id: 5, name: 'spinach', shops: [
      { name: 'Farm Fresh', price: '₹15/bundle', distance: '0.8km', city: 'Lucknow', rating: 4.8, reviews: 152 },
      { name: 'Organic World', price: '₹20/bundle', distance: '3.1km', city: 'Lucknow', rating: 4.6, reviews: 95 },
      { name: 'Fresh Veggies Co.', price: '₹10/bundle', distance: '1.2km', city: 'Lucknow', rating: 4.2, reviews: 88 },
      { name: 'Varanasi Veggies', price: '₹12/bundle', distance: '2.2km', city: 'Varanasi', rating: 4.7, reviews: 180 },
    ]},
    { id: 6, name: 'carrot', shops: [
      { name: 'Fresh Veggies Co.', price: '₹20/kg', distance: '1.2km', city: 'Lucknow', rating: 4.2, reviews: 88 },
      { name: 'Farm Fresh', price: '₹18/kg', distance: '0.8km', city: 'Lucknow', rating: 4.8, reviews: 152 },
      { name: 'Daily Needs Grocery', price: '₹28/kg', distance: '2.5km', city: 'Lucknow', rating: 3.9, reviews: 45 },
      { name: 'Kanpur Mandi', price: '₹24/kg', distance: '1.5km', city: 'Kanpur', rating: 4.5, reviews: 210 },
    ]},
      
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
   <Navbar page={page} setPage={resetSearch} user={user} handleLogout={handleLogout} setLoginModalOpen={setLoginModalOpen} setSignupModalOpen={setSignupModalOpen} setGameModalOpen={setGameModalOpen} setSubscriptionModalOpen={setSubscriptionModalOpen} />
   <main>
       {renderPage()}
   </main>
   
         {/* This is the single, correct placement for your Footer */}
    <Footer/>

         {/* All your modals will now correctly appear over the main content and footer */}
  <AuthModal type="login" isOpen={isLoginModalOpen} onClose={() => { setLoginModalOpen(false); setAuthError(null); }} handleAuth={handleLogin} authError={authError} />
  <AuthModal type="signup" isOpen={isSignupModalOpen} onClose={() => { setSignupModalOpen(false); setAuthError(null); }} handleAuth={handleSignup} authError={authError} />
  <RatingModal 
    isOpen={isRatingModalOpen} 
    onClose={() => setRatingModalOpen(false)} 
    shop={shopToRate}
    onSubmit={handleReviewSubmit}
  />
  <GameModal 
            isOpen={isGameModalOpen} 
            onClose={() => setGameModalOpen(false)}
          ref={gameModalRef}

          />
<OfferCube setContestModalOpen={setContestModalOpen} setInvitationModalOpen={setInvitationModalOpen} />
<SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={() => setSubscriptionModalOpen(false)} />
      <ContestModal isOpen={isContestModalOpen} onClose={() => setContestModalOpen(false)} />
        <InvitationModal isOpen={isInvitationModalOpen} onClose={() => setInvitationModalOpen(false)} />
 
        </div>
    );
}
  