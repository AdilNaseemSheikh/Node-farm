const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replateTemplate = require('./modules/replaceTemplate');

/////////////////////////////////////////////////
// 1. READING FILES
/*
// SYNCHRONOUS, BLOCKING FILE READING

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// // console.log('started reading');
// // console.log('read complete, data => ', textIn);

// const textOut = `This is what we NOW know about Avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("file written");

// ASYNCHRONOUS, NON_BLOCKING FILE READING

fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  if (err) return console.log("ERROR 💣");
  fs.readFile(`./txt/${data}.txt`, "utf-8", (err2, data2) => {
    fs.readFile(`./txt/append.txt`, "utf-8", (err2, data3) => {
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, (err) => {
        console.log("3 files read and 1 written");
      });
    });
  });
});
*/

///////////////////////////////////////////////////
// 2. SERVER

// reading file here synchronously will only occure in start so sync is not a problem.
// Reading data synchronously everytime when route is hit is a problem

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replateTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // Product
  } else if (pathname === '/product') {
    const product = dataObj[query.id];

    const output = replateTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
    git remote add origin https://github.com/AdilNaseemSheikh/Node-farm.git
    git remote set-url origin https://AdilNaseemSheikh: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@github.com/AdilNaseemSheikh/Node-farm.git
    // not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not Found :(</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000');
});
