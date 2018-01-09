var expressSanitizer= require('express-sanitizer'),
    Hero            = require('./models/hero.js'),
    methodOverride  = require('method-override'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    express         = require('express'),
    app             = express();
    
// CONFIG
mongoose.connect('mongodb://localhost/greek_mythology', {useMongoClient: true});
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// INDEX redirect
app.get('/', function(req, res) {
    res.redirect('/heroes');
});

// INDEX
app.get('/heroes', function(req, res) {
    Hero.find({}, function(err, heroes) {
       if (err) {
           console.log(err);
       } else {
           res.render('index', {heroes: heroes});
       }
    });
});

// NEW
app.get('/heroes/new', function(req, res) {
   res.render('new'); 
});

// CREATE
app.post('/heroes', function(req, res) {
    req.body.hero.description = req.sanitize(req.body.hero.description);
    Hero.create(req.body.hero, function(err, newHero) {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/heroes');
        }
    });
});

// SHOW
app.get('/heroes/:id', function(req, res) {
    Hero.findById(req.params.id, function(err, foundHero) {
        if (err) {
            res.redirect('/heroes');
        }  else {
            res.render('show', {hero: foundHero});
        }
    });
});

// EDIT
app.get('/heroes/:id/edit', function(req, res) {
    Hero.findById(req.params.id, function(err, foundHero) {
        if (err) {
            res.redirect('/heroes');
        } else {
            res.render('edit', {hero: foundHero});
        }
    }); 
});

// UPDATE
app.put('/heroes/:id', function(req, res) {
    req.body.hero.description = req.sanitize(req.body.hero.description);
    Hero.findByIdAndUpdate(req.params.id, req.body.hero, function(err, foundHero) {
       if (err) {
           res.redirect('/heroes');
       } else {
           res.redirect('/heroes/' + req.params.id);
       }
   });
});


// DELETE
app.delete('/heroes/:id', function(req, res) {
    Hero.findByIdAndRemove(req.params.id, function(err) {
       if (err) {
           res.redirect('/heroes');
       } else {
           res.redirect('/heroes');
       }
    });
})

app.listen(process.env.PORT, process.env.ID, function() {
    console.log('Server running...');
});