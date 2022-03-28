const redis = require('redis');
const client = redis.createClient({
    host: process.env.r_host,
    port: process.env.r_port,
    password: process.env.r_password
});
client.on("error", function(err) {
    console.log("redis client连接失败", err);
});
client.on('ready', function(res) {
    console.log('client ready');
});
client.on("error", function(err) {
    console.log("Error " + err);
});

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const request = require('request');

const app = express();

const bot = new TelegramBot(token, { polling: true });

const port = process.env.PORT;
var value;
app.get('/', (req, res) => {
    res.send("Telegram movie bot");
})

app.listen(port);


//function
bot.onText(/\/start/, msg => {
    bot.sendMessage(msg.chat.id, `
    *help:*
      1. /latest   Get 1 latest movie added to tmdb
      2. /popular   Get 3 popular movies
      3. /upcoming   Get 3 upcoming movies
      4. /movie Deadpool 2  :Get information about movie Deadpool 2
      5. /person Bradley Cooper :Get information about actor Bradley Cooper
      6. /help 
      7. /about
    `, { parse_mode: 'Markdown' });
    bot.sendMessage(msg.chat.id, '[The Movie Database](https://www.themoviedb.org/) Telegram Bot!\nThis bot can get any one movies infomation', { parse_mode: 'Markdown' });
});

bot.onText(/\/about/, msg => {
    bot.sendMessage(msg.chat.id, '[The Movie Database](https://www.themoviedb.org/) Telegram Bot!\nThis bot can get any one movies infomation', { parse_mode: 'Markdown' });
});

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id, `
    *help:*
      1. /latest   Get 1 latest movie added to tmdb
      2. /popular   Get 3 popular movies
      3. /upcoming   Get 3 upcoming movies
      4. /movie Deadpool 2  :Get information about movie Deadpool 2
      5. /person Bradley Cooper :Get information about actor Bradley Cooper
      6. /help 
      7. /about
    `, { parse_mode: 'Markdown' });
});

bot.onText(/\/latest/, function(msg, match) {
    request('https://api.themoviedb.org/3/movie/latest?language=en-US&api_key=' + tmdbapi, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            const res = JSON.parse(body);
            bot.sendMessage(msg.chat.id, '*Title: *' + res.original_title + '\n*Date: *' + res.release_date + '\n*Language: *' + res.original_language + '\n*Overview: *' + res.overview, { parse_mode: 'Markdown' })
            client.get('request', function(err, reply) {
                bot.sendMessage(msg.chat.id, 'The chatbot totally has received ' + reply + ' requests');
            });
        } else {
            bot.sendMessage(msg.chat.id, 'Seems to have some problems fetching the data :-(');
        }
    });
    record()
});

bot.onText(/\/popular/, function(msg, match) {
    request('https://api.themoviedb.org/3/movie/popular?api_key=' + tmdbapi, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            const res = JSON.parse(body);
            const posterURL_1 = 'http://image.tmdb.org/t/p/w185/' + res.results[0].poster_path;
            const posterURL_2 = 'http://image.tmdb.org/t/p/w185/' + res.results[1].poster_path;
            const posterURL_3 = 'http://image.tmdb.org/t/p/w185/' + res.results[2].poster_path;
            bot.sendPhoto(msg.chat.id, posterURL_1, { parse_mode: 'Markdown', caption: '*Title: *' + res.results[0].title + '\n*Rating: *' + res.results[0].vote_average + '\n*Overview: *' + res.results[0].overview });
            bot.sendPhoto(msg.chat.id, posterURL_2, { parse_mode: 'Markdown', caption: '*Title: *' + res.results[1].title + '\n*Rating: *' + res.results[1].vote_average + '\n*Overview: *' + res.results[1].overview });
            bot.sendPhoto(msg.chat.id, posterURL_3, { parse_mode: 'Markdown', caption: '*Title: *' + res.results[2].title + '\n*Rating: *' + res.results[2].vote_average + '\n*Overview: *' + res.results[2].overview });
            client.get('request', function(err, reply) {
                bot.sendMessage(msg.chat.id, 'The chatbot totally has received ' + reply + ' requests');
            });
        } else {
            bot.sendMessage(msg.chat.id, 'Seems to have some problems fetching the data :-(');
        }
    });
    record()
});

bot.onText(/\/upcoming/, function(msg, match) {
    request('https://api.themoviedb.org/3/movie/upcoming?api_key=' + tmdbapi, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            const res = JSON.parse(body);
            const posterURL_1 = 'http://image.tmdb.org/t/p/w185/' + res.results[0].poster_path;
            const posterURL_2 = 'http://image.tmdb.org/t/p/w185/' + res.results[1].poster_path;
            const posterURL_3 = 'http://image.tmdb.org/t/p/w185/' + res.results[2].poster_path;
            bot.sendPhoto(msg.chat.id, posterURL_1, { parse_mode: 'Markdown', caption: '*Title: *' + res.results[0].title + '\n*Date: *' + res.results[0].release_date + '\n*Rating: *' + res.results[0].vote_average + '\n*Overview: *' + res.results[0].overview });
            bot.sendPhoto(msg.chat.id, posterURL_2, { parse_mode: 'Markdown', caption: '*Title: *' + res.results[1].title + '\n*Date: *' + res.results[0].release_date + '\n*Rating: *' + res.results[1].vote_average + '\n*Overview: *' + res.results[1].overview });
            bot.sendPhoto(msg.chat.id, posterURL_3, { parse_mode: 'Markdown', caption: '*Title: *' + res.results[2].title + '\n*Date: *' + res.results[0].release_date + '\n*Rating: *' + res.results[2].vote_average + '\n*Overview: *' + res.results[2].overview });
            client.get('request', function(err, reply) {
                bot.sendMessage(msg.chat.id, 'The chatbot totally has received ' + reply + ' requests');
            });
        } else {
            bot.sendMessage(msg.chat.id, 'Seems to have some problems fetching the data :-(');
        }
    });
    record()
});

bot.onText(/\/movie (.+)/, function(msg, match) {
    const movie = match[1];
    request('https://api.themoviedb.org/3/search/movie?api_key=' + tmdbapi + '&query=' + movie, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            bot.sendMessage(msg.chat.id, '_Searching for: _' + movie + '...', { parse_mode: 'Markdown' })
                .then(function(msg) {
                    const res = JSON.parse(body);
                    const posterURL = 'http://image.tmdb.org/t/p/w185/' + res.results[0].poster_path;
                    bot.sendPhoto(msg.chat.id, posterURL, { parse_mode: 'Markdown', caption: '*Title: *' + res.results[0].title + '\n*Rating: *' + res.results[0].vote_average + '\n*Data: *' + res.results[0].release_date + '\n*Overview: *' + res.results[0].overview });
                })
            client.get('request', function(err, reply) {
                bot.sendMessage(msg.chat.id, 'The chatbot totally has received ' + reply + ' requests');
            });
        } else {
            bot.sendMessage(msg.chat.id, 'Seems to have some problems fetching the data :-(');
        }
    });
    record()
});

bot.onText(/\/person (.+)/, function(msg, match) {
    const actor = match[1];
    request('https://api.themoviedb.org/3/search/person?api_key=' + tmdbapi + '&query=' + actor, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            bot.sendMessage(msg.chat.id, '_Searching for: _' + actor + '...', { parse_mode: 'Markdown' })
                .then(function(msg) {
                    const res = JSON.parse(body);
                    const profileURL = 'http://image.tmdb.org/t/p/w185/' + res.results[0].profile_path;
                    bot.sendPhoto(msg.chat.id, profileURL, { parse_mode: 'Markdown', caption: '*Name: *' + res.results[0].name + '\n*Known For: *' + res.results[0].known_for[0].title + ', ' + res.results[0].known_for[1].title });
                })
            client.get('request', function(err, reply) {
                bot.sendMessage(msg.chat.id, 'The chatbot totally has received ' + reply + ' requests');
            });
        } else {
            bot.sendMessage(msg.chat.id, 'Seems to have some problems fetching the data :-(');
        }
    });
    record();
})

function record() {
    client.get('request', function(err, reply) {
        console.log(reply);
        value = parseInt(reply);
        value = value + 1;
        value = String(value);
        console.log(value);
        client.set('request', value);
    });
}