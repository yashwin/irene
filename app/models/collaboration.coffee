`import DS from 'ember-data'`
`import BaseModelMixin from 'irene/mixins/base-model'`
`import ENUMS from 'irene/enums'`

Collaboration = DS.Model.extend BaseModelMixin,

  project : DS.belongsTo 'project', inverse: 'collaborations'
  user : DS.belongsTo 'user', inverse: 'collaboration'
  role : DS.attr 'number'

`export default Collaboration`
