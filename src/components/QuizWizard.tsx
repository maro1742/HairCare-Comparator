import { useState } from 'react';
import type { HairGoal, HairType, ScalpType, FreeFrom, UserProfile } from '../types';
import { HAIR_GOAL_LABELS, HAIR_TYPE_LABELS, SCALP_TYPE_LABELS, FREE_FROM_LABELS } from '../lib/constants';

interface QuizWizardProps {
  onComplete: (profile: UserProfile) => void;
}

interface QuizState {
  hair_goals: HairGoal[];
  hair_type: HairType[];
  scalp_type: ScalpType | null;
  avoid_ingredients: FreeFrom[];
  prefers_vegan: boolean;
}

const STEPS = [
  { key: 'hair_goals', title: 'Z czym Twoje włosy mają największy problem?', subtitle: 'Wybierz śmiało kilka opcji', multi: true },
  { key: 'hair_type', title: 'Jakie masz włosy na co dzień?', subtitle: 'Zaznacz to, co najbardziej do Ciebie pasuje', multi: true },
  { key: 'scalp_type', title: 'Jak zachowuje się Twoja skóra głowy?', subtitle: 'Wybierz jedną, główną cechę', multi: false },
  { key: 'avoid_ingredients', title: 'Czego wolałabyś/wolałbyś unikać w składzie?', subtitle: 'Zaznacz tylko jeśli masz konkretne preferencje (możesz pominąć)', multi: true },
  { key: 'prefers_vegan', title: 'Czy szukasz produktów z kategorii wegańskich?', subtitle: '', multi: false },
] as const;

export default function QuizWizard({ onComplete }: QuizWizardProps) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<QuizState>({
    hair_goals: [],
    hair_type: [],
    scalp_type: null,
    avoid_ingredients: [],
    prefers_vegan: false,
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 0: return state.hair_goals.length > 0;
      case 1: return state.hair_type.length > 0;
      case 2: return state.scalp_type !== null;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({
        hair_goals: state.hair_goals,
        hair_type: state.hair_type,
        scalp_type: state.scalp_type || 'normal',
        avoid_ingredients: state.avoid_ingredients,
        prefers_vegan: state.prefers_vegan,
      });
    }
  };

  const toggleMulti = <T extends string>(key: 'hair_goals' | 'hair_type' | 'avoid_ingredients', value: T) => {
    const current = state[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setState({ ...state, [key]: updated });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.entries(HAIR_GOAL_LABELS) as [HairGoal, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleMulti('hair_goals', key)}
                className={`p-4 rounded-2xl text-sm font-medium text-left transition-all border ${state.hair_goals.includes(key)
                  ? 'bg-primary text-white border-primary shadow-lg transform scale-[1.02]'
                  : 'bg-white text-primary/80 border-primary/5 hover:bg-background hover:border-primary/20'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.entries(HAIR_TYPE_LABELS) as [HairType, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleMulti('hair_type', key)}
                className={`p-4 rounded-2xl text-sm font-medium text-left transition-all border ${state.hair_type.includes(key)
                  ? 'bg-primary text-white border-primary shadow-lg transform scale-[1.02]'
                  : 'bg-white text-primary/80 border-primary/5 hover:bg-background hover:border-primary/20'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            {(Object.entries(SCALP_TYPE_LABELS) as [ScalpType, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setState({ ...state, scalp_type: key })}
                className={`w-full p-4 rounded-2xl text-sm font-medium text-left transition-all border ${state.scalp_type === key
                  ? 'bg-primary text-white border-primary shadow-lg transform scale-[1.02]'
                  : 'bg-white text-primary/80 border-primary/5 hover:bg-background hover:border-primary/20'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.entries(FREE_FROM_LABELS) as [FreeFrom, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleMulti('avoid_ingredients', key)}
                className={`p-4 rounded-2xl text-sm font-medium text-left transition-all border ${state.avoid_ingredients.includes(key)
                  ? 'bg-primary text-white border-primary shadow-lg transform scale-[1.02]'
                  : 'bg-white text-primary/80 border-primary/5 hover:bg-background hover:border-primary/20'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        );
      case 4:
        return (
          <div>
            <label className="flex items-center gap-4 p-5 bg-white border border-primary/5 rounded-2xl cursor-pointer hover:bg-background hover:border-primary/20 transition-all shadow-sm">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${state.prefers_vegan ? 'border-primary bg-primary' : 'border-primary/20'}`}>
                {state.prefers_vegan && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input
                type="checkbox"
                checked={state.prefers_vegan}
                onChange={() => setState({ ...state, prefers_vegan: !state.prefers_vegan })}
                className="hidden"
              />
              <div>
                <p className="font-semibold text-primary">Chcę produkty wegańskie</p>
                <p className="text-sm text-primary/60 mt-0.5">Pokaż tylko produkty oznaczone jako wegańskie i cruelty-free</p>
              </div>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold text-primary/60 uppercase tracking-widest">Krok {step + 1} z {STEPS.length}</span>
          <span className="text-xs font-medium text-primary/40">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2 tracking-tight">{STEPS[step].title}</h2>
        {STEPS[step].subtitle && (
          <p className="text-primary/60">{STEPS[step].subtitle}</p>
        )}
      </div>

      <div className="mb-10 min-h-[300px]">
        {renderStep()}
      </div>

      <div className="flex items-center justify-between border-t border-primary/5 pt-6">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-6 py-3 text-sm font-medium text-primary/60 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          Wstecz
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all custom-shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform active:scale-95"
        >
          {step === STEPS.length - 1 ? 'Zobacz wyniki' : 'Dalej'}
        </button>
      </div>
    </div>
  );
}
