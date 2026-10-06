import HabitCard from './HabitCard'
export default function HabitList({ habits, isDone, ...handlers }) {
  return <ul className="space-y-2">{habits.map((h) => <HabitCard key={h.id} habit={h} done={isDone(h)} {...handlers} />)}</ul>
}
