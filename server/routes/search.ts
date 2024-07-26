import { Request, Response, Router } from 'express';

// Имитация данных для поиска
const data = [
  { email: 'jim@gmail.com', number: '221122' },
  { email: 'jam@gmail.com', number: '830347' },
  { email: 'john@gmail.com', number: '221122' },
  { email: 'jams@gmail.com', number: '349425' },
  { email: 'jams@gmail.com', number: '141424' },
  { email: 'jill@gmail.com', number: '822287' },
  { email: 'jill@gmail.com', number: '822286' }
];

let currentTimeout: NodeJS.Timeout | null = null;

const router = Router();

router.post('/search', (req: Request, res: Response) => {
  const { email, number } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Дополнительная валидация, чтобы убедиться, что данные корректны, даже если запрос послан некорректно.
  if (number && !/^\d{2}-\d{2}-\d{2}$/.test(number)) {
    return res.status(400).json({ message: 'Number format is invalid' });
  }

  const numberWithoutDashes = number ? number.replace(/-/g, '') : '';

  if (currentTimeout) {
    clearTimeout(currentTimeout);
  }

  currentTimeout = setTimeout(() => {
    const results = data.filter(entry => {
      return entry.email.includes(email) &&
        (!number || entry.number === numberWithoutDashes);
    });
    res.json(results);
  }, 5000);
});

export default router;
