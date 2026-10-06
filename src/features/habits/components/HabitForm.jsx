import { useForm } from 'react-hook-form'
import { COLORS, ICONS, MAX_NAME } from '../utils/options'
import { WEEKDAYS } from '../utils/schedule'

export default function HabitForm({ habit, onSubmit, onCancel }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: habit ? {
      name: habit.name, description: habit.description || '', icon: habit.icon, color: habit.color,
      freqType: habit.frequency.type === 'daily' ? 'daily' : 'weekly', days: habit.frequency.days || [1, 3, 5],
      goalValue: habit.goal?.value ?? '', goalUnit: habit.goal?.unit ?? '',
    } : { name: '', description: '', icon: ICONS[0], color: 'green', freqType: 'daily', days: [1, 3, 5], goalValue: '', goalUnit: '' },
  })
  const [icon, color, freqType, days] = watch(['icon', 'color', 'freqType', 'days'])
  const toggleDay = (d) => setValue('days', days.includes(d) ? days.filter((x) => x !== d) : [...days, d])

  const submit = (v) => onSubmit({
    name: v.name.trim(), description: v.description.trim(), icon: v.icon, color: v.color,
    frequency: v.freqType === 'daily' ? { type: 'daily' } : { type: 'weekly', days: [...v.days].sort() },
    goal: v.goalValue ? { value: Number(v.goalValue), unit: v.goalUnit.trim() } : undefined,
  })

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="hf-name" className="label">Name</label>
        <input id="hf-name" className="input" maxLength={MAX_NAME} aria-invalid={!!errors.name} {...register('name', { validate: (v) => v.trim().length > 0 || 'Give your habit a name.' })} />
        {errors.name && <p role="alert" className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="hf-desc" className="label">Description <span className="font-normal text-stone-500">(optional)</span></label>
        <input id="hf-desc" className="input" maxLength={120} {...register('description')} />
      </div>
      <fieldset>
        <legend className="label">Icon</legend>
        <div className="flex flex-wrap gap-1.5">
          {ICONS.map((i) => <button type="button" key={i} aria-pressed={icon === i} aria-label={`Icon ${i}`} onClick={() => setValue('icon', i)} className={`h-9 w-9 rounded-lg text-lg ${icon === i ? 'bg-moss-100 ring-2 ring-moss-600 dark:bg-night-700' : 'hover:bg-stone-100 dark:hover:bg-night-700'}`}>{i}</button>)}
        </div>
      </fieldset>
      <fieldset>
        <legend className="label">Color</legend>
        <div className="flex gap-2">
          {Object.entries(COLORS).map(([name, hex]) => <button type="button" key={name} aria-pressed={color === name} aria-label={name} onClick={() => setValue('color', name)} style={{ background: hex }} className={`h-7 w-7 rounded-full ${color === name ? 'ring-2 ring-offset-2 ring-ink dark:ring-stone-100 dark:ring-offset-night-800' : ''}`} />)}
        </div>
      </fieldset>
      <div>
        <label htmlFor="hf-freq" className="label">Frequency</label>
        <select id="hf-freq" className="input" {...register('freqType')}><option value="daily">Every day</option><option value="weekly">Specific weekdays</option></select>
        {freqType === 'weekly' && (
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Weekdays">
            {WEEKDAYS.map((w, d) => <button type="button" key={w} aria-pressed={days.includes(d)} onClick={() => toggleDay(d)} className={`rounded-lg border px-2.5 py-1 text-sm ${days.includes(d) ? 'border-moss-600 bg-moss-600 text-white' : 'border-stone-300 dark:border-night-700'}`}>{w}</button>)}
          </div>
        )}
        {freqType === 'weekly' && days.length === 0 && <p role="alert" className="mt-1 text-xs text-red-600">Pick at least one day.</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label htmlFor="hf-gv" className="label">Goal <span className="font-normal text-stone-500">(optional)</span></label><input id="hf-gv" type="number" min="1" className="input" {...register('goalValue')} /></div>
        <div><label htmlFor="hf-gu" className="label">Unit</label><input id="hf-gu" className="input" placeholder="minutes" maxLength={20} {...register('goalUnit')} /></div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={freqType === 'weekly' && days.length === 0}>{habit ? 'Save changes' : 'Create habit'}</button>
      </div>
    </form>
  )
}
