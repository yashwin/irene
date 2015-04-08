`import Ember from 'ember';`
`import Notify from 'ember-notify';`
`import serialize from 'irene/utils/serialize';`
`import ENV from 'irene/config/environment';`

GCSUploader = Ember.Uploader.extend
  ###
  #  Url used to request a signed upload url
  #  @property url
  ###

  url: null
  ajax: (url, params, method, headers) ->
    self = @
    settings =
      url: url
      type: method
      contentType: false
      processData: false
      xhrFields:
        withCredentials: false
      beforeSend: (xhr) ->
        for p of headers
          if headers.hasOwnProperty p
            xhr.setRequestHeader p, headers[p]
      xhr: ->
        xhr = Ember.$.ajaxSettings.xhr()
        xhr.upload.onprogress = (e) ->
          self.didProgress e
        self.one 'isAborting', -> xhr.abort()
        xhr
      data: params
    @_ajax settings

  sign: (file) ->
    self = @
    new Ember.RSVP.Promise (resolve, reject) ->
      settings =
        url: self.get 'url'
        type: 'GET'
        contentType: 'json'
        data:
          # content_type: file.type
          # We are asssuming only apps will be uploaded by octet stream.
          content_type: "application/octet-stream"

      self._ajax settings
      .then (json)->
        resolve json
      , ->
        Notify.error "Server failed to return Signed URL"
        reject()


  upload: (file, extra={}) ->
    self = @

    @set 'isUploading', true

    @sign file
      .then (json) ->
        url  = json.base_url  # "#{json.base_url}?#{serialize json.query_params}"
        self.set "isUploading", true

        self.ajax(url, file, "PUT", json.headers)
          .then (respData) ->
            debugger
            Notify.success "File Uploaded Successfully. Please wait while we process your file."
            respData
          , (xhr)->
            if xhr.status is 200
              Notify.success "File Uploaded Successfully. Please wait while we process your file."
              self.didUpload json.file_key, json.file_key_signed

      , ->
        Notify.error "Error While signing the file."
        debugger
`export default GCSUploader;`
