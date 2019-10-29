var http = require('http');
var fs = require('fs');
var querystring = require('querystring');

const portal = 8888;
console.log(`服务开始,打开localhost:${portal}即可访问`);
http
  .createServer(function(req, res) {
    var arg = req.url;
    if (arg === '/uploadUrl') {
      console.log('上传文件服务');
      parseFile(req, res);
    } else {
      fs.readFile('./test.html', 'utf-8', function(err, data) {
        //读取内容
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'text/html' }); //注意这里
        res.write(data);
        res.end();
      });
    }
  })
  .listen(portal);

function parseFile(req, res) {
  req.setEncoding('binary');
  var body = ''; // 文件数据
  var fileName = ''; // 文件名
  // 边界字符串
  // console.log(req.headers['content-type'] + '\n\n\n\n\n\n\n');
  var boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
  req.on('data', function(chunk) {
    console.log(typeof chunk);
    body += chunk;
  });
  req.on('end', function() {
    var file = querystring.parse(body, '\r\n', ':');
    // console.log(file);

    // 只处理图片文件
    if (file['Content-Type'].indexOf('image') !== -1) {
      //获取文件名
      var fileInfo = file['Content-Disposition'].split('; ');
      for (value in fileInfo) {
        if (fileInfo[value].indexOf('filename=') != -1) {
          fileName = fileInfo[value].substring(10, fileInfo[value].length - 1);

          if (fileName.indexOf('\\') != -1) {
            fileName = fileName.substring(fileName.lastIndexOf('\\') + 1);
          }
          // console.log('文件名: ' + fileName);
        }
      }

      // 获取图片类型(如：image/gif 或 image/png))
      var entireData = body.toString(),
        contentType = file['Content-Type'].substring(1);

      //获取文件二进制数据开始位置，即contentType的结尾
      var upperBoundary = entireData.indexOf(contentType) + contentType.length;
      var shorterData = entireData.substring(upperBoundary);

      // 替换开始位置的空格
      var binaryDataAlmost = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

      // 去除数据末尾的额外数据，即: "--"+ boundary + "--"
      var binaryData = binaryDataAlmost.substring(
        0,
        binaryDataAlmost.indexOf('--' + boundary + '--')
      );
      // 保存文件
      // res.write('<head><meta charset="utf-8"/></head>');
      // res.end('123');
      fs.writeFile('./image/' + fileName, binaryData, 'binary', function(err) {
        // res.writeHead(302, {
        //   Location: '/'
        //   //add other headers here...
        // });
        res.writeHead(200); //原来没写end导致变成了持久连接
        res.end('123');
      });
    } else {
      res.end('just pic allowed');
    }
  });
}
