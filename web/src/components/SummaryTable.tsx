import { generateDatesFromYearBegining } from '../util/generate-dates-from-year-begining';
import { HabitDay } from './HabitDay';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const summaryDates = generateDatesFromYearBegining();
const minimumSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;
export function SummaryTable() {
  return (
    <div className='w-full flex'>
      <div className='grid grid-row-7 grid-flow-row gap-3'>
        {weekDays.map((weekDay, index) => (
          <div
            key={`${weekDay}${index}`}
            className='text-zinc-400 text-xl w-10 h-10 font-bold flex items-center justify-center'
          >
            {weekDay}
          </div>
        ))}
      </div>
      <div className='grid grid-rows-7 grid-flow-col gap-3'>
        {summaryDates.map((date) => (
          <HabitDay key={date.toISOString()} />
        ))}
        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, index) => (
            <div
              key={index}
              className='w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed'
            />
          ))}
      </div>
    </div>
  );
}