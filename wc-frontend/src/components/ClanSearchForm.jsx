import React, { useState } from 'react';
import { useWar } from '../context/WarContext';
import { navigate } from '../router/Router';

export function ClanSearchForm() {
  const { setClanTag, addRecentClan } = useWar();
  const [tag, setTag] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Format tag by prepending # and making uppercase
    let formattedTag = tag.trim().toUpperCase();
    if (!formattedTag.startsWith('#')) {
      formattedTag = '#' + formattedTag;
    }

    // Update global state and persist
    setClanTag(formattedTag);
    addRecentClan(formattedTag, `Clan ${formattedTag}`);
    
    // Navigate using History API SPA router
    const urlTag = formattedTag.replace('#', '');
    navigate(`/war/${urlTag}`);
  };

  // Custom onInvalid message generator
  const handleInvalidTag = (event) => {
    const input = event.target;
    if (input.validity.valueMissing) {
      input.setCustomValidity('Please enter a Clan Tag to lookup.');
    } else if (input.validity.patternMismatch) {
      input.setCustomValidity('Invalid Clan Tag format. Tags start with # followed by letters/numbers (A-Z, 0-9).');
    } else {
      input.setCustomValidity('');
    }
  };

  const handleInputTag = (event) => {
    event.target.setCustomValidity('');
    setTag(event.target.value);
  };

  return (
    <div className="search-form-container bg-[#1a1d28] border border-white/5 p-6 md:p-8 rounded-xl max-w-xl mx-auto shadow-2xl transition-all duration-300">
      <h2 className="font-headings font-extrabold text-2xl text-amber-500 text-center mb-6 tracking-wide uppercase">
        CLASH WAR PLANNER
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-body text-slate-300">
        {/* Clan Tag Input Field */}
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="clan-tag-input" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Enter Clan Tag <span className="text-red-500">*</span>
          </label>
          <input
            id="clan-tag-input"
            type="text"
            required
            autoFocus
            pattern="^#?[0289PYLQGRJCUV]+$"
            placeholder="e.g. #2GJPRRV8P"
            value={tag}
            onInput={handleInputTag}
            onInvalid={handleInvalidTag}
            className="w-full text-slate-100 placeholder-slate-600 bg-[#252836] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-lg uppercase font-semibold"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn-primary w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-[#0f1117] font-headings font-extrabold text-base py-3 rounded-lg mt-2 tracking-wide uppercase shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          Find Active War
        </button>
      </form>
    </div>
  );
}

export default ClanSearchForm;
