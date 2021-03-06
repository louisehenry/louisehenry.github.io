var chApp = function(options) {
  var self = this;

  self.options = options;
  self.splash = document.getElementById('splash');
  self.pageWrapper = document.getElementById('page-wrapper');
  self.pages = document.getElementsByClassName('page');
  self.navItems = document.getElementsByTagName('nav')[0].getElementsByTagName('li');

  // Initialise the app
  this.init = function() {
    var self = this;

    // Give up if screen size too small
    if (window.innerWidth <= 991) {
      self.resize();
      return;
    }

    // Bind some events
    window.addEventListener('scroll', function() { self.scroll(); });
    window.addEventListener('resize', function() { self.resize(); });
    window.addEventListener('popstate', function(e) { e.preventDefault(); self.popstate(e); });

    for (var i=0; i<self.navItems.length; i++) {
      self.navItems[i].getElementsByTagName('a')[0].addEventListener('click', function(e) {
        e.preventDefault(); 

        var index;
        for (var j=0; j<self.navItems.length; j++) {
          if (self.navItems[j] == e.target.parentNode) {
            index = j;
            break;
          }
        }

        self.navClick(index, true); 
      });
    }

    self.resize();
    //self.showSplash();
  };


  // Show the splash screen
  this.showSplash = function() {
    var self = this;

    setTimeout(function() {
      self.splash.className  = self.splash.className + ' hidden';

      if (typeof Storage !== undefined)
        localStorage.setItem('splashed', 'true');
    }, 1500);
  };


  // Clicking on a nav item
  this.navClick = function(index, alterHistory) {
    var self = this,
        lnk = self.navItems[index].getElementsByTagName('a')[0],
        pageId = lnk.getAttribute('href').replace(/^\/\#?/, ''),
        listItem = lnk.parentNode;

    if (pageId === '')
      pageId = 'home';

    for (var j=0; j<self.pages.length; j++)
    {
      if (self.pages[j].getAttribute('id') == pageId)
      {
        if ('pushState' in history && alterHistory)
          history.pushState({"elementIndex": index}, lnk.innerHTML, lnk.getAttribute('href'))

        self.scrollToPage(j, self.options.scrollDuration); // Scroll to new active page
        break;
      }
    }
  };


  // History activity
  this.popstate = function(e) {
    var self = this;

    self.navClick(e.state.elementIndex, false);
  };


  // Resizing of window
  this.resize = function() {
    var self = this;

    self.width = window.innerWidth;
    self.height = window.innerHeight;

    for (var i=0; i<self.pages.length; i++) {
      self.pages[i].style.width = self.width + 'px';
      self.pages[i].style.height = self.height + 'px';
    }  
  };


  // Scrolling of window
  this.scroll = function() {
    var self = this,
        startY, 
        endY;

    for (var i=0; i<self.navItems.length; i++)
    {
      startY = i * self.height;
      endY = ((i + 1) * self.height) - 1;

      if (document.body.scrollTop >= startY && document.body.scrollTop <= endY)
      {
        if (self.navItems[i].className.indexOf('active') == -1)
        {
          self.navItems[i].className = self.navItems[i].className + ' active';
          self.pages[i].className = self.pages[i].className + ' active';
          // When visiting for the first time, add visited class
          if (self.pages[i].className.indexOf('visited') == -1)
            self.pages[i].className = self.pages[i].className + ' visited';
        }
      }
      else if (self.navItems[i].className.indexOf('active') !== -1)
      {
        self.navItems[i].className = self.navItems[i].className.replace('active', '');
        self.pages[i].className = self.pages[i].className.replace('active', '');
      }
    }
  };


  // Scroll to a page specified by the index
  this.scrollToPage = function(index, duration) {
    var self = this,
        to = index * self.height,
        difference = to - document.body.scrollTop,
        perTick = difference / duration * 10;

    setTimeout(function() {
      document.body.scrollTop = document.body.scrollTop + perTick;
      if (document.body.scrollTop == to) return;
      self.scrollToPage(index, duration - 10);
    }, 10);    
  };


  // Submit form
  this.submitForm = function() {
    var button = document.getElementById('form-send'),
        fields = [
          document.getElementById('field-name'),
          document.getElementById('field-email'),
          document.getElementById('field-message')
        ];
    button.value = 'Sending...';
    button.setAttribute('disabled', true);
    setTimeout(function() {
      for (var i=0; i<fields.length;i++) {
        fields[i].value = '';
        fields[i].setAttribute('disabled', false);
      }
      button.value = 'Send Message';
      button.setAttribute('disabled', false);
    }, 2500);
  };
};
var app = new chApp({showSplash: false, scrollDuration: 200});