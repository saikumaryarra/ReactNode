const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(helmet());
app.use(express.json()); // For parsing application/json

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.get('/api/formFields', (req, res) => {
    fs.readFile('./formFields.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: 'Error reading form fields data' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Dummy endpoint for demonstration purposes
app.post('/api/submitForm', [
  body('email').isEmail(),
  body('name').not().isEmpty().trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Process the valid data
  res.status(200).json({ message: "Form submitted successfully", data: req.body });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}


module.exports = app;
