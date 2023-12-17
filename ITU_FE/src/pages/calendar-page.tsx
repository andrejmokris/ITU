/**
 * Author: Andrej Nespor xnespo10
 */

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday
} from 'date-fns';
import { useState } from 'react';
import { api_client } from '@/utils/api-client';
import { useQuery } from 'react-query';
import { Link, useSearchParams } from 'react-router-dom';

type CalendarItem = {
  event: {
    id: number;
    title: string;
    imageURL: string;
    startDate: string;
    place: {
      title: string;
    };
  };
} & {
  id: number;
  eventId: number;
  userId: number;
  createdAt: Date;
};

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

export function CalendarPage() {
  const today = startOfToday();

  const [searchParams, setSearchParams] = useSearchParams({ month: format(today, 'MMM-yyyy') });

  const monthSearch = searchParams.get('month');

  const [selectedDay, setSelectedDay] = useState(today);
  // @ts-expect-error fdf
  const firstDayCurrentMonth = parse(monthSearch, 'MMM-yyyy', new Date());

  const { data, isLoading } = useQuery({
    queryKey: 'getMyCalendarQuery',
    queryFn: async () => {
      const { data } = await api_client.get('events/calendar');
      return data as Array<CalendarItem>;
    }
  });

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth)
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setSearchParams((prev) => {
      prev.set('month', format(firstDayNextMonth, 'MMM-yyyy'));
      return prev;
    });
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setSearchParams((prev) => {
      prev.set('month', format(firstDayNextMonth, 'MMM-yyyy'));
      return prev;
    });
  }

  if (!data || isLoading) {
    return <p className="font-bold text-2xl">Loading...</p>;
  }

  const selectedDayMeetings = data.filter((meeting) => isSameDay(parseISO(meeting.event.startDate), selectedDay));

  return (
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900 dark:text-gray-400">
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500 dark:text-gray-400">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(dayIdx === 0 && colStartClasses[getDay(day)], 'py-1.5')}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={classNames(
                      isEqual(day, selectedDay) && 'text-white',
                      !isEqual(day, selectedDay) && isToday(day) && 'text-red-500',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-900 dark:text-gray-400',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-400 dark:text-gray-200',
                      isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                      isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900 dark:bg-gray-800',
                      !isEqual(day, selectedDay) && 'hover:bg-gray-200 dark:hover:bg-gray-600',
                      (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                  </button>

                  <div className="w-1 h-1 mx-auto mt-1">
                    {data.some((meeting) => isSameDay(parseISO(meeting.event.startDate), day)) && (
                      <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <section className="mt-12 md:mt-0 md:pl-14">
            <h2 className="font-semibold text-gray-900 dark:text-gray-400">
              Schedule for{' '}
              <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>{format(selectedDay, 'MMM dd, yyy')}</time>
            </h2>
            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
              {selectedDayMeetings.length > 0 ? (
                selectedDayMeetings.map((meeting) => <Meeting meeting={meeting} key={meeting.id} />)
              ) : (
                <p>No events for today.</p>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

function Meeting({ meeting }: { meeting: CalendarItem }) {
  const startDateTime = parseISO(meeting.event.startDate);

  return (
    <Link to={`/events/${meeting.eventId}`}>
      <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus-within:dark:bg-gray-700 pr-5">
        <img
          src={
            meeting.event.imageURL
              ? meeting.event.imageURL
              : 'https://sustainablefashionconsumption.org/wp-content/uploads/2022/02/Karpova.jpg'
          }
          alt=""
          className="flex-none w-10 h-10 rounded-full"
        />
        <div className="flex-auto w-full">
          <p className="text-gray-900 dark:text-gray-400 font-semibold">{meeting.event.title}</p>
          <p className="mt-0.5">
            <time dateTime={meeting.event.startDate}>{format(startDateTime, 'h:mm a')}</time>
          </p>
        </div>
      </li>
    </Link>
  );
}

const colStartClasses = ['', 'col-start-2', 'col-start-3', 'col-start-4', 'col-start-5', 'col-start-6', 'col-start-7'];
