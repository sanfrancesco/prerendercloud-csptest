const express = require('express');
const app = express();
const csp = require('helmet-csp')

app.use('/csp-default-src', csp({
  directives: {
    defaultSrc: ["'self'", "'sha256-8GhDD43NB96vv16//gEVYhqP4Df0pWeuaB+h2CRjz+k='"],
    styleSrc: ["'unsafe-inline'"]
  }
}));
app.use('/csp-script-src', csp({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'sha256-8GhDD43NB96vv16//gEVYhqP4Df0pWeuaB+h2CRjz+k='"],
    styleSrc: ["'unsafe-inline'"]
  }
}));
app.use('/csp-script-src-none', csp({
  directives: {
    scriptSrc: ["'none'"],
    styleSrc: ["'unsafe-inline'"]
  }
}));
app.use('/csp-default-src-unsafe-inline', csp({
  loose: true, // helment-csp does not allow unsafe-inline in default-src, but the browser does, so let's test it
  directives: {
    defaultSrc: ["'self'", "'unsafe-inline'"]
  }
}));
app.use('/csp-script-src-unsafe-inline', csp({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'unsafe-inline'"],
    scriptSrc: ["'unsafe-inline'"]
  }
}));

app.get('/*', function(req, res) {
  res.send(`
<html><head></head>
  <body style='margin: 10px;width: 800px;'>
    <ul>
      <li><a href='/'>no csp</a> (prerender.cloud should not add CSP)</li>
      <li><a href='/csp-default-src'>csp-default-src</a> (prerender.cloud should add sha256 to default-src)</li>
      <li><a href='/csp-script-src'>csp-script-src</a> (prerender.cloud should add sha256 to script-src)</li>
      <li><a href='/csp-script-src-none'>csp-script-src-none</a> (prerender.cloud should rm 'none' and add sha256 to script-src - but renering 'hello' will still fail because we're missing the sha256 for that)</li>

      <li><a href='/csp-default-src-unsafe-inline'>csp-default-src-unsafe-inline</a> (prerender.cloud should do nothing)</li>
      <li><a href='/csp-script-src-unsafe-inline'>csp-script-src-unsafe-inline</a> (prerender.cloud should do nothing)</li>
    </ul>
    <div>
      <h2 style='margin:0;padding:10px; background: #555; color: #fff;'>JS generated</h2>
      <div id='root' style='border: 1px solid #555; padding: 10px'></div>
    </div>
    <script type='text/javascript'>document.getElementById('root').innerHTML = 'hello';</script>
  </body>
</html>
  `)
});

let port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log('csptest listening on port', port);
});
