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
  routes:
    'app/:app': 'loadApp'
    'app/:app/:page': 'loadApp'
  apps: {}
  addApp: (app) ->
    @mainMenu.add({name: app.name, active: false})
    @apps[app.name] = app
  loadApp: (app, page) =>
    @mainMenu.each (i) -> i.set('active', i.get('name') is app)
    @apps[app].loadPage(page)

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
class PageHeaderView extends Backbone.View
  template: _.template $('#page-header').html()
  initialize: (@page) ->
  events:
    'keyup .searchbox': 'filter'
    'click .searchclear': 'searchclear'
  render: ->
    $(@el).html(@template(name: @page.name))
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
      @views[k] = (new PageHeaderView(v)).render()
    @menu = (new AppMenuView(@)).render()
    @loadPage(@defaultpage)
  loadPage: (page) ->
    @activepage = page if page
    @appMenu.each (i) => i.set('active', i.get('name') is @activepage)
    $('.content').empty().append(@views[@activepage])
    $('.appmenu > div').detach()
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

class ECommerceApp extends App
  name: 'eCommerce'
  defaultpage: 'Home'
  pages:
    'Home': {section: 'Shop', name: 'Home'}
    'Shop': {section: 'Shop', name: 'Shop'}
    'Shopping Cart': {section: 'Shop', name: 'Shopping Cart'}
    'Products': {section: 'Products', name: 'Products'}
    'Product Categories': {section: 'Products', name: 'Product Categories'}

class SettingsApp extends App
  name: 'Settings'
  defaultpage: 'Apps'
  pages:
    'Apps': {section: 'Administration', name: 'Apps'}
    'Users': {section: 'Administration', name: 'Users'}

$ ->
  window.openerp = new OpenERP()
  Backbone.history.start(pushState: true)
