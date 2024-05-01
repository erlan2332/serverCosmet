const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

let appointments = {
  '09-10': 'free',
  '10-11': 'free',
  '11-12': 'free',
  '12-13': 'free',
  '13-14': 'free',
  '14-15': 'free',
  '15-16': 'free',
  '16-17': 'free',
  '17-18': 'free'
};

// Функция для сброса расписания на следующий день
function resetSchedule() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextDay = tomorrow.toLocaleDateString('en-US', { weekday: 'long' });

  console.log(`Resetting schedule for ${nextDay}`);

  appointments = {
    '09-10': 'free',
    '10-11': 'free',
    '11-12': 'free',
    '12-13': 'free',
    '13-14': 'free',
    '14-15': 'free',
    '15-16': 'free',
    '16-17': 'free',
    '17-18': 'free'
  };
}

// Запускаем сброс расписания каждый день в полночь
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    resetSchedule();
  }
}, 1000 * 60); // Проверяем каждую минуту

app.get('/appointments', (req, res) => {
  res.json(appointments);
});

app.post('/appointments', (req, res) => {
  const { timeSlot } = req.body;
  if (!timeSlot || !appointments[timeSlot]) {
    res.status(400).send('Invalid time slot');
    return;
  }

  if (appointments[timeSlot] === 'busy') {
    res.status(409).send('Time slot is already booked');
    return;
  }

  appointments[timeSlot] = 'busy';
  res.status(200).send('Appointment scheduled successfully');
});

app.delete('/appointments/:timeSlot', (req, res) => {
  const { timeSlot } = req.params;
  if (!appointments[timeSlot]) {
    res.status(404).send('Time slot not found');
    return;
  }

  appointments[timeSlot] = 'free';
  res.status(200).send('Appointment canceled successfully');
});

// Эндпоинт для сброса расписания
app.post('/reset-schedule', (req, res) => {
  resetSchedule();
  res.status(200).send('Schedule reset successfully');
});

app.listen(port, () => {
  resetSchedule();
  console.log(`Server running on port ${port}`);
});
