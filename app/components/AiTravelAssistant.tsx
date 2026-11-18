'use client';

import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Calendar, 
  Languages, 
  Compass, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AiTravelAssistant: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, formatPrice } = useApp();

  const [activeTab, setActiveTab] = useState<'itinerary' | 'translate' | 'recommend'>('itinerary');

  // Itinerary Planner State
  const [targetCity, setTargetCity] = useState('Goa');
  const [tripDays, setTripDays] = useState(3);
  const [tripVibe, setTripVibe] = useState('Relaxation & Beach');
  const [generatedItinerary, setGeneratedItinerary] = useState<any[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Translator State
  const [targetLanguage, setTargetLanguage] = useState<'Hindi' | 'French' | 'Spanish' | 'Japanese'>('Hindi');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isAiModalOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      if (targetCity === 'Goa') {
        setGeneratedItinerary([
          {
            day: 'Day 1: Coastal Arrival & Sunset Sailing',
            morning: 'Airport pickup in private Innova Crysta; early check-in at Candolim villa with luggage concierge.',
            afternoon: 'Casual seafood lunch at beachfront shack; relax by private plunge pool.',
            evening: 'Catamaran cruise from Mandovi Bay watching dolphins; dinner at heritage Portuguese restaurant.',
          },
          {
            day: 'Day 2: Old Goa Heritage & Spice Plantation',
            morning: 'Dedicated sightseeing cab to Basilica of Bom Jesus and Se Cathedral in Velha Goa.',
            afternoon: 'Guided walk through Sahakari spice plantation with traditional buffet lunch on banana leaves.',
            evening: 'Sunset cocktail overlooking Chapora Fort; live jazz at Panaji Latin Quarter (Fontainhas).',
          },
          {
            day: 'Day 3: Ashwem Beach & Holistic Spa',
            morning: 'Scenic coastal drive to serene Ashwem & Morjim; morning paddleboarding lesson.',
            afternoon: 'Ayurvedic hot stone massage; café hopping in Anjuna.',
            evening: 'Farewell candlelit beach barbecue under the stars.',
          },
        ].slice(0, tripDays));
      } else if (targetCity === 'Udaipur') {
        setGeneratedItinerary([
          {
            day: 'Day 1: Lake Pichola Arrival & Royal Haveli',
            morning: 'Chauffeured arrival from Maharana Pratap Airport; private boat transfer to Lake Pichola suite.',
            afternoon: 'Explore City Palace complex with royal curator guide; admire crystal gallery.',
            evening: 'Sunset boat cruise around Jag Mandir island palace; candlelit rooftop Rajasthani dinner.',
          },
          {
            day: 'Day 2: Heritage Bazaars & Folk Culture',
            morning: 'Visit ancient Jagdish Temple and walk through Old City spice & silver alleys.',
            afternoon: 'Traditional blue pottery & miniature painting workshop.',
            evening: 'Dharohar folk dance & puppet performance at Bagore Ki Haveli.',
          },
          {
            day: 'Day 3: Monsoon Palace Panorama',
            morning: 'Sightseeing cab ascent to Sajjangarh Monsoon Palace overlooking the Aravalli hills.',
            afternoon: 'Lakeside lunch at Saheliyon-ki-Bari marble fountains.',
            evening: 'Leisurely evening stroll along Fateh Sagar lake promenade.',
          },
        ].slice(0, tripDays));
      } else {
        // Generic smart fallback
        setGeneratedItinerary([
          {
            day: `Day 1: Arrival & Historic Center in ${targetCity}`,
            morning: 'Check in with SmartStay digital door code; unburden baggage with arrival concierge.',
            afternoon: 'Guided walking tour of the cultural landmark district.',
            evening: 'Authentic local cuisine tasting at a verified neighborhood eatery.',
          },
          {
            day: `Day 2: Art, Markets & Panoramic Views`,
            morning: 'Morning sightseeing cab to prime scenic viewpoint.',
            afternoon: 'Visit local artisan market and museum.',
            evening: 'Sunset drinks followed by live local musical performance.',
          },
          {
            day: `Day 3: Nature Excursion & Leisure`,
            morning: 'Private outstation day excursion to nearby botanical lake or mountain trail.',
            afternoon: 'Picnic lunch with local regional specialties.',
            evening: 'Farewell fine dining experience.',
          },
        ].slice(0, tripDays));
      }
      setIsGenerating(false);
    }, 700);
  };

  const phrasesByLanguage: Record<string, { english: string; foreign: string; pronunciation: string }[]> = {
    Hindi: [
      { english: 'Hello / Greetings', foreign: 'नमस्ते (Namaste)', pronunciation: 'Nah-mas-tay' },
      { english: 'Where is this hotel/villa?', foreign: 'यह विला कहाँ है? (Yeh villa kahan hai?)', pronunciation: 'Yeh vil-la ka-haan hai' },
      { english: 'Please turn on the AC', foreign: 'कृपया एसी चालू करें (Kripya AC chalu karein)', pronunciation: 'Krip-ya AC cha-lu ka-rein' },
      { english: 'How much does this cost?', foreign: 'यह कितने का है? (Yeh kitne ka hai?)', pronunciation: 'Yeh kit-nay ka hai' },
      { english: 'I need medical help / doctor', foreign: 'मुझे डॉक्टर की ज़रूरत है (Mujhe doctor ki zaroorat hai)', pronunciation: 'Mooj-hay doctor ki za-roo-rat hai' },
      { english: 'Thank you very much', foreign: 'बहुत बहुत धन्यवाद (Bahut bahut dhanyavaad)', pronunciation: 'Ba-hut ba-hut dhan-ya-vaad' },
    ],
    French: [
      { english: 'Hello, how are you?', foreign: 'Bonjour, comment allez-vous?', pronunciation: 'Bohn-zhoor, koh-mahn tah-lay voo' },
      { english: 'Where is my driver?', foreign: 'Où est mon chauffeur?', pronunciation: 'Oo ay mohn shoh-fuhr' },
      { english: 'The bill, please', foreign: 'L\'addition, s\'il vous plaît', pronunciation: 'Lah-dee-syohn seel voo play' },
      { english: 'I have a reservation', foreign: 'J\'ai une réservation', pronunciation: 'Zhay oon ray-zair-vah-syohn' },
      { english: 'Emergency / Call the police', foreign: 'Urgence / Appelez la police', pronunciation: 'Oor-zhahns, ah-play lah poh-lees' },
    ],
    Spanish: [
      { english: 'Hello / Good morning', foreign: 'Hola, buenos días', pronunciation: 'Oh-lah, bway-nohs dee-ahs' },
      { english: 'Where is the luggage area?', foreign: '¿Dónde está la zona de equipaje?', pronunciation: 'Dohn-day ess-tah lah zoh-nah day ay-kee-pah-hay' },
      { english: 'Can you call a cab?', foreign: '¿Puede llamar a un taxi?', pronunciation: 'Pway-day yah-mahr ah oon tahk-see' },
      { english: 'Thank you for your help', foreign: 'Muchas gracias por su ayuda', pronunciation: 'Moo-chahs grah-see-ahs pohr soo ah-yoo-dah' },
    ],
    Japanese: [
      { english: 'Hello', foreign: 'こんにちは (Konnichiwa)', pronunciation: 'Kohn-nee-chee-wah' },
      { english: 'Where is the station/stay?', foreign: '駅／宿はどこですか？ (Eki/Yado wa doko desu ka?)', pronunciation: 'Eh-kee wa doh-koh dess kah' },
      { english: 'Thank you very much', foreign: 'ありがとうございます (Arigatou gozaimasu)', pronunciation: 'Ah-ree-gah-toh goh-zye-mass' },
      { english: 'Please help me', foreign: '助けてください (Tasukete kudasai)', pronunciation: 'Tah-soo-kay-tay koo-dah-sye' },
    ],
  };

  const handleCopyPhrase = (text: string, index: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-neutral-900">SmartStay AI Travel Copilot</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Client Engine v1.0
                </span>
              </div>
              <p className="text-xs text-neutral-400">Automated trip planning, live translation & stay advice</p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-neutral-100 p-1 my-4">
          <button
            type="button"
            onClick={() => setActiveTab('itinerary')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'itinerary' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Itinerary Generator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('translate')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'translate' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Travel Phrasebook</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 space-y-5 pr-1">
          
          {activeTab === 'itinerary' ? (
            <div className="space-y-4">
              
              {/* Generator Form */}
              <form onSubmit={handleGenerate} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">Destination</label>
                    <select
                      value={targetCity}
                      onChange={(e) => setTargetCity(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
                    >
                      <option value="Goa">Goa, India</option>
                      <option value="Udaipur">Udaipur, India</option>
                      <option value="Manali">Manali, India</option>
                      <option value="Kerala">Kerala Backwaters, India</option>
                      <option value="Jaipur">Jaipur, India</option>
                      <option value="Paris">Paris, France</option>
                      <option value="Bali">Ubud, Bali</option>
                      <option value="Santorini">Santorini, Greece</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">Duration</label>
                    <select
                      value={tripDays}
                      onChange={(e) => setTripDays(Number(e.target.value))}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
                    >
                      <option value={1}>1 Day Express</option>
                      <option value={2}>2 Days Weekend</option>
                      <option value={3}>3 Days Full Experience</option>
                      <option value={5}>5 Days Extended Retreat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">Travel Style</label>
                    <select
                      value={tripVibe}
                      onChange={(e) => setTripVibe(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
                    >
                      <option value="Relaxation & Beach">Relaxation & Beach</option>
                      <option value="Culture & Palaces">Culture & Palaces</option>
                      <option value="Adventure & Mountains">Adventure & Hiking</option>
                      <option value="Food & Nightlife">Food & Heritage</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Personalized Itinerary...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                      <span>Generate {tripDays}-Day AI Schedule for {targetCity}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Generated Itinerary Display */}
              {generatedItinerary && (
                <div className="space-y-3.5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-700 px-1">
                    <span>Generated Schedule ({targetCity} · {tripDays} Days)</span>
                    <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      SmartStay Verified Plan
                    </span>
                  </div>

                  {generatedItinerary.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                      <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        {item.day}
                      </h4>

                      <div className="space-y-1.5 text-xs text-neutral-600 pl-7">
                        <div>
                          <strong className="text-neutral-800">Morning: </strong>
                          {item.morning}
                        </div>
                        <div>
                          <strong className="text-neutral-800">Afternoon: </strong>
                          {item.afternoon}
                        </div>
                        <div>
                          <strong className="text-neutral-800">Evening: </strong>
                          {item.evening}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            /* Language Phrasebook */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-700">Language:</span>
                <div className="flex gap-1.5">
                  {(['Hindi', 'French', 'Spanish', 'Japanese'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setTargetLanguage(lang)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        targetLanguage === lang
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                {phrasesByLanguage[targetLanguage].map((phrase, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-neutral-200/80 hover:border-neutral-300 flex items-center justify-between gap-3 bg-white">
                    <div>
                      <p className="text-xs font-semibold text-neutral-500">{phrase.english}</p>
                      <p className="text-sm font-bold text-neutral-900 mt-0.5">{phrase.foreign}</p>
                      <p className="text-[11px] text-purple-700 font-mono mt-0.5">🗣 {phrase.pronunciation}</p>
                    </div>

                    <button
                      onClick={() => handleCopyPhrase(phrase.foreign, idx)}
                      className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-500 transition-colors cursor-pointer shrink-0"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Prototype boundary notice */}
        <div className="pt-3 border-t border-neutral-100 text-[10px] text-neutral-400 text-center">
          Prototype boundary: Rule-based client AI copilot. Does not transmit personal credentials to external LLMs.
        </div>

      </div>
    </div>
  );
};
