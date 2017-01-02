`import Ember from 'ember'`
`import ENUMS from 'irene/enums';`
`import ENV from 'irene/config/environment';`
`import deviceSelection from 'irene/utils/device-selection'`

ProjectPreferencesComponent = Ember.Component.extend

  project: null
  selectVersion: 0
  store: Ember.inject.service()
  deviceTypes: ENUMS.DEVICE_TYPE.CHOICES[0...-1]
  selectedDeviceType: ENUMS.DEVICE_TYPE.NO_PREFERENCE


  devices: (->
    store = @get "store"
    store.findAll "device"
  ).property()

  availableDevices: Ember.computed.filter 'devices', (device) ->
    device.get("platform") is @get("project.platform")

  filteredDevices: Ember.computed "availableDevices", "selectedDeviceType", ->
    availableDevices = @get "availableDevices"
    selectedDeviceType = @get "selectedDeviceType"
    availableDevices.filter (device) ->
      switch selectedDeviceType
        when ENUMS.DEVICE_TYPE.NO_PREFERENCE
          true
        when ENUMS.DEVICE_TYPE.TABLET_REQUIRED
          device.get "isTablet"
        when ENUMS.DEVICE_TYPE.PHONE_REQUIRED
          !device.get "isTablet"

  uniqueDevices: Ember.computed.uniqBy "filteredDevices", 'version'

  actions:
    selectVersion: ->
      @set "selectVersion", parseInt @$('select').val()

    selectDeviceType: ->
      @set "selectedDeviceType", parseInt @$('select').val()

    versionSelected: ->
      selectedDeviceType = @get "selectedDeviceType"
      selectVersion = @get "selectVersion"
      projectId = @get "project.id"
      devicePreferences = [ENV.endpoints.devicePreferences, projectId].join '/'
      that = @
      data =
        selectedDeviceType: selectedDeviceType
        selectVersion: selectVersion
      @get("ajax").post devicePreferences, data: data
      .then (data) ->
        that.get("notify").success "You have sucessfully selected the device"
      .catch (error) ->
        that.get("notify").error "failed"
        if Ember.isEmpty error?.errors
          return
        for error in error.errors
          that.get("notify").error error.detail?.message

`export default ProjectPreferencesComponent`
