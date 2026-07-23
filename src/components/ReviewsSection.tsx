import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Plus, PlusCircle, Calendar, User, Heart, ThumbsUp } from 'lucide-react';
import { REVIEWS, MENU_ITEMS } from '../data';
import { Review } from '../types';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  
  // Review form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedDish, setSelectedDish] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [formSuccess, setFormSuccess] = useState(false);

  // Load reviews from server API or fallback to localStorage on mount
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
          localStorage.setItem('baraa_reviews', JSON.stringify(data));
        } else {
          throw new Error('API response not ok');
        }
      } catch (e) {
        console.warn('Failed to load reviews from backend API, falling back to localStorage', e);
        try {
          const stored = localStorage.getItem('baraa_reviews');
          if (stored) {
            setReviews(JSON.parse(stored));
          } else {
            setReviews(REVIEWS);
            localStorage.setItem('baraa_reviews', JSON.stringify(REVIEWS));
          }
        } catch (localErr) {
          console.error('Failed to load local storage reviews', localErr);
          setReviews(REVIEWS);
        }
      }
    }
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) {
      alert('Fadlan buuxi magacaaga iyo faalladaada.');
      return;
    }

    const newReview: Review = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      rating,
      comment,
      dishName: selectedDish || undefined,
      date: 'Maanta',
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          rating,
          comment,
          dishName: selectedDish || undefined,
        }),
      });

      if (response.ok) {
        const savedReview = await response.json();
        const updated = [savedReview, ...reviews];
        setReviews(updated);
        localStorage.setItem('baraa_reviews', JSON.stringify(updated));
      } else {
        throw new Error('Server API failed');
      }
    } catch (apiErr) {
      console.warn('Could not post review to backend API, saving locally only', apiErr);
      const updated = [newReview, ...reviews];
      setReviews(updated);
      localStorage.setItem('baraa_reviews', JSON.stringify(updated));
    }

    // Reset Form
    setName('');
    setRating(5);
    setComment('');
    setSelectedDish('');
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowForm(false);
    }, 2000);
  };

  const handleLike = (id: string) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // Filter reviews
  const filteredReviews = reviews.filter((rev) => {
    return filterRating === 'all' || rev.rating === filterRating;
  });

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
      : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <section className="py-20 bg-slate-50 text-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-gold-600 font-sans font-bold text-xs tracking-[0.25em] uppercase block mb-3">
            WUXUU DADKU LEEYAHAY
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-4">
            Faallooyinka Macaamiisha
          </h2>
          <p className="text-gray-600 text-sm">
            Ku farax geli naftaada adigoo akhriyaya khibradaha dhabta ah ee macaamiisheena nala soo wadaageen, kana tanaasul shakiga si aad noo soo booqato.
          </p>
        </div>

        {/* Aggregate Stats Card & Quick Filters Control */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-12">
          
          {/* Stat Box Left */}
          <div className="lg:col-span-4 bg-white p-8 rounded-lg border border-gray-200 shadow-md flex flex-col justify-center items-center text-center">
            <span className="text-gray-400 text-xs font-sans font-bold tracking-widest uppercase">
              DARASADA GUUD
            </span>
            <span className="text-6xl font-heading font-extrabold text-primary-900 my-2">
              {averageRating}
            </span>
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(Number(averageRating))
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">Based on {totalReviews} community reviews</p>
            
            <button
              onClick={() => {
                setShowForm(!showForm);
                setFormSuccess(false);
              }}
              className="mt-6 bg-gold-500 hover:bg-gold-400 text-primary-950 px-6 py-3 rounded-sm text-xs font-sans font-bold tracking-widest hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              QOR FAALLO CUSUB
            </button>
          </div>

          {/* Progress distributions Right */}
          <div className="lg:col-span-8 bg-white p-8 rounded-lg border border-gray-200 shadow-md flex flex-col justify-center">
            <h4 className="text-sm font-heading font-bold text-primary-900 mb-4 uppercase tracking-wider">
              Dardargelinta Darajooyinka
            </h4>
            <div className="space-y-3">
              {ratingCounts.map((rc) => (
                <div key={rc.star} className="flex items-center gap-4 text-xs">
                  <button
                    onClick={() => setFilterRating(rc.star)}
                    className="flex items-center gap-1 font-bold text-gray-700 hover:text-gold-600 w-12 text-left cursor-pointer"
                  >
                    <span>{rc.star} xidig</span>
                  </button>
                  <div className="flex-grow h-2.5 bg-slate-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-gold-400 rounded transition-all duration-1000"
                      style={{ width: `${rc.percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-500 font-mono w-8 text-right">{rc.count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Toggle Form to Submit a Review */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg p-8 border-2 border-dashed border-gold-300 shadow-lg mb-12 overflow-hidden"
            >
              <div className="mb-6">
                <h3 className="text-lg font-heading font-bold text-primary-900">
                  La wadaag khibraddaada kuwa kale!
                </h3>
                <p className="text-xs text-gray-500">Macaamiil kastaa waa muhiim, faalladaaduna wax weyn ayey noo ka dhigan tahay.</p>
              </div>

              {formSuccess ? (
                <div className="bg-emerald-50 text-emerald-800 p-6 rounded text-center border border-emerald-200 text-sm font-bold flex flex-col items-center justify-center gap-2">
                  <ThumbsUp className="w-8 h-8 text-emerald-600 animate-bounce" />
                  <span>Faalladaada waa la keydiyay si guul leh! Waad ku mahadsantahay dhiirigelintaada.</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-sans font-bold text-gray-600 uppercase" htmlFor="rev-name">
                        Magacaaga *
                      </label>
                      <input
                        type="text"
                        id="rev-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tusaale: Nimco Warsame"
                        className="w-full bg-slate-50 text-slate-900 text-sm py-2.5 px-4 rounded border border-gray-200 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    {/* Star selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-sans font-bold text-gray-600 uppercase">
                        Darajada (Rating Stars) *
                      </label>
                      <div className="flex items-center gap-1.5 h-[40px]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Optionally select a dish */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-sans font-bold text-gray-600 uppercase" htmlFor="rev-dish">
                        Cuntada aad qiimaynayso (Ikhtiyaari)
                      </label>
                      <select
                        id="rev-dish"
                        value={selectedDish}
                        onChange={(e) => setSelectedDish(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 text-sm py-2.5 px-3 rounded border border-gray-200 focus:outline-none focus:border-gold-500 transition-colors"
                      >
                        <option value="">-- Dooro Cunto --</option>
                        {MENU_ITEMS.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-sans font-bold text-gray-600 uppercase" htmlFor="rev-comment">
                      Aragtidaada ama Faalladaada *
                    </label>
                    <textarea
                      id="rev-comment"
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Qor halkaan wixii khibrad ah oo aad ka heshay cuntada, adeegga, ama nadaafadda..."
                      className="w-full bg-slate-50 text-slate-900 text-sm py-3 px-4 rounded border border-gray-200 focus:outline-none focus:border-gold-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 rounded-sm border border-gray-200 text-xs font-sans font-semibold text-gray-500 hover:bg-slate-50 cursor-pointer"
                    >
                      Kansal
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-900 hover:bg-primary-950 text-gold-400 px-6 py-2.5 rounded-sm text-xs font-sans font-bold tracking-widest cursor-pointer"
                    >
                      GUDUBI FAALLADA
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter controls tab line */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-gray-500 font-sans font-bold tracking-wider uppercase shrink-0 mr-2">
            SHAANDHEE:
          </span>
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
              filterRating === 'all'
                ? 'bg-primary-900 text-gold-400'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Dhammaan
          </button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setFilterRating(stars)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                filterRating === stars
                  ? 'bg-primary-900 text-gold-400'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <span>{stars} Stars</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        {/* Reviews Cards List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((rev) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={rev.id}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col h-full"
              >
                {/* Review Header Card */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary-900 border border-gray-200">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-primary-900 text-sm leading-tight">
                      {rev.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-sans flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{rev.date}</span>
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment body */}
                <p className="text-gray-600 text-xs leading-relaxed flex-grow italic mb-4">
                  "{rev.comment}"
                </p>

                {/* Optional Dish reference indicator */}
                {rev.dishName && (
                  <div className="bg-slate-50 border-l-2 border-gold-400 p-2 text-[11px] mb-4">
                    <span className="text-gray-500 font-sans uppercase font-bold text-[9px] block">
                      Dishes Reviewed:
                    </span>
                    <strong className="text-primary-900">{rev.dishName}</strong>
                  </div>
                )}

                {/* Interaction Footer */}
                <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-gray-400 font-sans uppercase">
                    Baraa Customer
                  </span>
                  <button
                    onClick={() => handleLike(rev.id)}
                    className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gold-600 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{likes[rev.id] || 0}</span>
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-md border border-gray-200 mt-6">
            <p className="text-gray-500 text-sm">Ma jiraan faallooyin leh darajadan weli.</p>
          </div>
        )}

      </div>
    </section>
  );
}
