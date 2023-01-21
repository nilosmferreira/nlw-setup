import { FastifyInstance } from 'fastify';
import daysjs from 'dayjs';
import { prisma } from './lib/prisma';
import { z } from 'zod';
import dayjs from 'dayjs';

export async function appRoutes(app: FastifyInstance) {
  app.post('/habits', async (req) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });

    const { title, weekDays } = createHabitBody.parse(req.body);

    const today = daysjs().startOf('day').toDate();

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => {
            return {
              week_day: weekDay,
            };
          }),
        },
      },
    });
  });
  app.get('/day', async (req) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });

    const { date } = getDayParams.parse(req.query);

    const parsedDate = daysjs(date).startOf('day');
    const weekDay = parsedDate.get('day');

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });
    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      },
    });
    const completedHabit = day?.dayHabits.map((dayHabit) => {
      return dayHabit.habit_id;
    });
    return {
      possibleHabits,
      completedHabit,
    };
  });
  app.patch('/habits/:id/toggle', async (req) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    });

    const today = dayjs().startOf('day').toDate();

    const { id } = toggleHabitParams.parse(req.params);
    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    });

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        },
      });
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          habit_id: id,
          day_id: day.id,
        },
      },
    });

    if (dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        },
      });
    } else {
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        },
      });
    }
  });
  app.get('/summary', async () => {
    const summary = await prisma.$queryRaw`
  SELECT 
    D.id, 
    D.date,
    (
      SELECT 
        cast(count(*) as float)
      FROM day_habits DH
      WHERE DH.day_id = D.id
    ) as completed,
    (
      SELECT
        cast(count(*) as float)
      FROM habit_week_days HDW
      JOIN habits H
        ON H.id = HDW.habit_id
      WHERE
        HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
        AND H.created_at <= D.date
    ) as amount
  FROM days D`;
    return summary;
  });
}
