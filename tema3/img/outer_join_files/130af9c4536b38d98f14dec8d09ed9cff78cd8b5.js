/* ========================================================================
 * Bootstrap: tab.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.4.1'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(document).find(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
        .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
        .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
          .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);
;
// Inform the world that we have the ability to use BS3 nav/navbar markup in BS4
window.BS3_COMPAT = true;

(function($) {
  if (!$.fn.tab.Constructor.VERSION.match(/^3\./)) {
    (console.warn || console.error || console.log)("bs3compat.js couldn't find bs3 tab impl; bs3 tabs will not be properly supported");
    return;
  }
  var bs3TabPlugin = $.fn.tab.noConflict();

  if (!$.fn.tab.Constructor.VERSION.match(/^4\./)) {
    (console.warn || console.error || console.log)("bs3compat.js couldn't find bs4 tab impl; bs3 tabs will not be properly supported");
    return;
  }
  var bs4TabPlugin = $.fn.tab.noConflict();

  var EVENT_KEY = "click.bs.tab.data-api";
  var SELECTOR = '[data-toggle="tab"], [data-toggle="pill"]';

  $(document).off(EVENT_KEY);
  $(document).on(EVENT_KEY, SELECTOR, function(event) {
    event.preventDefault();
    $(this).tab("show");
  });

  function TabPlugin(config) {
    if ($(this).closest(".nav").find(".nav-item, .nav-link").length === 0) {
      // Bootstrap 3 tabs detected
      bs3TabPlugin.call($(this), config);
    } else {
      // Bootstrap 4 tabs detected
      bs4TabPlugin.call($(this), config);
    }
  }

  var noconflict = $.fn.tab;
  $.fn.tab = TabPlugin;
  $.fn.tab.Constructor = bs4TabPlugin.Constructor;
  $.fn.tab.noConflict = function() {
    $.fn.tab = noconflict;
    return TabPlugin;
  };

})(jQuery);

// bs3 navbar: li.active > a
// bs4 navbar: li > a.active
// bs3 tabset: li.active > a
// bs4 tabset: li > a.active


(function($) {
  /* 
   * Bootstrap 4 uses poppler.js to choose what direction to show dropdown
   * menus, except in the case of navbars; they assume that navbars are always
   * at the top of the page, so this isn't necessary. However, Bootstrap 3
   * explicitly supported bottom-positioned navbars via .navbar-fixed-bottom,
   * and .fixed-bottom works on Bootstrap 4 as well.
   * 
   * We monkeypatch the dropdown plugin's _detectNavbar method to return false
   * if we're in a bottom-positioned navbar.
   */
  if (!$.fn.dropdown.Constructor.prototype._detectNavbar) {
    // If we get here, the dropdown plugin's implementation must've changed.
    // Someone will need to go into Bootstrap's dropdown.js.
    (console.warn || console.error || console.log)("bs3compat.js couldn't detect the dropdown plugin's _detectNavbar method");
    return;
  }

  var oldDetectNavbar = $.fn.dropdown.Constructor.prototype._detectNavbar;
  $.fn.dropdown.Constructor.prototype._detectNavbar = function() {
    return oldDetectNavbar.apply(this, this.arguments) &&
      !($(this._element).closest('.navbar').filter('.navbar-fixed-bottom, .fixed-bottom').length > 0);
  };
})(jQuery);
;
$(function () {
  var url = new URL(window.location.href);
  var toMark = url.searchParams.get("q");
  var mark = new Mark("main");
  if (toMark) {
    mark.mark(toMark, {
      accuracy: {
        value: "complementary",
        limiters: [",", ".", ":", "/"],
      }
    });
  }

  // Activate popovers
  $('[data-toggle="popover"]').popover({
    container: 'body',
    html: true,
    trigger: 'focus',
    placement: "top",
    sanitize: false,
  });
  $('[data-toggle="tooltip"]').tooltip();
})

// Search ----------------------------------------------------------------------

var fuse;

$(function () {
  // Initialise search index on focus
  $("#search").focus(async function(e) {
    if (fuse) {
      return;
    }

    $(e.target).addClass("loading");

    var response = await fetch('search.json');
    var data = await response.json();

    var options = {
      keys: ["heading", "text", "code"],
      ignoreLocation: true,
      threshold: 0.1,
      includeMatches: true,
      includeScore: true,
    };
    fuse = new Fuse(data, options);

    $(e.target).removeClass("loading");
  });

  // Use algolia autocomplete
  var options = {
    autoselect: true,
    debug: true,
    hint: false,
    minLength: 2,
  };

  $("#search").autocomplete(options, [
    {
      name: "content",
      source: searchFuse,
      templates: {
        suggestion: (s) => {
          if (s.chapter == s.heading) {
            return `${s.chapter}`;
          } else {
            return `${s.chapter} /<br> ${s.heading}`;
          }
        },
      },
    },
  ]).on('autocomplete:selected', function(event, s) {
    window.location.href = s.path + "?q=" + q + "#" + s.id;
  });
});

var q;
async function searchFuse(query, callback) {
  await fuse;

  var items;
  if (!fuse) {
    items = [];
  } else {
    q = query;
    var results = fuse.search(query, { limit: 20 });
    items = results
      .filter((x) => x.score <= 0.75)
      .map((x) => x.item);
  }

  console.log(results);
  callback(items);
}

// Copy to clipboard -----------------------------------------------------------

function changeTooltipMessage(element, msg) {
  var tooltipOriginalTitle=element.getAttribute('data-original-title');
  element.setAttribute('data-original-title', msg);
  $(element).tooltip('show');
  element.setAttribute('data-original-title', tooltipOriginalTitle);
}

$(document).ready(function() {
  if(ClipboardJS.isSupported()) {
    // Insert copy buttons
    var copyButton = "<div class='copy'><button type='button' class='btn btn-outline-primary btn-copy' title='Copy to clipboard' aria-label='Copy to clipboard' data-toggle='popover' data-placement='top' data-trigger='hover'>Copy</button></div>";
    $(copyButton).appendTo("pre");
    // Initialize tooltips:
    $('.btn-copy').tooltip({container: 'body', boundary: 'window'});

    // Initialize clipboard:
    var clipboard = new ClipboardJS('.btn-copy', {
      text: function(trigger) {
        return trigger.parentNode.previousSibling.textContent;
      }
    });

    clipboard.on('success', function(e) {
      changeTooltipMessage(e.trigger, 'Copied!');
      e.clearSelection();
    });

    clipboard.on('error', function() {
      changeTooltipMessage(e.trigger,'Press Ctrl+C or Command+C to copy');
    });
  };
});
;
