`import Ember from 'ember'`
`import ENV from 'irene/config/environment';`

FileHeaderComponent = Ember.Component.extend

  globalAlpha:0.4
  radiusRatio:0.9

  didInsertElement: ->
    clipboard = new Clipboard('.copy-password')
    that = @
    clipboard.on 'success', ->
      that.get("notify").info "Password Copied!"
    clipboard.on 'error', ->
      that.get("notify").error "Failed, please try again"

  actions:
    getPDFReportLink: ->
      that = @
      file_id = @get "file.id"
      url = [ENV.endpoints.signedPdfUrl, file_id].join '/'
      @get("ajax").request url
      .then (result) ->
        window.open result.url
      .catch (error) ->
        that.get("notify").error "Please wait while the report is getting generated"
        for error in error.errors
          that.get("notify").error error.detail?.message

    requestManual: ->
      that = @
      file_id = @get "file.id"
      url = [ENV.endpoints.manual, file_id].join '/'
      @get("ajax").request url
      .then (result) ->
        that.get("notify").info "Manual assessment requested."
      .catch (error) ->
        for error in error.errors
          that.get("notify").error error.detail?.message

`export default FileHeaderComponent`
