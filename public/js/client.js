(function() {
  var ECommerceApp, ECommerceAppView, MainMenuItemView, MainMenuView, OpenERP, SalesApp, SalesAppView, SecondaryMenuView, SettingsApp, SettingsAppView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  OpenERP = (function(_super) {

    __extends(OpenERP, _super);

    function OpenERP(options) {
      this.loadApp = __bind(this.loadApp, this);      OpenERP.__super__.constructor.call(this, options);
      this.mainMenu = new Backbone.Collection;
      this.secondaryMenu = new Backbone.Collection;
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
      'app/:app': 'loadApp'
    };

    OpenERP.prototype.apps = {};

    OpenERP.prototype.addApp = function(app) {
      this.mainMenu.add({
        name: app.name,
        active: false
      });
      return this.apps[app.name] = app;
    };

    OpenERP.prototype.loadApp = function(app) {
      this.mainMenu.each(function(i) {
        return i.set('active', i.get('name') === app);
      });
      return $('.content').html(this.apps[app].view);
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
      return openerp.navigate($(this.el).find('a').attr('href'), {
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

  SecondaryMenuView = (function(_super) {

    __extends(SecondaryMenuView, _super);

    function SecondaryMenuView() {
      SecondaryMenuView.__super__.constructor.apply(this, arguments);
    }

    return SecondaryMenuView;

  })(Backbone.View);

  SalesApp = (function() {

    SalesApp.prototype.name = 'Sales';

    function SalesApp() {
      this.view = (new SalesAppView).render();
    }

    return SalesApp;

  })();

  SalesAppView = (function(_super) {

    __extends(SalesAppView, _super);

    function SalesAppView() {
      SalesAppView.__super__.constructor.apply(this, arguments);
    }

    SalesAppView.prototype.template = _.template($('#sales-app').html());

    SalesAppView.prototype.initialize = function() {};

    SalesAppView.prototype.render = function() {
      return $(this.el).html(this.template({
        name: 'Sales'
      }));
    };

    return SalesAppView;

  })(Backbone.View);

  ECommerceApp = (function(_super) {

    __extends(ECommerceApp, _super);

    ECommerceApp.prototype.name = 'eCommerce';

    function ECommerceApp() {
      this.view = (new ECommerceAppView).render();
    }

    return ECommerceApp;

  })(Backbone.View);

  ECommerceAppView = (function(_super) {

    __extends(ECommerceAppView, _super);

    function ECommerceAppView() {
      ECommerceAppView.__super__.constructor.apply(this, arguments);
    }

    ECommerceAppView.prototype.template = _.template($('#ecommerce-app').html());

    ECommerceAppView.prototype.initialize = function() {};

    ECommerceAppView.prototype.render = function() {
      return $(this.el).html(this.template({
        name: 'eCommerce'
      }));
    };

    return ECommerceAppView;

  })(Backbone.View);

  SettingsApp = (function(_super) {

    __extends(SettingsApp, _super);

    SettingsApp.prototype.name = 'Settings';

    function SettingsApp() {
      this.view = (new SettingsAppView).render();
    }

    return SettingsApp;

  })(Backbone.View);

  SettingsAppView = (function(_super) {

    __extends(SettingsAppView, _super);

    function SettingsAppView() {
      SettingsAppView.__super__.constructor.apply(this, arguments);
    }

    SettingsAppView.prototype.template = _.template($('#settings-app').html());

    SettingsAppView.prototype.initialize = function() {};

    SettingsAppView.prototype.render = function() {
      return $(this.el).html(this.template({
        name: 'Settings'
      }));
    };

    return SettingsAppView;

  })(Backbone.View);

  $(function() {
    window.openerp = new OpenERP();
    return Backbone.history.start({
      pushState: true
    });
  });

}).call(this);
