const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const db = require('./db/db.json')
const fs = require('fs')

// Static middleware pointing to the public folder
app.use(express.static('public'));
app.use(express.json());

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
);

const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    const parsedData = JSON.parse(data);
    console.log(err , parsedData)
    if (err) {
      console.error(err);
    } else {
      res.json(parsedData)
    }
  });
})

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a tip`);

  const { title, text } = req.body;
  let id =  Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);
console.log(id)
  if (req.body) {
    const newTip = {
      title,
      text,
      id,
    };

    readAndAppend(newTip, './db/db.json');
    res.json(`Tip added successfully 🚀`);
  } else {
    res.error('Error in adding tip');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      console.log(err , parsedData)
      let filteredNotes = parsedData.filter(note => note.id !== req.params.id); 
      writeToFile('./db/db.json', filteredNotes);
      res.json(filteredNotes)
    }
  });
})

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);