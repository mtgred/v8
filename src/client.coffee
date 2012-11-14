class OpenERP extends Backbone.Router
  constructor: (options) ->
    super(options)
    @mainMenu = new Backbone.Collection
    @secondaryMenu = new Backbone.Collection
    @mainMenuView = new MainMenuView(collection: @mainMenu)
    @addApp(new SalesApp)
    @addApp(new ECommerceApp)
    @addApp(new SettingsApp)
  login: ->
  logout: ->
  routes:
    'app/:app': 'loadApp'
  apps: {}
  addApp: (app) ->
    @mainMenu.add({name: app.name, active: false})
    @apps[app.name] = app
  loadApp: (app) =>
    @mainMenu.each (i) -> i.set('active', i.get('name') is app)
    $('.content').html(@apps[app].view)

# Main menu
class MainMenuItemView extends Backbone.View
  className: 'menuItem'
  template: _.template $('#mainmenu-item').html()
  initialize: -> @model.bind('all', @render)
  events: 'click': 'navigate'
  render: => $(@el).html(@template @model.toJSON())
  navigate: (e) ->
    e.preventDefault()
    openerp.navigate($(@el).find('a').attr('href'), trigger: true)

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

class SecondaryMenuView extends Backbone.View

# Apps
class SalesApp
  name: 'Sales'
  constructor: ->
    @view = (new SalesAppView).render()

class SalesAppView extends Backbone.View
  template: _.template $('#sales-app').html()
  initialize: ->
  render: ->
    $(@el).html(@template name: 'Sales')

class ECommerceApp extends Backbone.View
  name: 'eCommerce'
  constructor: ->
    @view = (new ECommerceAppView).render()

class ECommerceAppView extends Backbone.View
  template: _.template $('#ecommerce-app').html()
  initialize: ->
  render: ->
    $(@el).html(@template name: 'eCommerce')

class SettingsApp extends Backbone.View
  name: 'Settings'
  constructor: ->
    @view = (new SettingsAppView).render()

class SettingsAppView extends Backbone.View
  template: _.template $('#settings-app').html()
  initialize: ->
  render: ->
    $(@el).html(@template name: 'Settings')

$ ->
  window.openerp = new OpenERP()
  Backbone.history.start(pushState: true)

