// Generated by CoffeeScript 1.10.0

/*
 * require modules
 * @http://stackoverflow.com/a/19625245/3896501
 */

(function() {
  window.require = function(url) {
    var X, err, error, exports, fn, module;
    url += '.js';
    if (!require.cache) {
      require.cache = [];
    }
    exports = require.cache[url];
    if (!exports) {
      try {
        exports = {};
        X = new XMLHttpRequest;
        X.open('GET', 'js/' + url, false);
        X.send();
        if (X.status !== 200) {
          throw new Error(X.statusText);
        }
        module = {
          id: url,
          uri: url,
          exports: exports
        };
        fn = new Function('require', 'exports', 'module', X.responseText);
        fn(require, exports, module);
        require.cache[url] = exports = module.exports;
      } catch (error) {
        err = error;
        throw new Error('Error loading module ' + url + ': ' + err.message);
      }
    }
    return exports;
  };

  window.render = function(view) {
    var X, err, error, exports, html;
    view += '.html';
    if (!render.cache) {
      render.cache = [];
    }
    html = render.cache[view];
    if (!html) {
      try {
        X = new XMLHttpRequest;
        X.open('GET', 'html/' + view, false);
        X.send();
        if (X.status !== 200) {
          throw new Error(X.statusText);
        }
        render.cache[view] = html = X.responseText;
      } catch (error) {
        err = error;
        throw new Error('Error loading view ' + view + ': ' + err.message);
      }
    }

    /* export render object */
    return exports = {
      _objs: {},
      _data: {},
      "with": function(objects) {
        this._objs = objects;
        return this;
      },
      data: function(data) {
        this._data = data;
        return this;
      },
      into: function(selector) {

        /* replace data strings */
        var args, div, fn, i, j, len, postInsert, ref, repl, scripts, vals;
        ref = Object.keys(this._data);
        for (j = 0, len = ref.length; j < len; j++) {
          repl = ref[j];
          html = html.replace('{{' + repl + '}}', this._data[repl]);
        }

        /* call scripts with passed objects */
        postInsert = [];
        div = document.createElement('div');
        div.innerHTML = html;
        scripts = div.getElementsByTagName('script');
        i = scripts.length;
        while (i--) {

          /* eval the function with passed objects */
          args = Object.keys(this._objs);
          vals = args.map((function(k) {
            return this._objs[k];
          }), this);
          args.push(scripts[i].innerHTML);
          fn = Function.bind.apply(Function, [null].concat(args));
          postInsert.push([new fn, vals]);

          /* remove <script> node from tree */
          scripts[i].parentNode.removeChild(scripts[i]);
        }
        $(selector).html(div.innerHTML);
        return postInsert.forEach(function(s, i) {
          return s[0].apply(window, s[1]);
        });
      }
    };
  };

  $.fn.serializeBase64 = function() {
    var form;
    form = {};
    $.each($(this).serializeArray(), function(i, field) {
      return form[field.name] = field.value || '';
    });
    return btoa(JSON.stringify(form));
  };

  $(document).ready(function() {
    var Routes;
    Routes = require('routes');
    Routes.run();

    /* trigger hashchange for view */
    return $(window).trigger('hashchange');
  });

}).call(this);