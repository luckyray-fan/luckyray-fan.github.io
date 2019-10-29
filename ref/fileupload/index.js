/**
 * 服务入口
 */
var http = require('http');
var koaStatic = require('koa-static');
var path = require('path');
var koaBody = require('koa-body'); //文件保存库
var fs = require('fs');
var Koa = require('koa2');

var app = new Koa();
var port = process.env.PORT || '8100';

var uploadHost = `http://localhost:${port}/uploads/`;

app.use(
  koaBody({
    formidable: {
      //设置文件的默认保存目录，不设置则保存在系统临时目录下  os
    },
    multipart: true // 开启文件上传，默认是关闭
  })
);

//开启静态文件访问
app.use(koaStatic(path.resolve(__dirname, '../static')));

//二次处理文件，修改名称
app.use((ctx) => {
  var files = ctx.request.files.f1; // 多文件， 得到上传文件的数组
  var result = [];

  //遍历处理
  files &&
    files.forEach((item) => {
      var path = item.path;
      var fname = item.name; //原文件名称
      var nextPath = path + fname;
      if (item.size > 0 && path) {
        //得到扩展名
        var extArr = fname.split('.');
        var ext = extArr[extArr.length - 1];
        var nextPath = path + '.' + ext;
        //重命名文件
        fs.renameSync(path, nextPath);

        //文件可访问路径放入数组
        result.push(uploadHost + nextPath.slice(nextPath.lastIndexOf('/') + 1));
      }
    });

  //输出 json 结果
  ctx.body = `{
        "fileUrl":${JSON.stringify(result)}
    }`;
});

/**
 * http server
 */
var server = http.createServer(app.callback());
server.listen(port);
console.log('demo1 server start ......   ');
