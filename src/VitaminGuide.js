import React from 'react';
import './VitaminGuide.css'; // We will define simple styles below

const vitaminData = [
  {
    id: 1,
    name: "Vitamin A",
    icon: "🥕",
    sources: "Carrot, Papaya, Spinach, Pumpkin, Sweet Potato",
    benefits: [
      "👁️ Clear Night Vision",
      "✨ Glowing Skin",
      "🛡️ Strong Immunity",
      "🦴 Strong Bones"
    ]
  },
  {
    id: 2,
    name: "Vitamin C",
    icon: "🍊",
    sources: "Lemon, Orange, Tomato, Guava, Capsicum",
    benefits: [
      "🦠 Fights Cold & Flu",
      "🤕 Heals Wounds Fast",
      "🦷 Healthy Gums",
      "⚡ Absorbs Iron Better"
    ]
  },
  {
    id: 3,
    name: "Vitamin B6",
    icon: "🍌",
    sources: "Banana, Potato, Methi, Garlic, Watermelon",
    benefits: [
      "😌 Reduces Anxiety",
      "🧠 Sharp Memory",
      "😴 Better Sleep",
      "🩸 Good Blood Flow"
    ]
  },
  {
    id: 4,
    name: "Iron",
    icon: "🌿",
    sources: "Spinach, Beetroot, Pomegranate, Dates, Jaggery",
    benefits: [
      "🔴 Increases Blood (Hb)",
      "⚡ Fixes Tiredness",
      "💇‍♀️ Hair Growth",
      "🏃‍♂️ Muscle Strength"
    ]
  },
  {
    id: 5,
    name: "Fiber",
    icon: "🌽",
    sources: "Corn, Apple, Cucumber, Beans, Guava",
    benefits: [
      "🥣 Easy Digestion",
      "📉 Controls Sugar",
      "🚽 No Constipation",
      "⚖️ Helps Weight Loss"
    ]
  }
];

const VitaminGuide = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* --- REPLACED HEADER WITH BIG CLOSE BUTTON --- */}
        <div className="modal-header">
          <h2>🍏 Health & Vitamin Guide</h2>
          <button className="close-btn" onClick={onClose}>
            {/* Big Red X Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* The Table */}
        <div className="table-container">
          <table className="vitamin-table">
            <thead>
              <tr>
                <th style={{width: '15%'}}>Vitamin</th>
                <th style={{width: '40%'}}>🍎 Eat These</th>
                <th style={{width: '45%'}}>✨ Superpowers</th>
              </tr>
            </thead>
            <tbody>
              {vitaminData.map((item) => (
                <tr key={item.id}>
                  <td className="vit-name">
                    <span className="vit-icon">{item.icon}</span>
                    <br/>
                    <strong>{item.name}</strong>
                  </td>
                  <td className="vit-source">{item.sources}</td>
                  <td className="vit-benefit">
                    <ul>
                      {item.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="modal-footer">
          <p>💡 Tip: Eat colorful veggies for better health!</p>
        </div>

      </div>
    </div>
  );
};

export default VitaminGuide;