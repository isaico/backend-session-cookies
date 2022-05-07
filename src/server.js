import express from 'express';
import 'dotenv/config';
const app = express();
const PORT = 8080;

// import CookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { auth } from './midlewares/auth.js';

//por alguna razon no me funciono el dotenv

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
/* -------------------------------------------------------------------------- */
/*                                   SESSION                                  */
/* -------------------------------------------------------------------------- */
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://isaico:isaias159@cluster0.ai4r7.mongodb.net/sessions',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: 'asdasd',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
  })
);
/* -------------------------------------------------------------------------- */
/*                                     EJS                                    */
/* -------------------------------------------------------------------------- */

app.set('view engine', 'ejs');
app.set('views', path.resolve('src/views'));
/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

app.get('/', (req, res) => {
  // res.sendFile(path.resolve('public/input.html'))
  res.render('input');
});
app.post('/login', (req, res) => {
  const user = req.body.user;
  console.log(user);
  if (user !== 'admin') {
    res.send('error al iniciar sesion');
  } else {
    req.session.user = user;
    req.session.admin = true;

    res.render('index', { user: user });
  }
});
app.get('/privada', auth, (req, res) => {
  res.send('informacion privada solo para usuarios logeados');
});
app.get('/contador', (req, res) => {
  if (req.session.contador) {
    req.session.contador++;
    res.send(`pagina visitada ${req.session.contador} veces`);
  } else {
    req.session.contador = 1;
    res.send('Bienvenido');
  }
});
app.get('/deslogeo', (req, res) => {
  req.session.destroy((err) => {
    if (!err) res.send(`Hasta Luego`);
    else res.send({ status: 'logout error', body: err });
  });
});

const server = app.listen(PORT, () => {
  console.log(` 🚀🔥server is runing at http://localhost:${PORT} 🚀🔥`);
});

server.on('error', (err) => {
  console.log(err);
});
