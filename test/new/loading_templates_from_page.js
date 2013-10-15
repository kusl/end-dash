_ = require('underscore')
  , expect = require("expect.js")
  , jsdom = require("jsdom")
  , Backbone = require("backbone")
  , EndDash = require('../../lib/end-dash')
  , util = require("../util")

describe('With EndDash loaded on a page', function(){
  beforeEach(function() {
    var html =  '<div> This is the main body </div>' +
                  '<script type="EndDash" name="testing">' +
                    ' <div class="test"></div>' +
                  '</script>'
        , $ = window.$
    window.document.body.innerHTML = html
    EndDash.clearAndReload()
  })

  describe("loading EndDash on a page with scripts of type EndDash", function() {
    it("should cause EndDash to store the templates with the right name", function() {
      var TemplateClass = EndDash.getTemplate("testing")
      var template = new TemplateClass({name: "Drake"})
      expect(util.outerHTML(template.el)).to.be('<div class="test"></div>')
    })
  })

  describe("With no EndDash templates on the page", function(){
    beforeEach(function(){
      var html =  '<div> This is the main body </div>'
      window.document.body.innerHTML = html
    })

    it(" creating EndDash should not break anything", function(){
      EndDash.clearAndReload()
    })
  })

  describe("Loading new html onto the page and refreshing EndDash", function() {
    beforeEach(function() {
      var html = '<script type="EndDash" name="helloWorld">' +
                ' <div class="name-"></div>' +
                '</script>'
      window.document.body.innerHTML = html
      EndDash.clearAndReload()
    })

    it("EndDash should have the new templates but not the old templates", function() {
      expect(EndDash.isTemplateLoaded("testing")).to.be(false)
      expect(util.outerHTML(EndDash.bindTemplate("helloWorld", {name: "Jay-Z"}).el)).to.be('<div class="name-">Jay-Z</div>')
    })
  })

  describe('Binding EndDash to a model on the page should still work', function() {
    beforeEach(function() {
      var html = '<script type="EndDash" name="helloWorld">' +
                ' <div class="name-"></div>' +
                '</script>'
      window.document.body.innerHTML = html
      EndDash.clearAndReload()
    })

    it("EndDash should return a template with the model passed in bound to the DOM elements", function() {
      var model = new Backbone.Model({name: "Devon"})
      var template = EndDash.bindTemplate("helloWorld", model)
      $("body").html(template.template)
      expect($($('.name-')).text()).to.be("Devon")
      model.set("name", "Brian")
      expect($($('.name-')).text()).to.be("Brian")
    })
  })
})

