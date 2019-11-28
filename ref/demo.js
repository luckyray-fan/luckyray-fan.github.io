(function() {
  var i = 0; //还是直接写在 demo 上比较好?
  var demos = [];
  class demo {
    constructor({ src = '', html = '', fn = '', ops = { width: 400, height: 400 } }) {
      let iframe = document.createElement('iframe');
      this.iframe = iframe;
      iframe.id = i;
      iframe.width = ops.width;
      iframe.height = ops.height;
      if (src) {
        iframe.src = src;
      } else {
        iframe.onload = () => {
          let body = iframe.contentDocument.body;
          body.innerHTML += html;
          let script = document.createElement('script');
          script.innerHTML = fn;
          body.append(script);
        };
      }
      document.body.append(iframe);
      demos.push(iframe);
      i++;
    }
    size(arg) {
      demos.forEach((i) => {
        i.style.display = 'none';
      });
      this.iframe.style.display = 'inline-block';
      [this.iframe.width, this.iframe.height] = ['100%', window.innerHeight];
    }
  }
  window.demo = demo;
})();
