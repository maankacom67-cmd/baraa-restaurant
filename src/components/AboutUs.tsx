import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, Milestone, ShieldCheck, HeartHandshake, Sparkles, Star } from 'lucide-react';
import { CHEFS } from '../data';

export default function AboutUs() {
  const milestones = [
    {
      year: '2020',
      title: 'Aasaaskii Riyada',
      description: 'Baraa Restaurant waxaa la furay sanadkii 2020 iyadoo la hiigsanayo in la badalo muuqaalka cuntada ee Muqdisho.',
    },
    {
      year: '2022',
      title: 'Abaal-marinta Sanadka',
      description: 'Waxaan ku guuleysanay abaalmarinta Maqaayadda Ugu Adeegga Fiican Muqdisho sababo la xiriira nadaafaddayada sare.',
    },
    {
      year: '2024',
      title: 'Ballaarinta Jikada',
      description: 'Waxaan soo kordhinay kuugag caalami ah iyo qaybo cusub oo loogu talagalay macmacaanka casriga ah iyo qaxwaha asalka ah.',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-gold-600 font-sans font-bold text-xs tracking-[0.25em] uppercase block">
              SHEEKADAYADA
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 leading-tight">
              Keenista Cunnada Heerka Caalami ee Magaalada Muqdisho
            </h2>
            <div className="w-16 h-1 bg-gold-400 rounded-full" />
            
            <p className="text-gray-600 text-sm leading-relaxed">
              Baraa Restaurant ma aha oo kaliya goob wax laga cuno, ee waa hoy loogu talagalay in lagu dabaaldego farshaxanka cunnada iyo kulanka dadka jecel tayada sare.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Waxaan u taagannahay inaan macaamiisheena u soo bandhigno dhadhan ka kooban daryeel, nadaafad buuxda, iyo hal-abuur ka baxsan xuduudaha caadiga ah, annagoo adeegsanayna waxyaabaha ugu fiican ee laga helo dalkayaga gudihiisa.
            </p>

            <div className="flex gap-4 p-4 rounded bg-amber-50 border-l-4 border-gold-500 italic text-sm text-amber-900 font-medium">
              "Waxaan aaminsanahay in saxan kastaa uu leeyahay sheeko u gaar ah iyo dhadhan aan la ilaawi karin."
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-xl relative group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq8_tbQUapR9fKtUWN1TZcwNaE7wClbipZ2hMQpJ27gr3Jy4DyNDyTRoG9pC6ecUmjGIHYsEHVJ6YT76r8XA3am8MRbAPQJW8snBUYgTtFunzwfLXqEm8_H797MkWb8VweVB3iuSZixpiqLXNKZPg1BDFHVKm4c38HXNITTrUCEjTJ6crzOxdhoZV8v62rzMnLW-oG6qdteAQRuBfdbtMj-j-Itr7MsndVi7F4LULE3p-HL1HlJO2inxtAWEao1T6Ys-A"
                alt="Baraa Dining Presentation"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary-950/15" />
            </div>
          </div>
        </div>

        {/* Timeline Timeline Milestones */}
        <div className="bg-white rounded-lg p-8 md:p-12 border border-gray-200 shadow-md mb-24">
          <div className="text-center max-w-md mx-auto mb-12">
            <h3 className="text-2xl font-heading font-bold text-primary-900 mb-2">Taariikhdeena</h3>
            <p className="text-xs text-gray-500 tracking-wider font-sans uppercase">
              safarkayagii bilowga iyo meeshaan maanta joogno
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((stone, idx) => (
              <div
                key={stone.year}
                className={`p-6 rounded border relative overflow-hidden transition-all hover:shadow-lg ${
                  idx === 1
                    ? 'bg-primary-900 border-primary-900 text-white shadow-xl shadow-primary-900/10'
                    : 'bg-slate-50 border-gray-200'
                }`}
              >
                <span
                  className={`text-5xl font-display font-bold block mb-4 ${
                    idx === 1 ? 'text-gold-400' : 'text-gray-300'
                  }`}
                >
                  {stone.year}
                </span>
                <h4 className={`text-base font-heading font-bold mb-2 ${idx === 1 ? 'text-white' : 'text-primary-900'}`}>
                  {stone.title}
                </h4>
                <p className={`text-xs leading-relaxed ${idx === 1 ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stone.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Master Chefs Section */}
        <div className="mb-24">
          <div className="text-center max-w-md mx-auto mb-16">
            <span className="text-gold-600 font-sans font-bold text-xs tracking-[0.25em] uppercase block mb-3">
              KABIIRADA CUNNADA
            </span>
            <h3 className="text-3xl font-display font-bold text-primary-900">
              Kooxdayada Farshaxanka Leh
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Kuugyadeena aqoonta iyo khibradda leh waxay si daryeel leh u diyaariyaan cunto kasta oo aad dalbato.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {CHEFS.map((chef) => (
              <div
                key={chef.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all hover:shadow-xl flex flex-col md:flex-row h-full"
              >
                {/* Chef Photo */}
                <div className="md:w-2/5 min-h-[250px] relative bg-slate-100">
                  <img
                    src={chef.imageUrl}
                    alt={chef.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary-950/10" />
                </div>

                {/* Chef Info */}
                <div className="p-8 md:w-3/5 flex flex-col justify-center">
                  <span className="text-[10px] font-sans font-bold text-gold-600 uppercase tracking-widest block mb-1">
                    {chef.title}
                  </span>
                  <h4 className="text-xl font-heading font-bold text-primary-900 mb-3">
                    {chef.name}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4">
                    {chef.bio}
                  </p>
                  
                  {/* Chef signature info */}
                  <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-gold-500 shrink-0" />
                    <span className="text-[10px] text-gray-500 font-sans uppercase">
                      Signature: <strong className="text-primary-900">{chef.signatureDish}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values Section */}
        <div className="bg-primary-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden">
          {/* Subtle logo background icon */}
          <div className="absolute top-1/2 -right-12 -translate-y-1/2 opacity-5 pointer-events-none text-white">
            <ChefHat className="w-96 h-96" />
          </div>

          <div className="text-center max-w-md mx-auto mb-12 relative z-10">
            <span className="text-gold-400 font-sans font-bold text-xs tracking-widest uppercase block mb-2">
              DHAQANKEENA SHAQO
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-bold">Qiimayaasha Aan Rumaysanahay</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Value 1 */}
            <div className="bg-white/5 p-6 rounded border border-white/10 space-y-4">
              <div className="w-10 h-10 bg-gold-400 text-primary-900 rounded flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-heading font-bold text-gold-300">Nadiif iyo Caafimaad</h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                Nadaafaddu waa ujeedada koowaad ee jikadayada. Maaddooyinka aan isticmaalno waa kuwo gebi ahaanba caafimaad qaba oo cusub maalin kasta.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white/5 p-6 rounded border border-white/10 space-y-4">
              <div className="w-10 h-10 bg-gold-400 text-primary-900 rounded flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-base font-heading font-bold text-gold-300">Adeeg Marti Sharaf Leh</h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                Ku soo dhawaynta iyo daryeelka macaamiishu waa waajib diini iyo dhaqameed ah oo aan u gudbino si farxad iyo naxariis leh.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white/5 p-6 rounded border border-white/10 space-y-4">
              <div className="w-10 h-10 bg-gold-400 text-primary-900 rounded flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-heading font-bold text-gold-300">Hal-Abuur iyo Dhadhan</h4>
              <p className="text-gray-300 text-xs leading-relaxed">
                Jikooyinkeena kuma koobna cunto diyaarinta caadiga ah ee waxaan had iyo jeer tijaabinaa is-dhaafsiga dhadhamo cusub si aan kuu farxinno.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
