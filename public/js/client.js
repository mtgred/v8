(function() {
  var App, AppMenuItemView, AppMenuView, CartView, ECommerceApp, MainMenuItemView, MainMenuView, OpenERP, PageView, Product, ProductView, ProductsView, SalesApp, SettingsApp,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  OpenERP = (function(_super) {

    __extends(OpenERP, _super);

    function OpenERP(options) {
      this.loadPage = __bind(this.loadPage, this);      OpenERP.__super__.constructor.call(this, options);
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
      'app/*param': 'loadPage'
    };

    OpenERP.prototype.apps = {};

    OpenERP.prototype.addApp = function(app) {
      this.mainMenu.add({
        name: app.name,
        active: false
      });
      return this.apps[app.name] = app;
    };

    OpenERP.prototype.loadPage = function(param) {
      var app, args, page, _ref;
      _ref = param.split("/"), app = _ref[0], page = _ref[1], args = 3 <= _ref.length ? __slice.call(_ref, 2) : [];
      if (!page) {
        this.navigate("/app/" + app + "/" + this.apps[app].activepage, {
          trigger: false,
          replace: true
        });
      }
      this.mainMenu.each(function(i) {
        return i.set('active', i.get('name') === app);
      });
      return this.apps[app].navigate(page, args[0]);
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
      return this.model.bind('change', this.render);
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

  PageView = (function(_super) {

    __extends(PageView, _super);

    function PageView() {
      this.searchclear = __bind(this.searchclear, this);
      this.filter = __bind(this.filter, this);
      PageView.__super__.constructor.apply(this, arguments);
    }

    PageView.prototype.template = _.template($('#page-header').html());

    PageView.prototype.initialize = function(page) {
      this.page = page;
    };

    PageView.prototype.events = {
      'keyup .searchbox': 'filter',
      'click .searchclear': 'searchclear'
    };

    PageView.prototype.render = function() {
      var pagetemplate;
      pagetemplate = _.template($("#" + this.page.app + "-" + (this.page.name.replace(/\s/g, ''))).html());
      return $(this.el).html(this.template({
        name: this.page.name
      })).append(pagetemplate());
    };

    PageView.prototype.filter = function() {
      var s;
      s = $('.search').val().toLowerCase();
      if (s) {
        return $('.searchclear').fadeIn('fast');
      } else {
        return this.searchclear();
      }
    };

    PageView.prototype.searchclear = function() {
      $('.searchclear').fadeOut('fast');
      $('.search').val('').focus();
      return this.render();
    };

    return PageView;

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
      return this.model.bind('change', this.render);
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
      var _this = this;
      this.app = app;
      this.sections = {};
      return this.app.appMenu.each(function(p) {
        var s;
        s = p.get('section');
        if (!_this.sections[s]) {
          _this.sections[s] = $(_this.template({
            section: s
          }));
        }
        return _this.sections[s].append((new AppMenuItemView({
          model: p
        })).render());
      });
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
      this.navigate = __bind(this.navigate, this);
      var k, v, _ref;
      this.views = {};
      this.appMenu = new Backbone.Collection;
      _ref = this.pages;
      for (k in _ref) {
        v = _ref[k];
        v.active = false;
        v.counter = 0;
        v.app = this.name;
        this.appMenu.add(v);
        if (!this.views[k]) this.views[k] = (new PageView(v)).render();
      }
      this.menu = (new AppMenuView(this)).render();
      this.navigate(this.defaultpage);
    }

    App.prototype.navigate = function() {
      var args, page,
        _this = this;
      page = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (page) this.activepage = page;
      this.appMenu.each(function(i) {
        return i.set('active', i.get('name') === _this.activepage);
      });
      $('.content > div').detach();
      $('.appmenu > div').detach();
      $('.content').append(this.views[this.activepage]);
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

    ECommerceApp.prototype.name = 'eCommerce';

    ECommerceApp.prototype.defaultpage = 'Shop';

    ECommerceApp.prototype.pages = {
      'Home': {
        section: 'Shop',
        name: 'Home'
      },
      'Shop': {
        section: 'Shop',
        name: 'Shop',
        view: ProductsView
      },
      'Shopping Cart': {
        section: 'Shop',
        name: 'Shopping Cart'
      },
      'Products': {
        section: 'Configuration',
        name: 'Products'
      },
      'Product Categories': {
        section: 'Configuration',
        name: 'Product Categories'
      }
    };

    function ECommerceApp() {
      this.navigate = __bind(this.navigate, this);      this.products = new Backbone.Collection;
      this.products.url = "/data/products";
      this.products.fetch();
      this.cart = new Backbone.Collection;
      ECommerceApp.__super__.constructor.call(this);
      this.views['Shop'] = (new ProductsView({
        collection: this.products,
        category: ""
      })).render();
      this.views['Shopping Cart'] = (new CartView({
        collection: this.cart
      })).render();
    }

    ECommerceApp.prototype.navigate = function() {
      var args, page;
      page = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (page === 'product' && args[0]) {
        this.views[page] = (new ProductView(args[0])).render();
      }
      return ECommerceApp.__super__.navigate.call(this, page, args);
    };

    ECommerceApp.prototype.addToCart = function(product, quantity) {
      var counter;
      this.cart.add({
        qty: quantity,
        product: product
      });
      counter = this.cart.reduce((function(sum, l) {
        return parseInt(l.get('qty')) + sum;
      }), 0);
      return this.appMenu.each(function(i) {
        if (i.get('name') === "Shopping Cart") return i.set('counter', counter);
      });
    };

    return ECommerceApp;

  })(App);

  ProductsView = (function(_super) {

    __extends(ProductsView, _super);

    function ProductsView() {
      this.render = __bind(this.render, this);
      ProductsView.__super__.constructor.apply(this, arguments);
    }

    ProductsView.prototype.className = 'galleryView';

    ProductsView.prototype.headerTemplate = _.template($('#page-header').html());

    ProductsView.prototype.galleryTemplate = _.template($('#gallery-view').html());

    ProductsView.prototype.initialize = function() {
      if (!this.category) this.category = "Shop";
      return this.collection.bind('reset', this.render);
    };

    ProductsView.prototype.events = {
      'click': 'navigate'
    };

    ProductsView.prototype.render = function() {
      return $(this.el).html(this.headerTemplate({
        name: this.category
      })).append(this.galleryTemplate({
        products: this.collection.toJSON()
      }));
    };

    ProductsView.prototype.navigate = function(e) {
      var t;
      e.preventDefault();
      t = e.srcElement.pathname ? e.srcElement.pathname : $(e.srcElement).parent().attr('href');
      return openerp.navigate(t, {
        trigger: true
      });
    };

    return ProductsView;

  })(Backbone.View);

  Product = (function(_super) {

    __extends(Product, _super);

    function Product() {
      Product.__super__.constructor.apply(this, arguments);
    }

    Product.prototype.urlRoot = '/data/products';

    return Product;

  })(Backbone.Model);

  ProductView = (function(_super) {

    __extends(ProductView, _super);

    function ProductView() {
      this.addToCart = __bind(this.addToCart, this);
      this.render = __bind(this.render, this);
      ProductView.__super__.constructor.apply(this, arguments);
    }

    ProductView.prototype.className = 'pageView';

    ProductView.prototype.headerTemplate = _.template($('#page-header').html());

    ProductView.prototype.pageTemplate = _.template($('#page-view').html());

    ProductView.prototype.initialize = function(name) {
      this.model = new Product({
        id: name
      });
      this.model.bind('change', this.render);
      return this.model.fetch();
    };

    ProductView.prototype.events = {
      'click .addtocart': 'addToCart'
    };

    ProductView.prototype.render = function() {
      return $(this.el).html(this.headerTemplate({
        name: "Shop / " + (this.model.get('category')) + " / " + (this.model.get('name'))
      })).append(this.pageTemplate({
        product: this.model.toJSON()
      }));
    };

    ProductView.prototype.addToCart = function() {
      return openerp.apps['eCommerce'].addToCart(this.model, $('.quantity').val());
    };

    return ProductView;

  })(Backbone.View);

  CartView = (function(_super) {

    __extends(CartView, _super);

    function CartView() {
      this.render = __bind(this.render, this);
      CartView.__super__.constructor.apply(this, arguments);
    }

    CartView.prototype.className = 'cart';

    CartView.prototype.headerTemplate = _.template($('#page-header').html());

    CartView.prototype.cartTemplate = _.template($('#ShoppingCart').html());

    CartView.prototype.initialize = function() {
      this.collection.bind('reset', this.render);
      return this.collection.bind('add', this.render);
    };

    CartView.prototype.events = {
      'click': 'navigate'
    };

    CartView.prototype.render = function() {
      return $(this.el).html(this.headerTemplate({
        name: "Shopping Cart"
      })).append(this.cartTemplate({
        cart: this.collection.toJSON()
      }));
    };

    CartView.prototype.navigate = function(e) {
      var t;
      e.preventDefault();
      t = e.srcElement.pathname ? e.srcElement.pathname : $(e.srcElement).parent().attr('href');
      return openerp.navigate(t, {
        trigger: true
      });
    };

    return CartView;

  })(Backbone.View);

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
