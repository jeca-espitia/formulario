var express = require('express');
var mongoose = require("mongoose");
var app = express();
app.use(express.urlencoded());

var schema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

var Formulario = mongoose.model("Formulario", schema);

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on("error", function (e) { console.error(e); });

function publicar(res) {
    Formulario.find(function (err, lista) {
        if (err) return console.error(err);
        console.log(lista);
        let result = "<table><thead><th>Name</th><th>Email</th></thead>"
        lista.forEach(lista => {
            result += "<tr><td>" + lista.name + "</td><td>" + lista.email + "</td></tr>";
        })
        result += '</table>';
        res.send('<p><a href="http://localhost:3000/register"> Registrarse </a></p>' + result);
    });
}

app.get('/', (req, res) => {
    publicar(res);
});

app.post('/register', (req, res) => {
        var parametros = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    Formulario.create(parametros, function (err) {
        if (err) return console.error(err);
        res.redirect('/')
    });
});


app.get('/register', (req, res) => {
    var formulario = '<form action="/register" method="post" style="width:100px">' +
        '<label for="nombre"> Nombre </label> <input type="text" id="nombre" name="name">' +
        '<label for="email"> Email </label><input type="email" id="email" name="email">' +
        '<label for="password"> Contraseña </label> <input type="password" id="password" name="password"">' +
        '<button type="submit">Registrar</button>' +
        '</form>'
    res.send(formulario);
});

app.listen(3000, () => console.log('Listening on port 3000!'));