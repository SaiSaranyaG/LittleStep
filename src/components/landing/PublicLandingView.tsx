import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Heart,
  Sun,
  Droplet,
  Compass,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  Coffee,
  BookOpen,
  Users,
  Smile,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Lifestyle photographic assets
import heroHomeImg from '../../assets/images/hero_home_plant_1788194363237.jpg';
import storyCornerImg from '../../assets/images/story_empty_corner_1788194380921.jpg';
import storyWateringImg from '../../assets/images/story_watering_care_1788194398175.jpg';
import storyNookImg from '../../assets/images/story_growing_nook_1788194416149.jpg';
import storyBalconyImg from '../../assets/images/story_balcony_oasis_1788194436360.jpg';
import storyLeafImg from '../../assets/images/story_leaf_healing_1788194454215.jpg';

interface StoryScene {
  id: number;
  timeLabel: string;
  actionText: string;
  subText: string;
  tag: string;
}

interface RealLifeStory {
  id: string;
  title: string;
  headline: string;
  durationSec: number;
  image: string;
  quote: string;
  personRole: string;
  homeSpace: string;
  scenes: StoryScene[];
}

const STORIES: RealLifeStory[] = [
  {
    id: 'start-corner',
    title: 'Start with a Corner',
    headline: 'Start with one little corner.',
    durationSec: 15,
    image: storyCornerImg,
    quote: '"I had an empty corner beside my bedroom window that felt cold. I took one photo, found the right match, and now it feels like home."',
    personRole: 'Aarav, Apartment Resident',
    homeSpace: 'Bedroom Window Nook',
    scenes: [
      {
        id: 1,
        timeLabel: '00:00 - 00:03',
        actionText: 'Looking at an empty corner',
        subText: 'A quiet, unlived corner with soft morning sunlight streaming in.',
        tag: 'Ordinary Room',
      },
      {
        id: 2,
        timeLabel: '00:03 - 00:06',
        actionText: 'Wondering what could grow here',
        subText: 'Thinking about bringing a touch of nature into the daily routine.',
        tag: 'Curiosity',
      },
      {
        id: 3,
        timeLabel: '00:06 - 00:09',
        actionText: 'A quick photo with LittleStep',
        subText: 'LittleStep gently suggests a low-maintenance Snake Plant for this light level.',
        tag: 'Gentle Guide',
      },
      {
        id: 4,
        timeLabel: '00:09 - 00:12',
        actionText: 'Bringing the plant home',
        subText: 'Setting the terracotta pot in the sunlight on a simple wooden stool.',
        tag: 'Small Action',
      },
      {
        id: 5,
        timeLabel: '00:12 - 00:15',
        actionText: 'The corner feels alive',
        subText: 'What used to be an empty spot is now a calm, green focal point.',
        tag: 'Greener Home',
      },
    ],
  },
  {
    id: 'keep-growing',
    title: 'Keep it Growing',
    headline: 'A little care goes a long way.',
    durationSec: 14,
    image: storyWateringImg,
    quote: '"Checking the soil before my morning coffee has become the most peaceful two minutes of my day."',
    personRole: 'Meera, Young Professional',
    homeSpace: 'Kitchen Windowsill',
    scenes: [
      {
        id: 1,
        timeLabel: '00:00 - 00:03',
        actionText: 'Morning sunlight & soil check',
        subText: 'Touching the soil to feel if hydration is needed.',
        tag: 'Mindful Morning',
      },
      {
        id: 2,
        timeLabel: '00:03 - 00:06',
        actionText: 'A gentle reminder',
        subText: 'LittleStep notes that today is the right day for a gentle soak.',
        tag: 'Simple Helper',
      },
      {
        id: 3,
        timeLabel: '00:06 - 00:10',
        actionText: 'Watering with care',
        subText: 'Pouring fresh water slowly, watching the soil soak in the nourishment.',
        tag: 'Daily Habit',
      },
      {
        id: 4,
        timeLabel: '00:10 - 00:14',
        actionText: 'Days later: healthy new growth',
        subText: 'A fresh, vibrant leaf unfurls gracefully toward the sun.',
        tag: 'Natural Growth',
      },
    ],
  },
  {
    id: 'one-becomes-two',
    title: 'One Becomes Two',
    headline: 'One little step can become a habit.',
    durationSec: 16,
    image: storyNookImg,
    quote: '"I used to think I had a black thumb. When my first pothos lived for two months, I proudly brought home a monstera."',
    personRole: 'Rohan, Design Student',
    homeSpace: 'Study & Reading Desk',
    scenes: [
      {
        id: 1,
        timeLabel: 'Day 01',
        actionText: 'Starting with a single plant',
        subText: 'One modest pothos companion sitting quietly by the desk.',
        tag: 'Day 1',
      },
      {
        id: 2,
        timeLabel: 'Day 15',
        actionText: 'The daily rhythm feels natural',
        subText: 'Caring for it is no longer a chore—it is a calm pause in a busy day.',
        tag: 'Day 15',
      },
      {
        id: 3,
        timeLabel: 'Day 30',
        actionText: 'Ready for another companion',
        subText: 'Adding a second complementary plant to share the sunlight.',
        tag: 'Day 30',
      },
      {
        id: 4,
        timeLabel: 'Day 60',
        actionText: 'A flourishing green nook',
        subText: 'A vibrant, breathing micro-sanctuary that refreshes the whole room.',
        tag: 'Day 60',
      },
    ],
  },
  {
    id: 'green-space',
    title: 'Your Little Green Space',
    headline: 'Make your space a little greener.',
    durationSec: 15,
    image: storyBalconyImg,
    quote: '"Our small apartment balcony used to just hold laundry. Now it is our favorite spot for morning chai."',
    personRole: 'Kavita & Suresh, Family Home',
    homeSpace: 'Apartment Balcony',
    scenes: [
      {
        id: 1,
        timeLabel: '00:00 - 00:04',
        actionText: 'An ordinary compact balcony',
        subText: 'A bare outdoor railing overlooking the neighborhood.',
        tag: 'Blank Canvas',
      },
      {
        id: 2,
        timeLabel: '00:04 - 00:08',
        actionText: 'Placing the first two pots',
        subText: 'Hardy herbs and leafy companions that thrive in afternoon breeze.',
        tag: 'First Step',
      },
      {
        id: 3,
        timeLabel: '00:08 - 00:12',
        actionText: 'Watching the greenery spread',
        subText: 'Leaves catching the golden hour light, cooling the ambient air.',
        tag: 'Thriving Space',
      },
      {
        id: 4,
        timeLabel: '00:12 - 00:15',
        actionText: 'Enjoying a quiet cup of tea',
        subText: 'Sitting surrounded by nature without leaving home.',
        tag: 'Calm Sanctuary',
      },
    ],
  },
  {
    id: 'plant-help',
    title: 'When it Needs Help',
    headline: 'When your plant needs a little help.',
    durationSec: 14,
    image: storyLeafImg,
    quote: '"When yellow spots appeared, I didn’t panic or throw it away. I got a simple watering adjustment tip, and within two weeks it recovered."',
    personRole: 'Priya, First-Time Plant Parent',
    homeSpace: 'Living Room Shelf',
    scenes: [
      {
        id: 1,
        timeLabel: '00:00 - 00:03',
        actionText: 'Noticing slightly drooping leaves',
        subText: 'A favorite companion looks tired after a hot, dry week.',
        tag: 'Early Signal',
      },
      {
        id: 2,
        timeLabel: '00:03 - 00:07',
        actionText: 'Snapping a photo with LittleStep',
        subText: 'LittleStep suggests: "Looks like slight under-watering. Try a gentle bottom soak."',
        tag: 'Care Suggestion',
      },
      {
        id: 3,
        timeLabel: '00:07 - 00:10',
        actionText: 'Following the simple adjustment',
        subText: 'Adjusting sunlight distance slightly and hydrating the roots.',
        tag: 'Easy Fix',
      },
      {
        id: 4,
        timeLabel: '00:10 - 00:14',
        actionText: 'Leaves bounce back healthy',
        subText: 'The plant stands tall again, glossy, resilient, and green.',
        tag: 'Full Recovery',
      },
    ],
  },
];

const RELATABLE_SPACES = [
  {
    name: 'Bedroom Window',
    hint: 'Gentle filtered morning sun',
    tip: 'Perfect for peace lilies & pothos that purify room air.',
  },
  {
    name: 'Living Room Corner',
    hint: 'Medium indirect light',
    tip: 'One snake plant or ZZ plant brings warmth without needing daily fuss.',
  },
  {
    name: 'Kitchen Windowsill',
    hint: 'Bright morning light & humidity',
    tip: 'Fresh basil or mint for everyday cooking and crisp green aroma.',
  },
  {
    name: 'Small Balcony',
    hint: 'Direct sunlight & fresh air',
    tip: 'Two sturdy pots turn a bare railing into a breezy tea oasis.',
  },
  {
    name: 'Study Desk',
    hint: 'Soft ambient room lighting',
    tip: 'A small succulent beside your laptop provides an eye-resting pause.',
  },
  {
    name: 'Apartment Veranda',
    hint: 'Filtered afternoon warmth',
    tip: 'A hanging basket adds vertical depth to compact entryways.',
  },
];

export const PublicLandingView: React.FC = () => {
  const { openAuthModal } = useAuth();

  // Active Story Player State
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentStory = STORIES[activeStoryIndex];
  const totalScenes = currentStory.scenes.length;

  // Auto-play timer through scenes
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveSceneIndex((prev) => {
        if (prev + 1 < totalScenes) {
          return prev + 1;
        } else {
          // Loop to next story or start of current
          return 0;
        }
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isPlaying, totalScenes, activeStoryIndex]);

  const handleSelectStory = (idx: number) => {
    setActiveStoryIndex(idx);
    setActiveSceneIndex(0);
    setIsPlaying(true);
  };

  const handleNextStory = () => {
    setActiveStoryIndex((prev) => (prev + 1) % STORIES.length);
    setActiveSceneIndex(0);
  };

  const handlePrevStory = () => {
    setActiveStoryIndex((prev) => (prev - 1 + STORIES.length) % STORIES.length);
    setActiveSceneIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#243324] font-sans selection:bg-[#5B8C51]/20">
      {/* 1. HERO SECTION — RELATABLE HOME & HUMAN-CENTERED INTRODUCTION */}
      <section className="relative pt-6 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Logo & Gentle Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/5 border border-emerald-900/10 text-emerald-900 text-xs font-semibold">
            <Sprout className="w-4 h-4 text-[#5B8C51]" />
            <span>LittleStep for Everyday Homes</span>
          </div>

          {/* Simple Emotional Headline */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1E2B1E] leading-[1.08]"
            style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
          >
            Small steps.<br />
            A greener home.
          </h1>

          {/* Short Supporting Sentence */}
          <p className="text-base sm:text-xl text-[#3A4A3A] max-w-xl mx-auto leading-relaxed font-normal">
            Start with one plant, care for it, and watch your little step grow into something bigger.
          </p>

          {/* Primary & Secondary Call to Action */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-create-littlestep-btn"
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto py-4 px-8 rounded-full bg-[#3D6636] hover:bg-[#32542c] text-white font-bold text-base shadow-lg shadow-[#3D6636]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 group"
            >
              <Sprout className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>🌱 Create Your LittleStep</span>
            </button>

            <button
              id="hero-sign-in-subtle-btn"
              onClick={() => openAuthModal('login')}
              className="py-2.5 px-5 text-sm font-semibold text-[#3A4A3A] hover:text-[#1E2B1E] transition-colors cursor-pointer"
            >
              Already growing with us? <span className="underline font-bold">Sign in</span>
            </button>
          </div>
        </div>

        {/* Hero Visual — Realistic Everyday Home & Person */}
        <div className="mt-10 sm:mt-14 relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/10 border border-[#1E2B1E]/10 bg-white">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[520px] w-full overflow-hidden">
            <img
              src={heroHomeImg}
              alt="A person gently placing a green potted plant by a bright sunlit window at home"
              className="w-full h-full object-cover object-center"
            />
            {/* Gentle Warm Sunlight Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

            {/* In-Image Atmospheric Story Pill */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 right-4 sm:right-auto max-w-md bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/40 shadow-lg text-[#1E2B1E]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5B8C51] uppercase tracking-wider mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Everyday Habit</span>
              </div>
              <p className="text-xs sm:text-sm text-[#243324] font-medium leading-relaxed">
                "It started with just one small pot on the windowsill. Now watering it every Tuesday is my calmest moment of the week."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE VIDEO / REAL-LIFE STORIES SECTION */}
      <section className="py-12 sm:py-20 bg-[#F2EDE4] border-y border-[#1E2B1E]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2
              className="text-3xl sm:text-5xl font-bold text-[#1E2B1E]"
              style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
            >
              See LittleStep in real life
            </h2>
            <p className="text-sm sm:text-base text-[#3A4A3A] mt-2">
              No complicated routines. Just small human actions, healthy plants, and simple daily habits.
            </p>
          </div>

          {/* Story Selector Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {STORIES.map((story, idx) => {
              const isSelected = idx === activeStoryIndex;
              return (
                <button
                  key={story.id}
                  onClick={() => handleSelectStory(idx)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#1E2B1E] text-white shadow-md scale-[1.02]'
                      : 'bg-white/80 text-[#3A4A3A] hover:bg-white border border-[#1E2B1E]/10'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-[#5B8C51] animate-pulse' : 'bg-stone-300'
                    }`}
                  />
                  <span>{story.title}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Story Player Card */}
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#1E2B1E]/10 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Cinematic Real-Life Visual & Progress Reel */}
            <div className="lg:col-span-7 relative bg-stone-900 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto min-h-[340px] sm:min-h-[420px] overflow-hidden flex flex-col justify-between">
              <img
                key={currentStory.id}
                src={currentStory.image}
                alt={currentStory.headline}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

              {/* Top Scene Progress Bars */}
              <div className="relative z-10 p-4 sm:p-6 flex items-center gap-2">
                {currentStory.scenes.map((scene, sIdx) => {
                  const isPast = sIdx < activeSceneIndex;
                  const isCurrent = sIdx === activeSceneIndex;
                  return (
                    <div
                      key={scene.id}
                      onClick={() => setActiveSceneIndex(sIdx)}
                      className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer backdrop-blur-xs"
                    >
                      <div
                        className={`h-full bg-[#5B8C51] transition-all duration-300 ${
                          isPast ? 'w-full' : isCurrent ? 'w-full animate-pulse' : 'w-0'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Bottom In-Reel Scene Action */}
              <div className="relative z-10 p-4 sm:p-6 text-white space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#5B8C51] text-white text-[11px] font-bold uppercase tracking-wider">
                  <span>{currentStory.scenes[activeSceneIndex].tag}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold leading-tight">
                  {currentStory.scenes[activeSceneIndex].actionText}
                </h4>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                  {currentStory.scenes[activeSceneIndex].subText}
                </p>
              </div>
            </div>

            {/* Right: Story Narrative, Formula & Controls */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#FCFAF7] space-y-6">
              <div className="space-y-4">
                {/* Space & Person Meta */}
                <div className="flex items-center justify-between text-xs text-[#3A4A3A] font-semibold border-b border-[#1E2B1E]/10 pb-3">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#5B8C51]" />
                    <span>{currentStory.homeSpace}</span>
                  </div>
                  <span>{currentStory.personRole}</span>
                </div>

                {/* Main Headline */}
                <h3
                  className="text-2xl sm:text-3xl font-bold text-[#1E2B1E]"
                  style={{ fontFamily: "'Gaegu', cursive" }}
                >
                  {currentStory.headline}
                </h3>

                {/* Quote */}
                <p className="text-xs sm:text-sm italic text-[#3A4A3A] leading-relaxed bg-white p-4 rounded-2xl border border-[#1E2B1E]/10">
                  {currentStory.quote}
                </p>

                {/* Step-by-Step Story Formula List */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B8C51] block">
                    The Habit Journey
                  </span>
                  {currentStory.scenes.map((scene, sIdx) => {
                    const isCurrent = sIdx === activeSceneIndex;
                    return (
                      <div
                        key={scene.id}
                        onClick={() => setActiveSceneIndex(sIdx)}
                        className={`p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                          isCurrent
                            ? 'bg-[#1E2B1E] text-white font-medium shadow-xs'
                            : 'bg-white/60 hover:bg-white text-[#3A4A3A] border border-[#1E2B1E]/5'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isCurrent
                              ? 'bg-[#5B8C51] text-white'
                              : 'bg-stone-200 text-[#3A4A3A]'
                          }`}
                        >
                          {sIdx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-bold leading-tight">{scene.actionText}</p>
                          <p className={`text-[11px] mt-0.5 ${isCurrent ? 'text-white/80' : 'text-[#3A4A3A]/70'}`}>
                            {scene.subText}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Player Controls & Action Button */}
              <div className="pt-4 border-t border-[#1E2B1E]/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 border border-[#1E2B1E]/15 flex items-center justify-center text-[#1E2B1E] transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause Story' : 'Play Story'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    onClick={handlePrevStory}
                    className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 border border-[#1E2B1E]/15 flex items-center justify-center text-[#1E2B1E] transition-colors cursor-pointer"
                    title="Previous Story"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNextStory}
                    className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 border border-[#1E2B1E]/15 flex items-center justify-center text-[#1E2B1E] transition-colors cursor-pointer"
                    title="Next Story"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => openAuthModal('register')}
                  className="py-2.5 px-5 rounded-full bg-[#5B8C51] hover:bg-[#4d7844] text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Start This Step</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RELATABLE SPACES — ANY CORNER CAN GROW */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5B8C51] block mb-1">
            Everyday Living
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#1E2B1E]"
            style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
          >
            Start with any space you have
          </h2>
          <p className="text-xs sm:text-sm text-[#3A4A3A] mt-2">
            You do not need a greenhouse or garden. A single window sill or desk is all it takes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {RELATABLE_SPACES.map((space, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#1E2B1E]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-base text-[#1E2B1E]">{space.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                    Easy Step
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#5B8C51] mb-2">{space.hint}</p>
                <p className="text-xs text-[#3A4A3A] leading-relaxed">{space.tip}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E2B1E]/5 flex items-center justify-between">
                <span className="text-[11px] text-[#3A4A3A]/70">1 Companion Match</span>
                <button
                  onClick={() => openAuthModal('register')}
                  className="text-xs font-bold text-[#1E2B1E] hover:text-[#5B8C51] flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE EMOTIONAL PROGRESSION OF A LITTLESTEP */}
      <section className="py-14 sm:py-20 bg-[#1E2B1E] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#86B87C] block mb-1">
              Natural Rhythm
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white"
              style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
            >
              How a LittleStep becomes a habit
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-2">
              From an empty corner to a thriving daily routine.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 text-center">
            {[
              { step: '01', title: 'Empty', desc: 'An unused corner' },
              { step: '02', title: 'Curious', desc: 'Wondering what fits' },
              { step: '03', title: 'One Plant', desc: 'A modest start' },
              { step: '04', title: 'Care', desc: '2 minutes a week' },
              { step: '05', title: 'Growth', desc: 'A new green leaf' },
              { step: '06', title: 'Habit', desc: 'Second nature' },
              { step: '07', title: 'Greener', desc: 'A living sanctuary' },
            ].map((st, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col justify-between"
              >
                <span
                  className="text-lg font-bold text-[#86B87C] block mb-1"
                  style={{ fontFamily: "'Gaegu', cursive" }}
                >
                  {st.step}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">{st.title}</h4>
                  <p className="text-[11px] text-emerald-200/70 mt-0.5">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINAL INVITATION / CALL TO ACTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-[#5B8C51]/15 text-[#5B8C51] flex items-center justify-center mx-auto">
          <Sprout className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2
            className="text-3xl sm:text-5xl font-bold text-[#1E2B1E]"
            style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
          >
            Your home doesn't need a big change.
          </h2>
          <p
            className="text-2xl sm:text-3xl font-bold text-[#5B8C51]"
            style={{ fontFamily: "'Gaegu', cursive, sans-serif" }}
          >
            Just one LittleStep.
          </p>
        </div>

        <p className="text-sm sm:text-base text-[#3A4A3A] max-w-md mx-auto leading-relaxed">
          Join thousands of everyday caretakers turning small corners into living, breathing sanctuaries.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="footer-create-littlestep-btn"
            onClick={() => openAuthModal('register')}
            className="w-full sm:w-auto py-4 px-9 rounded-full bg-[#3D6636] hover:bg-[#32542c] text-white font-bold text-base shadow-lg shadow-[#3D6636]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5"
          >
            <Sprout className="w-5 h-5" />
            <span>🌱 Create Your LittleStep</span>
          </button>

          <button
            id="footer-sign-in-subtle-btn"
            onClick={() => openAuthModal('login')}
            className="py-2.5 px-5 text-sm font-semibold text-[#3A4A3A] hover:text-[#1E2B1E] transition-colors cursor-pointer"
          >
            Already growing with us? <span className="underline font-bold">Sign in</span>
          </button>
        </div>
      </section>
    </div>
  );
};
