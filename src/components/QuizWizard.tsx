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
  { key: 'hair_goals', title: 'Jaki jest glowny problem Twoich wlosow?', subtitle: 'Mozesz wybrac kilka opcji', multi: true },
  { key: 'hair_type', title: 'Jaki typ wlosow masz?', subtitle: 'Mozesz wybrac kilka opcji', multi: true },
  { key: 'scalp_type', title: 'Jak opisalbys/opisalabys swoja skore glowy?', subtitle: 'Wybierz jedna opcje', multi: false },
  { key: 'avoid_ingredients', title: 'Jakie skladniki chcesz unikac?', subtitle: 'Mozesz wybrac kilka lub pominac', multi: true },
  { key: 'prefers_vegan', title: 'Preferencje dodatkowe', subtitle: '', multi: false },
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
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(HAIR_GOAL_LABELS) as [HairGoal, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleMulti('hair_goals', key)}
                className={`p-3 rounded-xl text-sm font-medium text-left transition-all ${
                  state.hair_goals.includes(key)
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(HAIR_TYPE_LABELS) as [HairType, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleMulti('hair_type', key)}
                className={`p-3 rounded-xl text-sm font-medium text-left transition-all ${
                  state.hair_type.includes(key)
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                className={`w-full p-3 rounded-xl text-sm font-medium text-left transition-all ${
                  state.scalp_type === key
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(FREE_FROM_LABELS) as [FreeFrom, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleMulti('avoid_ingredients', key)}
                className={`p-3 rounded-xl text-sm font-medium text-left transition-all ${
                  state.avoid_ingredients.includes(key)
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={state.prefers_vegan}
                onChange={() => setState({ ...state, prefers_vegan: !state.prefers_vegan })}
                className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <div>
                <p className="font-medium text-gray-900">Chce produkty weganskie</p>
                <p className="text-sm text-gray-500">Pokaz tylko produkty oznaczone jako weganskie i cruelty-free</p>
              </div>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-teal-600 uppercase tracking-wider">Krok {step + 1} z {STEPS.length}</span>
          <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-1">{STEPS[step].title}</h2>
      {STEPS[step].subtitle && (
        <p className="text-sm text-gray-500 mb-6">{STEPS[step].subtitle}</p>
      )}

      <div className="mb-8">
        {renderStep()}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Wstecz
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="px-6 py-2.5 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step === STEPS.length - 1 ? 'Zobacz wyniki' : 'Dalej'}
        </button>
      </div>
    </div>
  );
}
