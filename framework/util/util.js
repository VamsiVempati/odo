// Generated by IcedCoffeeScript 1.4.0a
(function() {
  var S4, express, guid, linkify, linkifyWiki, linkifyWord, markdown;

  String.prototype.contains = function(it) {
    return this.indexOf(it) !== -1;
  };

  String.prototype.caseInsensitiveContains = function(it) {
    return this.toUpperCase().contains(it.toUpperCase());
  };

  String.prototype.toTitleCase = function() {
    return this.replace(/([\w&`'��"�.@:\/\{\(\[<>_]+-? *)/g, function(match, p1, index, title) {
      if (index > 0 && title.charAt(index - 2) !== ":" && match.search(/^(a(nd?|s|t)?|b(ut|y)|en|for|i[fn]|o[fnr]|t(he|o)|vs?\.?|via)[ \-]/i) > -1) {
        return match.toLowerCase();
      } else if (title.substring(index - 1, index + 1).search(/['"_{(\[]/) > -1) {
        return match.charAt(0) + match.charAt(1).toUpperCase() + match.substr(2);
      } else if (match.substr(1).search(/[A-Z]+|&|[\w]+[._][\w]+/) > -1 || title.substring(index - 1, index + 1).search(/[\])}]/) > -1) {
        return match;
      } else {
        return match.charAt(0).toUpperCase() + match.substr(1);
      }
    });
  };

  Math.clamp = function(value, min, max) {
    return Math.max(Math.min(value, max), min);
  };

  Math.lerp = function(value, start, end) {
    return Math.clamp((value * (end - start)) + start, 0, 1);
  };

  Math.clerp = function(value, start, end) {
    return Math.clamp((value - start) / (end - start), 0, 1);
  };

  Math.clerpy = function(value, start, middle, end) {
    if (value <= middle) {
      return Math.clamp((value - start) / (middle - start), 0, 1);
    }
    return Math.clamp((value - end) / (middle - end), 0, 1);
  };

  S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  guid = function() {
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  };

  markdown = function() {
    return {
      strip: function(markdown) {
        return markdown.replace(/(\[[a-zA-Z ][^\]]*\])/g, function(match, p1, index, title) {
          return match.substr(1, match.length - 2);
        }).replace(/(\[[0-9]*\])/g, function(match, p1, index, title) {
          return '';
        }).replace(/\*\*\[\*\*/, '').replace(/\*\*\]\*\*/, '').replace(/\*\*\*\*/, '');
      },
      list: function(markdown) {
        var chunks, result;
        result = [];
        chunks = content.split('\n');
        $.each(chunks, function(key, value) {
          if (value === '') return;
          return result.push('* ' + value);
        });
        return result.join('\n');
      }
    };
  };

  linkify = function(html, linkify) {
    if (!linkify) {
      linkify = function(url) {
        return '<a href="' + url + '">' + url + '</a>';
      };
    }
    return html.replace(/(?:http|ftp|https):\/\/[\w\-_]+(?:\.[\w\-_]+)+(?:[\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&amp;/~\+#])/g, function(match, index) {
      if ((html.lastIndexOf('>', index) < html.lastIndexOf('<', index)) || (html.lastIndexOf('</a>', index) < html.lastIndexOf('<a ', index))) {
        return match;
      }
      return linkify(match);
    });
  };

  linkifyWord = function(html, word, linkify) {
    var i, lowerCaseword, result;
    if (!linkify) {
      linkify = function(url, text) {
        return "<a href=\"#" + (url.replace(" ", "+")) + "\">" + text + "</a>";
      };
    }
    result = '';
    lowerCaseword = word.toLowerCase();
    while (html.length > 0) {
      i = html.toLowerCase().indexOf(lowerCaseword, i);
      if (i < 0) return result + html;
      if ((i > 0 && /^[a-zA-Z]$/.test(html[i - 1])) || (i + word.length < html.length && /^[a-zA-Z]$/.test(html[i + lowerCaseword.length])) || (html.lastIndexOf('>', i) < html.lastIndexOf('<', i)) || (html.lastIndexOf('</a>', i) < html.lastIndexOf('<a ', i))) {
        i++;
        continue;
      }
      result += html.substring(0, i) + linkify(word, html.substr(i, word.length));
      html = html.substr(i + word.length);
      i = 0;
    }
    return result;
  };

  linkifyWiki = function(html, pages, linkify) {
    var newPages;
    newPages = _.clone(pages);
    newPages.sort(function(x, y) {
      if (x.length < y.length) {
        return 1;
      } else if (x.length > y.length) {
        return -1;
      } else {
        return 0;
      }
    });
    _.each(newPages, function(page) {
      return html = $.linkifyWord(html, page, linkify);
    });
    return html;
  };

  if (typeof module !== "undefined" && module !== null) {
    express = require('express');
    module.exports = {
      configure: function(app) {
        return app.use('/js', express["static"](__dirname));
      },
      S4: S4,
      guid: guid,
      markdown: markdown,
      linkify: linkify,
      linkifyWord: linkifyWord,
      linkifyWiki: linkifyWiki
    };
  }

  if (typeof window !== "undefined" && window !== null) {
    window.S4 = S4;
    window.guid = guid;
    window.markdown = markdown;
    window.linkify = linkify;
    window.linkifyWord = linkifyWord;
    window.linkifyWiki = linkifyWiki;
  }

}).call(this);