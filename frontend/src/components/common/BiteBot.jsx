import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  ShoppingBag,
  Star,
  Clock,
  Flame,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { MOCK_DISHES } from '../../data/mockData';

const QUICK_PROMPTS = [
  '🍕 Best Pizzas',
  '🍚 Royal Biryani',
  '🍰 Sweet Desserts',
  '🍔 Juicy Burgers',
  '⚡ Fast Delivery (<20m)',
  '🏷️ Active Coupons'
];

const BiteBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! 🙏 I'm BiteBot, your personal QuickBite food assistant. Hungry? Tell me what you're craving or pick a recommendation below! ✨",
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Smart bot processing after 600ms
    setTimeout(() => {
      processBotResponse(query.toLowerCase());
      setIsTyping(false);
    }, 600);
  };

  const processBotResponse = (lowerQuery) => {
    let replyText = '';
    let suggestedDishes = [];

    if (lowerQuery.includes('pizza')) {
      replyText = '🍕 Here are the hottest, cheesiest woodfired pizzas freshly baked for you:';
      suggestedDishes = MOCK_DISHES.filter((d) => d.category?.toLowerCase() === 'pizza');
    } else if (lowerQuery.includes('biryani')) {
      replyText = '🍚 Craving Nizami royalty? These authentic dum biryanis are prepared with aged basmati and saffron:';
      suggestedDishes = MOCK_DISHES.filter((d) => d.category?.toLowerCase() === 'biryani');
    } else if (lowerQuery.includes('burger')) {
      replyText = '🍔 Check out these caramelized smash burgers loaded with cheddar and house bunker sauce:';
      suggestedDishes = MOCK_DISHES.filter((d) => d.category?.toLowerCase() === 'burger');
    } else if (lowerQuery.includes('dessert') || lowerQuery.includes('sweet') || lowerQuery.includes('cake')) {
      replyText = '🍰 Treat yourself! Here are our most decadent desserts:';
      suggestedDishes = MOCK_DISHES.filter((d) => d.category?.toLowerCase() === 'desserts');
    } else if (lowerQuery.includes('drink') || lowerQuery.includes('beverage') || lowerQuery.includes('cold')) {
      replyText = '🍹 Quench your thirst with our chilled botanical fruit coolers and shakes:';
      suggestedDishes = MOCK_DISHES.filter((d) => d.category?.toLowerCase() === 'beverages');
    } else if (lowerQuery.includes('fast') || lowerQuery.includes('quick') || lowerQuery.includes('20')) {
      replyText = '⚡ Superfast delivery under 20 minutes! These hot dishes are ready to dispatch:';
      suggestedDishes = MOCK_DISHES.slice(0, 3);
    } else if (lowerQuery.includes('coupon') || lowerQuery.includes('deal') || lowerQuery.includes('offer')) {
      replyText = '🎉 Here are today’s best savings vouchers!\n\n• QUICKBITE50: 50% OFF up to ₹150\n• MOJKARO: Flat ₹100 Instant Discount on orders > ₹349\n• FEAST20: 20% OFF on Group Meals';
    } else if (lowerQuery.includes('hi') || lowerQuery.includes('hello') || lowerQuery.includes('hey')) {
      replyText = 'Hello food lover! 😋 I can help you search pizzas, juicy burgers, dum biryanis, desserts, or find today’s active coupons. What sounds good right now?';
    } else {
      replyText = `Great choice! Here are top culinary picks matching "${lowerQuery}":`;
      // Fuzzy filter or popular fallback
      suggestedDishes = MOCK_DISHES.slice(0, 3);
    }

    const botMsg = {
      id: Date.now() + 1,
      sender: 'bot',
      text: replyText,
      dishes: suggestedDishes,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  const handleAddDishFromBot = (dish) => {
    addToCart(dish, { _id: dish.restaurantId, name: dish.restaurantName || 'QuickBite Kitchen' });
    showToast(`Added ${dish.name} to your Feast!`, 'success');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        id="quickbite-chatbot-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '86px',
          right: '20px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#FF7200',
          backgroundImage: 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 8900,
          boxShadow: '0 8px 24px rgba(255, 114, 0, 0.5), 0 0 16px rgba(255, 114, 0, 0.3)',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label="Open AI Food Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {/* Pulsing online badge */}
        <span
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#22C55E',
            border: '2px solid #0F0F0F'
          }}
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="animate-slide-up"
          style={{
            position: 'fixed',
            bottom: '150px',
            right: '20px',
            width: 'calc(100vw - 40px)',
            maxWidth: '380px',
            height: '520px',
            backgroundColor: '#161616',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '26px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 114, 0, 0.15)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Chat Window Header */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#1E1E1E',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#FF7200',
                  backgroundImage: 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>BiteBot AI</span>
                  <span style={{ fontSize: '10px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22C55E', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>ONLINE</span>
                </div>
                <div style={{ fontSize: '11px', color: '#9E9E9E' }}>Khaao Pio Moj Karo Assistant</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#262626',
                border: 'none',
                color: '#9E9E9E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Bubble */}
                <div
                  style={{
                    maxWidth: '82%',
                    backgroundColor: m.sender === 'user' ? '#FF7200' : '#222222',
                    color: '#FFFFFF',
                    borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    lineHeight: 1.45,
                    border: m.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {m.text}
                </div>

                {/* Dish Recommendation Cards embedded in message */}
                {m.dishes && m.dishes.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginTop: '8px',
                      width: '100%'
                    }}
                  >
                    {m.dishes.map((dish) => (
                      <div
                        key={dish._id}
                        style={{
                          backgroundColor: '#1E1E1E',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <img
                          src={dish.image}
                          alt={dish.name}
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '12px',
                            objectFit: 'cover'
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {dish.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '11px', color: '#9E9E9E' }}>
                            <span style={{ color: '#FF7200', fontWeight: 700 }}>
                              ₹{dish.price}
                            </span>
                            <span>⭐ {dish.rating || 4.9}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddDishFromBot(dish)}
                          style={{
                            backgroundColor: '#FF7200',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '6px 12px',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <ShoppingBag size={12} />
                          <span>Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <span style={{ fontSize: '10px', color: '#6E6E6E', marginTop: '3px', padding: '0 4px' }}>
                  {m.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#222222', padding: '8px 14px', borderRadius: '14px', width: 'fit-content' }}>
                <Sparkles size={14} color="#FF7200" />
                <span style={{ fontSize: '12px', color: '#9E9E9E' }}>BiteBot is cooking suggestions...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: '#1A1A1A',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}
          >
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                style={{
                  backgroundColor: '#262626',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  padding: '5px 10px',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '12px 16px',
              backgroundColor: '#1E1E1E',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Ask BiteBot: 'Suggest pizza', 'Offers'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#161616',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px',
                padding: '9px 16px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#FF7200',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Send"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default BiteBot;
