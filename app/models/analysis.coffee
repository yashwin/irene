`import DS from 'ember-data'`
`import ENUMS from 'irene/enums'`
`import { translationMacro as t } from 'ember-i18n'`


Analysis = DS.Model.extend
  i18n: Ember.inject.service()
  file: DS.belongsTo 'file', inverse: 'analyses'
  findings: DS.attr()
  attachments: DS.hasMany 'attachment'
  analiserVersion: DS.attr 'number'
  risk: DS.attr 'number'
  status: DS.attr 'number'
  vulnerability: DS.belongsTo 'vulnerability'
  cvssBase: DS.attr 'number'
  cvssVector: DS.attr 'string'
  cvssVersion: DS.attr 'number'
  cvssMetricsHumanized: DS.attr()
  owasp: DS.hasMany 'owasp'

  hascvccBase: Ember.computed.equal 'cvssVersion', 3

  tScanning: t("scanning")
  tNone: t("none")
  tLow: t("low")
  tMedium: t("medium")
  tHigh: t("high")
  tCritical: t("critical")

  isScanning: ( ->
    risk = @get "risk"
    risk is ENUMS.RISK.UNKNOWN
  ).property "risk"

  hasType: (type) ->
    types = @get "vulnerability.types"
    if Ember.isEmpty types
      return false
    type in types

  isRisky: (->
    risk = @get "risk"
    risk not in [ENUMS.RISK.NONE, ENUMS.RISK.UNKNOWN]
  ).property "risk"

  iconClass: (->
    switch @get "risk"
      when ENUMS.RISK.UNKNOWN then "fa-spinner fa-spin"
      when ENUMS.RISK.NONE then "fa-check"
      when ENUMS.RISK.CRITICAL, ENUMS.RISK.HIGH, ENUMS.RISK.LOW, ENUMS.RISK.MEDIUM  then "fa-warning"
  ).property "risk"

  labelClass:( ->
    cls = 'tag'
    switch @get "risk"
      when ENUMS.RISK.UNKNOWN then "#{cls} is-progress"
      when ENUMS.RISK.NONE then "#{cls} is-success"
      when ENUMS.RISK.LOW then "#{cls} is-info"
      when ENUMS.RISK.MEDIUM then "#{cls} is-warning"
      when ENUMS.RISK.HIGH then "#{cls} is-danger"
      when ENUMS.RISK.CRITICAL then "#{cls} is-critical"
  ).property "risk"

  riskText:( ->
    tScanning = @get "tScanning"
    tNone = @get "tNone"
    tLow = @get "tLow"
    tMedium = @get "tMedium"
    tHigh = @get "tHigh"
    tCritical = @get "tCritical"

    switch @get "risk"
      when ENUMS.RISK.UNKNOWN then tScanning
      when ENUMS.RISK.NONE then tNone
      when ENUMS.RISK.LOW then tLow
      when ENUMS.RISK.MEDIUM then tMedium
      when ENUMS.RISK.HIGH then tHigh
      when ENUMS.RISK.CRITICAL then tCritical
  ).property "risk"

  categories: (->
    OWASPMap = {
      "1_2013": "Improper Platform Usage", "2_2013": "Insecure Data Storage", "3_2013": "Insecure Communication", "4_2013": "Insecure Authentication",
      "5_2013": "Insufficient Cryptography", "6_2013": "Insecure Authorization", "7_2013": "Client Code Quality", "8_2013": "Code Tampering",
      "9_2013": "Reverse Engineering", "10_2013": "Extraneous Functionality", "11_2013": "Injection", "12_2013": "Broken Authentication and Session Management",
      "13_2013": "Cross Site Scripting", "14_2013": "IDOR", "15_2013": "Security Misconfiguration", "16_2013": "Sensitive Data Exposure",
      "17_2013": "Missing function ACL", "18_2013": "CSRF", "19_2013": "Using components with known vulns", "20_2013": "Unvalidated Redirects"
    }
    owaspCategories = @get "owasp"
    return [] if owaspCategories is undefined
    categories = []
    for owaspCategory in owaspCategories
      initialKey = "M"
      if owaspCategory > ENUMS.OWASP_CATEGORIES.M10_2013
        initialKey = "A"
      OWASPDict =
        key: "#{initialKey}#{owaspCategory.split("_")[0]}"
        description: OWASPMap[owaspCategory]
      categories.push OWASPDict
    categories
  ).property "owasp"

`export default Analysis`
