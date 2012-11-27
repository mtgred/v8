class OpenERP extends Backbone.Router
  constructor: (options) ->
    super(options)
    @mainMenu = new Backbone.Collection
    @mainMenuView = new MainMenuView(collection: @mainMenu)
    @addApp(new SalesApp)
    @addApp(new ECommerceApp)
    @addApp(new SettingsApp)
  login: ->
  logout: ->
  routes: 'app/*param': 'loadPage'
  apps: {}
  addApp: (app) ->
    @mainMenu.add({name: app.name, active: false})
    @apps[app.name] = app
  loadPage: (param) =>
    [app, page, args...] = param.split("/")
    @navigate("/app/#{app}/#{@apps[app].activepage}", trigger: false, replace: true) unless page
    @mainMenu.each (i) -> i.set('active', i.get('name') is app)
    @apps[app].navigate(page, args)

# Main menu
class MainMenuItemView extends Backbone.View
  className: 'menuItem'
  template: _.template $('#mainmenu-item').html()
  initialize: -> @model.bind('change', @render)
  events: 'click': 'navigate'
  render: => $(@el).html(@template @model.toJSON())
  navigate: (e) ->
    e.preventDefault()
    openerp.navigate(e.srcElement.pathname, trigger: true)

class MainMenuView extends Backbone.View
  className: 'mainMenu'
  initialize: ->
    @collection.bind('add', @addItem)
    @collection.bind('reset', @render)
    $('.navbar').prepend(@el)
  addItem: (item) => $(@el).append((new MainMenuItemView model: item).render())
  render: ->
    $(@el).empty()
    @collection.each (i) => @addItem(i)

# Apps
class PageView extends Backbone.View
  template: _.template $('#page-header').html()
  initialize: (@page) ->
  events:
    'keyup .searchbox': 'filter'
    'click .searchclear': 'searchclear'
  render: ->
    pagetemplate = _.template $("##{@page.app}-#{@page.name.replace(/\s/g, '')}").html()
    $(@el).html(@template(name: @page.name)).append(pagetemplate())
  filter: =>
    s = $('.search').val().toLowerCase()
    if s
      #$(@el).find('> ul').empty()
      #@addUser(u) for u in @collection.filter (u) -> ~u.get('name').toLowerCase().indexOf(s)
      $('.searchclear').fadeIn('fast')
    else
      @searchclear()
  searchclear: =>
    $('.searchclear').fadeOut('fast')
    $('.search').val('').focus()
    @render()

class AppMenuItemView extends Backbone.View
  className: 'appMenuItem'
  template: _.template $('#appmenu-item').html()
  initialize: -> @model.bind('change', @render)
  events: 'click': 'navigate'
  render: => $(@el).html(@template @model.toJSON())
  navigate: (e) ->
    e.preventDefault()
    openerp.navigate($(@el).find('a').attr('href'), trigger: true)

class AppMenuView extends Backbone.View
  template: _.template $('#appmenu-section').html()
  initialize: (@app) ->
    @sections = {}
    @app.appMenu.each (p) =>
      s = p.get('section')
      @sections[s] = $(@template(section: s)) unless @sections[s]
      @sections[s].append (new AppMenuItemView(model: p)).render()
  render: ->
    $(@el).append(v) for k, v of @sections
    @el

class App
  constructor: ->
    @views = {}
    @appMenu = new Backbone.Collection
    for k, v of @pages
      v.active = false
      v.app = @name
      @appMenu.add(v)
      @views[k] = (new PageView(v)).render()
    @menu = (new AppMenuView(@)).render()
    @navigate(@defaultpage)
  navigate: (page, arg...) ->
    @activepage = page if page
    @appMenu.each (i) => i.set('active', i.get('name') is @activepage)
    $('.content > div').detach()
    $('.appmenu > div').detach()
    $('.content').append(@views[@activepage])
    $('.appmenu').append(@menu)

class SalesApp extends App
  name: 'Sales'
  defaultpage: 'Customers'
  pages:
    'Customers': {section: 'Sales', name: 'Customers'}
    'Leads': {section: 'Sales', name: 'Leads'}
    'Opportunities': {section: 'Sales', name: 'Opportunities'}
    'Quotations': {section: 'Sales', name: 'Quotations'}
    'Sale Orders': {section: 'Sales', name: 'Sale Orders'}

# eEcommerce
class ECommerceApp extends App
  name: 'eCommerce'
  defaultpage: 'Shop'
  pages:
    'Home': {section: 'Shop', name: 'Home'}
    'Shop': {section: 'Shop', name: 'Shop', view: ProductsView}
    'Shopping Cart': {section: 'Shop', name: 'Shopping Cart'}
    'Products': {section: 'Configuration', name: 'Products'}
    'Product Categories': {section: 'Configuration', name: 'Product Categories'}
  constructor: ->
    super()
    @views['Shop'] = (new ProductsView).render()

class ProductsView extends Backbone.View
  className: 'galleryView'
  headerTemplate: _.template $('#page-header').html()
  galleryTemplate: _.template $('#gallery-View').html()
  initialize: (@category) ->
    @category = "Shop" unless @category
    @collection = new Backbone.Collection
    @collection.url = "/data/products"
    @collection.bind('reset', @render)
    @collection.fetch()
  events: 'click': 'navigate'
  render: =>
    $(@el).html(@headerTemplate(name: @category)).append(@galleryTemplate {products: @collection.toJSON()})
  navigate: (e) ->
    e.preventDefault()
    openerp.navigate($(@el).find('a').attr('href'), trigger: true)

# Settings
class SettingsApp extends App
  name: 'Settings'
  defaultpage: 'Apps'
  pages:
    'Apps': {section: 'Administration', name: 'Apps'}
    'Users': {section: 'Administration', name: 'Users'}

$ ->
  window.openerp = new OpenERP()
  Backbone.history.start(pushState: true)
