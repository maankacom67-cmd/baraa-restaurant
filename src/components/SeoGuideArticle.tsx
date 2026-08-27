import React, { useState } from 'react';
import { 
  CheckCircle2, ChevronDown, ChevronUp, MapPin, Phone, 
  ShoppingBag, Sparkles, Utensils, Star, HelpCircle, ArrowRight,
  ShieldCheck, HeartHandshake, Clock, ChefHat
} from 'lucide-react';

interface SeoGuideArticleProps {
  onGoToMenu: () => void;
  onGoToBook: () => void;
}

export default function SeoGuideArticle({ onGoToMenu, onGoToBook }: SeoGuideArticleProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Baraa Restaurant maqaayad online ah ma tahay?",
      a: "Haa. Baraa Restaurant waxay leedahay website online ah oo macaamiishu kaga daalacan karaan menu-ga iyo cuntooyinka kala duwan, isla markaana uga gudbi karaan habka dalabka."
    },
    {
      q: "Halkee ayay ku taallaa Baraa Restaurant?",
      a: "Baraa Restaurant waxay ku taallaa Muqdisho, Soomaaliya, iyadoo website-ka lagu xusay Waddada Maka Al-Mukarama."
    },
    {
      q: "Maxaa laga heli karaa menu-ga Baraa Restaurant?",
      a: "Menu-ga waxaa ka mid ah bariis iyo hilib ari, sambuus, shawaarmo, baasto iyo suugo, sabaayad iyo hilib, pizza, miro iyo khudaar, coffee, tiramisu iyo ice cream."
    },
    {
      q: "Baraa Restaurant ma leedahay dalab online ah?",
      a: "Website-ka Baraa Restaurant waxaa loogu talagalay in macaamiishu online uga daalacan karaan menu-ga oo ay uga bilaabi karaan dalabkooda."
    },
    {
      q: "Ma heli karaa pizza Baraa Restaurant?",
      a: "Haa. Menu-ga Baraa Restaurant waxaa ku jira Pizza Deluxe, oo ah pizza leh waxyaabo kala duwan oo lagu daray."
    },
    {
      q: "Ma heli karaa coffee iyo macmacaan?",
      a: "Haa. Waxaa ka mid ah Coffee Latte Art, Tiramisu Special iyo Macmacaanka Baraa (Ice Cream)."
    },
    {
      q: "Sideen ula xiriiri karaa Baraa Restaurant?",
      a: "Waxaad Baraa Restaurant kala xiriiri kartaa xogta xiriirka ku qoran website-ka rasmiga ah, oo ay ku jiraan telefoon (+252 771909054) iyo email (maankacom66@gmail.com)."
    }
  ];

  const highlights = [
    "Cunto cusub oo si wanaagsan loo diyaariyey",
    "Menu kala duwan",
    "Qiimayaal la fahmi karo",
    "Dalab online ah oo fudud",
    "Adeeg macaamiil oo wanaagsan",
    "Nadaafad iyo tayo",
    "Cunto ku habboon qoysaska, saaxiibbada iyo dadka shaqada ku jira"
  ];

  const foodHighlights = [
    {
      title: "Bariis iyo Hilib Ari",
      desc: "Bariis basmati ah oo lala socodsiiyo hilib ari iyo waxyaabo kale oo cuntada dhadhankeeda kor u qaada. Haddii aad jeceshahay cunto dhaqameed iyo hilib si fiican loo diyaariyey, waa mid ka mid ah xulashooyinka ugu wanaagsan.",
      tag: "Dhaqameed",
      imgAlt: "Bariis iyo hilib ari Baraa Restaurant"
    },
    {
      title: "Sambuus",
      desc: "Sambuus crispy ah oo ku habboon quraac fudud, qadada dhinaceeda ama waqti kasta oo aad rabto snack.",
      tag: "Snack & Crispy",
      imgAlt: "Sambuus Baraa Restaurant"
    },
    {
      title: "Shawaarmo",
      desc: "Shawaarmo lagu diyaariyey hilib iyo waxyaabo kale oo la socda. Waa doorasho ku habboon qofka doonaya cunto fudud oo dhadhan fiican leh.",
      tag: "Fast Food",
      imgAlt: "Shawaarmo Baraa Restaurant"
    },
    {
      title: "Baasto iyo Suugo",
      desc: "Baasto iyo suugo leh dhadhan wanaagsan oo si gaar ah loogu talagalay dadka jecel baastada asalka ah.",
      tag: "Italian-Somali",
      imgAlt: "Baasto iyo suugo Baraa Restaurant"
    },
    {
      title: "Sabaayad iyo Hilib",
      desc: "Waxay isku daraysaa sabaayad iyo hilib si wanaagsan loo diyaariyey oo leh nafaqo iyo dhereg buuxda.",
      tag: "Dhaqameed",
      imgAlt: "Sabaayad iyo hilib Baraa Restaurant"
    },
    {
      title: "Pizza Deluxe (Pitsa Cusub)",
      desc: "Pizza-da waxaa lagu diyaariyaa waxyaabo kala duwan sida mozzarella, basbaas, boqoshaada iyo waxyaabo kale oo lagu daro.",
      tag: "Hot & Fresh",
      imgAlt: "Pizza Deluxe Baraa Restaurant"
    },
    {
      title: "Qudaar Diyaar ah",
      desc: "Isku-dar miro iyo khudaar kala duwan oo dabiici ah, una wanaagsan caafimaadka iyo tamarta maalinlaha ah.",
      tag: "Caafimaad",
      imgAlt: "Qudaar diyaar ah Baraa Restaurant"
    },
    {
      title: "Casirro iyo Cabitaanno",
      desc: "Cabitaanno iyo macmacaan dabiici ah sida Casirka Cambaha (Mango) oo aad u qabow iyo miro cusub.",
      tag: "Dabiici",
      imgAlt: "Casiirka cambaha Baraa Restaurant"
    },
    {
      title: "Coffee Latte Art",
      desc: "Coffee loo diyaariyey qaab casri ah oo leh farshaxan qurux badan iyo espresso tayo sare leh.",
      tag: "Coffee",
      imgAlt: "Coffee Latte Art Baraa Restaurant"
    },
    {
      title: "Tiramisu iyo Ice Cream",
      desc: "Macmacaan heer sare ah sida Tiramisu Special ama Macmacaanka Baraa (Ice Cream) oo aad u qabow.",
      tag: "Dessert",
      imgAlt: "Tiramisu iyo ice cream Baraa Restaurant"
    }
  ];

  const steps = [
    "Booqo website-ka Baraa Restaurant.",
    "Gal qaybta Menyada.",
    "Ka raadi cuntada aad rabto.",
    "Akhri faahfaahinta iyo qiimaha.",
    "Dooro cuntada aad rabto.",
    "Raac habka dalabka online-ka.",
    "Haddii aad u baahan tahay caawimaad, la xiriir Baraa Restaurant."
  ];

  const searchKeywords = [
    "Maqaayad Muqdisho",
    "Maqaayad online ah Muqdisho",
    "Restaurant Muqdisho",
    "Cunto Muqdisho",
    "Maqaayad cunto fiican",
    "Dalbo cunto Muqdisho",
    "Restaurant online ah",
    "Baraa Restaurant menu Muqdisho"
  ];

  return (
    <section id="hiddaha-iyo-faahfaahinta" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main Article Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-gold-50 text-gold-700 px-3.5 py-1.5 rounded-full text-xs font-sans font-bold tracking-wider uppercase border border-gold-200">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>BARAA RESTAURANT MUQDISHU</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary-900 leading-tight">
            Baraa Restaurant – Maqaayad Online ah oo Cunto Macaan iyo Adeeg Tayo Leh ku Taalla Muqdisho
          </h2>
          
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Baraa Restaurant maqaayad online ah waa meel casri ah oo loogu talagalay dadka Muqdisho iyo nawaaxigeeda doonaya inay si fudud uga helaan cunto macaan, tayo leh iyo adeeg ku habboon baahidooda. Baraa Restaurant waxay isku keentaa cuntooyin kala duwan, adeeg casri ah iyo hab fudud oo aad ku dalban karto cuntada aad jeceshahay.
          </p>
          
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Haddii aad raadinayso maqaayad online ah oo Muqdisho ku taalla, Baraa Restaurant waxay kuu diyaarisay menu kala duwan oo ay ku jiraan cuntooyin Soomaaliyeed, cuntooyin fudud, pizza, cabitaanno, macmacaan iyo cuntooyin kale oo aad ka heli karto hal meel.
          </p>
        </div>

        {/* Section 1: Why Choose Baraa Restaurant */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-10 border border-slate-200/80 mb-16">
          <div className="max-w-3xl mb-8">
            <span className="text-gold-600 text-xs font-sans font-bold tracking-widest uppercase block mb-2">
              DOORASHADA KOOWAAD
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-primary-900">
              Baraa Restaurant maqaayad online ah – Maxaa naga dhigaya doorasho fiican?
            </h3>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Baraa Restaurant waxaa loo sameeyay in qofka macaamilka ah uu helo khibrad cunto oo fudud, degdeg ah oo tayo leh. Website-ka Baraa Restaurant waxaad ka daalacan kartaa menu-ga, waxaad ka arki kartaa cuntooyinka kala duwan, qiimahooda iyo faahfaahinta cuntada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {highlights.map((point, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 flex items-start gap-3 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-sans font-medium text-slate-800 leading-snug">{point}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-xs sm:text-sm mt-6 leading-relaxed bg-amber-50/70 p-4 rounded-xl border border-amber-200/50 text-amber-900 font-sans">
            💡 <strong>Baraa Restaurant</strong> waxay rabtaa in dalbashada cuntadu aysan noqon wax adag. Halkii aad waqti badan ku bixin lahayd raadinta cunto, waxaad si fudud u eegi kartaa menu-ga oo aad dooran kartaa cuntada aad rabto.
          </p>
        </div>

        {/* Section 2: Cuntada Baraa Restaurant Menu Details */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-gold-600 text-xs font-sans font-bold tracking-widest uppercase block mb-2">
              CUNTOOYINKA MENU-GA
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-primary-900">
              Cuntada Baraa Restaurant
            </h3>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              Menu-ga Baraa Restaurant wuxuu leeyahay cuntooyin kala duwan oo loogu talagalay dhadhanno kala duwan. Waxaad ka heli kartaa cuntooyin qado iyo casho ah, cunto fudud, cabitaanno, pizza iyo macmacaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {foodHighlights.map((item, index) => (
              <div 
                key={index}
                className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gold-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-heading font-bold text-base sm:text-lg text-primary-900">{item.title}</h4>
                    <span className="text-[10px] font-sans font-semibold bg-gold-100/70 text-gold-800 px-2 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-500 font-sans">
                  <span>Baraa Restaurant Muqdisho</span>
                  <button 
                    onClick={onGoToMenu} 
                    className="text-gold-600 font-bold hover:text-gold-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    Dalbo <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: How to Order Step-by-Step & Location Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Order Steps */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
            <span className="text-gold-400 text-xs font-sans font-bold tracking-widest uppercase block mb-2">
              TALLAABOOYINKA DALABKA
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold mb-4">
              Sidee looga dalban karaa Baraa Restaurant online?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Baraa Restaurant waxay xoogga saartaa in macaamilku si fudud u helo cuntada uu rabo.
            </p>

            <ol className="space-y-3">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-gray-200">
                  <span className="w-6 h-6 rounded-full bg-gold-400 text-primary-950 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4">
              <button
                onClick={onGoToMenu}
                className="bg-gold-500 hover:bg-gold-400 text-primary-950 px-6 py-2.5 rounded-md text-xs font-sans font-bold tracking-wider cursor-pointer transition-all"
              >
                FUR MENYADA ONLINE-KA
              </button>
              <button
                onClick={onGoToBook}
                className="bg-transparent hover:bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-md text-xs font-sans font-bold tracking-wider cursor-pointer transition-all"
              >
                BALLANSO MIISKAAGA
              </button>
            </div>
          </div>

          {/* Location & SEO Keywords */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-gold-500" />
                <h4 className="font-heading font-bold text-lg text-primary-900">Baraa Restaurant Muqdisho</h4>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-4">
                Baraa Restaurant waxay ku taallaa <strong>Muqdisho, Soomaaliya</strong>, waxaana website-ka lagu xusay cinwaanka <strong>Waddada Maka Al-Mukarama, Muqdisho</strong>.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <p className="text-slate-700">📍 <strong>Ciwaanka:</strong> Maka Al-Mukarama, Mogadishu</p>
                <p className="text-slate-700">📞 <strong>Telefoon:</strong> +252 771909054</p>
                <p className="text-slate-700">✉️ <strong>Email:</strong> maankacom66@gmail.com</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="font-heading font-bold text-sm text-primary-900 mb-3">
                Raadinta Google ee Muqdisho:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {searchKeywords.map((kw, idx) => (
                  <span key={idx} className="bg-white text-[11px] font-sans text-gray-700 px-2.5 py-1 rounded-md border border-gray-200">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Section 4: 4 Core Reasons */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-gold-600 text-xs font-sans font-bold tracking-widest uppercase block mb-2">
              FAA'IIDOOYINKA
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-primary-900">
              Maxaad uga dalbanaysaa Baraa Restaurant?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center mb-3">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-primary-900 mb-1.5">1. Menu kala duwan</h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                Uma baahnid inaad hal nooc oo cunto ah ku ekaato. Waxaa ku jira cuntooyin dhaqameed, fast food, pizza, coffee iyo macmacaan.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-primary-900 mb-1.5">2. Dalab fudud</h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                Website-ka Baraa Restaurant waxaa loogu talagalay in macaamilku si fudud uga daalacdo menu-ga oo uu u doorto cuntada uu rabo.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-primary-900 mb-1.5">3. Tayo iyo nadaafad</h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                Baraa Restaurant waxay xoogga saartaa nadaafadda, tayada iyo qanacsanaanta macaamiisha iyo diyaarinta cuntada.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gold-50 text-gold-600 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-base text-primary-900 mb-1.5">4. Waqtiyo kala duwan</h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                Haddii aad rabto qado, casho, cunto fudud ama macmacaan, waxaad ka heli kartaa xulashooyin kala duwan menu-ga.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Interactive FAQ Section (Rich SEO Snippets) */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-10">
            <span className="text-gold-600 text-xs font-sans font-bold tracking-widest uppercase block mb-2">
              SU'AALAHA IYO JAWAABAHA
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-primary-900">
              Su'aalaha Inta Badan La Isweydiiyo (FAQ)
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">
              Jawaabaha su'aalaha ugu muhiimsan ee ku saabsan Baraa Restaurant maqaayad online ah
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="font-heading font-bold text-sm sm:text-base text-primary-900">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gold-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-slate-50/50 font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 6: Final CTA */}
        <div className="bg-gradient-to-r from-primary-900 via-primary-950 to-primary-900 text-white rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-display font-bold">
              Baraa Restaurant – Dalbo Cuntadaada Maanta
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Haddii aad raadineyso maqaayad online ah oo Muqdisho ku taalla, Baraa Restaurant waxay kuu diyaarisay menu kala duwan iyo adeeg casri ah. Ka eeg menu-ga Baraa Restaurant, dooro cuntada aad jeceshahay, kadibna raac habka dalabka online-ka.
            </p>
            <p className="text-gold-400 text-xs font-sans font-bold tracking-widest uppercase pt-2">
              Baraa Restaurant – Cunto wanaagsan, adeeg wanaagsan, iyo khibrad aad ku qanacdo.
            </p>
            <div className="pt-4">
              <button
                onClick={onGoToMenu}
                className="bg-gold-400 hover:bg-gold-300 text-primary-950 font-sans font-bold text-xs tracking-widest px-8 py-3.5 rounded-md hover:shadow-xl transition-all cursor-pointer"
              >
                DALBO CUNTO ONLINE AH
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
