(function() {
  var App, AppMenuItemView, AppMenuView, ECommerceApp, MainMenuItemView, MainMenuView, OpenERP, PageHeaderView, SalesApp, SettingsApp,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  OpenERP = (function(_super) {

    __extends(OpenERP, _super);

    function OpenERP(options) {
      this.loadApp = __bind(this.loadApp, this);      OpenERP.__super__.constructor.call(this, options);
      this.mainMenu = new Backbone.Collection;
      this.mainMenuView = new MainMenuView({
        collection: this.mainMenu
      });
      this.addApp(new SalesApp);
      this.addApp(new ECommerceApp);
      this.addApp(new SettingsApp);
    }

    OpenERP.prototype.login = function() {};

    OpenERP.prototype.logout = function() {};

    OpenERP.prototype.routes = {
      'app/:app': 'loadApp',
      'app/:app/:page': 'loadApp'
    };

    OpenERP.prototype.apps = {};

    OpenERP.prototype.addApp = function(app) {
      this.mainMenu.add({
        name: app.name,
        active: false
      });
      return this.apps[app.name] = app;
    };

    OpenERP.prototype.loadApp = function(app, page) {
      this.mainMenu.each(function(i) {
        return i.set('active', i.get('name') === app);
      });
      return this.apps[app].loadPage(page);
    };

    return OpenERP;

  })(Backbone.Router);

  MainMenuItemView = (function(_super) {

    __extends(MainMenuItemView, _super);

    function MainMenuItemView() {
      this.render = __bind(this.render, this);
      MainMenuItemView.__super__.constructor.apply(this, arguments);
    }

    MainMenuItemView.prototype.className = 'menuItem';

    MainMenuItemView.prototype.template = _.template($('#mainmenu-item').html());

    MainMenuItemView.prototype.initialize = function() {
      return this.model.bind('all', this.render);
    };

    MainMenuItemView.prototype.events = {
      'click': 'navigate'
    };

    MainMenuItemView.prototype.render = function() {
      return $(this.el).html(this.template(this.model.toJSON()));
    };

    MainMenuItemView.prototype.navigate = function(e) {
      e.preventDefault();
      return openerp.navigate(e.srcElement.pathname, {
        trigger: true
      });
    };

    return MainMenuItemView;

  })(Backbone.View);

  MainMenuView = (function(_super) {

    __extends(MainMenuView, _super);

    function MainMenuView() {
      this.addItem = __bind(this.addItem, this);
      MainMenuView.__super__.constructor.apply(this, arguments);
    }

    MainMenuView.prototype.className = 'mainMenu';

    MainMenuView.prototype.initialize = function() {
      this.collection.bind('add', this.addItem);
      this.collection.bind('reset', this.render);
      return $('.navbar').prepend(this.el);
    };

    MainMenuView.prototype.addItem = function(item) {
      return $(this.el).append((new MainMenuItemView({
        model: item
      })).render());
    };

    MainMenuView.prototype.render = function() {
      var _this = this;
      $(this.el).empty();
      return this.collection.each(function(i) {
        return _this.addItem(i);
      });
    };

    return MainMenuView;

  })(Backbone.View);

  PageHeaderView = (function(_super) {

    __extends(PageHeaderView, _super);

    function PageHeaderView() {
      this.searchclear = __bind(this.searchclear, this);
      this.filter = __bind(this.filter, this);
      PageHeaderView.__super__.constructor.apply(this, arguments);
    }

    PageHeaderView.prototype.template = _.template($('#page-header').html());

    PageHeaderView.prototype.initialize = function(page) {
      this.page = page;
    };

    PageHeaderView.prototype.events = {
      'keyup .searchbox': 'filter',
      'click .searchclear': 'searchclear'
    };

    PageHeaderView.prototype.render = function() {
      return $(this.el).html(this.template({
        name: this.page.name
      }));
    };

    PageHeaderView.prototype.filter = function() {
      var s;
      s = $('.search').val().toLowerCase();
      if (s) {
        return $('.searchclear').fadeIn('fast');
      } else {
        return this.searchclear();
      }
    };

    PageHeaderView.prototype.searchclear = function() {
      $('.searchclear').fadeOut('fast');
      $('.search').val('').focus();
      return this.render();
    };

    return PageHeaderView;

  })(Backbone.View);

  AppMenuItemView = (function(_super) {

    __extends(AppMenuItemView, _super);

    function AppMenuItemView() {
      this.render = __bind(this.render, this);
      AppMenuItemView.__super__.constructor.apply(this, arguments);
    }

    AppMenuItemView.prototype.className = 'appMenuItem';

    AppMenuItemView.prototype.template = _.template($('#appmenu-item').html());

    AppMenuItemView.prototype.initialize = function() {
      return this.model.bind('all', this.render);
    };

    AppMenuItemView.prototype.events = {
      'click': 'navigate'
    };

    AppMenuItemView.prototype.render = function() {
      return $(this.el).html(this.template(this.model.toJSON()));
    };

    AppMenuItemView.prototype.navigate = function(e) {
      e.preventDefault();
      return openerp.navigate($(this.el).find('a').attr('href'), {
        trigger: true
      });
    };

    return AppMenuItemView;

  })(Backbone.View);

  AppMenuView = (function(_super) {

    __extends(AppMenuView, _super);

    function AppMenuView() {
      AppMenuView.__super__.constructor.apply(this, arguments);
    }

    AppMenuView.prototype.template = _.template($('#appmenu-section').html());

    AppMenuView.prototype.initialize = function(app) {
      var k, v, _ref, _results;
      this.app = app;
      this.sections = {};
      _ref = this.app.pages;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        v.app = this.app.name;
        if (!this.sections[v.section]) {
          this.sections[v.section] = $(this.template({
            section: k
          }));
        }
        _results.push(this.sections[v.section].append((new AppMenuItemView({
          model: new Backbone.Model(v)
        })).render()));
      }
      return _results;
    };

    AppMenuView.prototype.render = function() {
      var k, v, _ref;
      _ref = this.sections;
      for (k in _ref) {
        v = _ref[k];
        $(this.el).append(v);
      }
      return this.el;
    };

    return AppMenuView;

  })(Backbone.View);

  App = (function() {

    function App() {
      var k, v, _ref;
      this.views = {};
      this.appMenu = new Backbone.Collection;
      _ref = this.pages;
      for (k in _ref) {
        v = _ref[k];
        v.active = false;
        this.appMenu.add(new Backbone.Model(v));
        this.views[k] = (new PageHeaderView(v)).render();
      }
      this.menu = (new AppMenuView(this)).render();
      this.loadPage(this.defaultpage);
    }

    App.prototype.loadPage = function(page) {
      if (page) this.activepage = page;
      this.appMenu.each(function(i) {
        return i.set('active', i.get('name') === page);
      });
      $('.content').empty().append(this.views[this.activepage]);
      $('.appmenu > div').detach();
      return $('.appmenu').append(this.menu);
    };

    return App;

  })();

  SalesApp = (function(_super) {

    __extends(SalesApp, _super);

    function SalesApp() {
      SalesApp.__super__.constructor.apply(this, arguments);
    }

    SalesApp.prototype.name = 'Sales';

    SalesApp.prototype.defaultpage = 'Customers';

    SalesApp.prototype.pages = {
      'Customers': {
        section: 'Sales',
        name: 'Customers'
      },
      'Leads': {
        section: 'Sales',
        name: 'Leads'
      },
      'Opportunities': {
        section: 'Sales',
        name: 'Opportunities'
      },
      'Quotations': {
        section: 'Sales',
        name: 'Quotations'
      },
      'Sale Orders': {
        section: 'Sales',
        name: 'Sale Orders'
      }
    };

    return SalesApp;

  })(App);

  ECommerceApp = (function(_super) {

    __extends(ECommerceApp, _super);

    function ECommerceApp() {
      ECommerceApp.__super__.constructor.apply(this, arguments);
    }

    ECommerceApp.prototype.name = 'eCommerce';

    ECommerceApp.prototype.defaultpage = 'Home';

    ECommerceApp.prototype.pages = {
      'Home': {
        section: 'Shop',
        name: 'Home'
      },
      'Shop': {
        section: 'Shop',
        name: 'Shop'
      },
      'Shopping Cart': {
        section: 'Shop',
        name: 'Shopping Cart'
      },
      'Products': {
        section: 'Products',
        name: 'Products'
      },
      'Product Categories': {
        section: 'Products',
        name: 'Product Categories'
      }
    };

    return ECommerceApp;

  })(App);

  SettingsApp = (function(_super) {

    __extends(SettingsApp, _super);

    function SettingsApp() {
      SettingsApp.__super__.constructor.apply(this, arguments);
    }

    SettingsApp.prototype.name = 'Settings';

    SettingsApp.prototype.defaultpage = 'Apps';

    SettingsApp.prototype.pages = {
      'Apps': {
        section: 'Administration',
        name: 'Apps'
      },
      'Users': {
        section: 'Administration',
        name: 'Users'
      }
    };

    return SettingsApp;

  })(App);

  $(function() {
    window.openerp = new OpenERP();
    return Backbone.history.start({
      pushState: true
    });
  });

}).call(this);
