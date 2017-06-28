`import Ember from 'ember'`
`import ENV from 'irene/config/environment'`

TeamMemberComponent = Ember.Component.extend

  tagName: ["tr"]

  actions:

    removeMember: ->
      teamMember = @get "user.username"
      deletedMember = prompt "Enter the username which you want to delete ", ""
      if deletedMember is null
        return
      else if deletedMember isnt teamMember
        return @get("notify").error "Enter the right username to delete it"
      teamId = 1
      url = [ENV.endpoints.teams, teamId].join '/'
      that = @
      data =
        identification: teamMember
      @get("ajax").delete url, data: data
      .then (data)->
        that.get("notify").success "Team member #{teamMember} has been deleted successfully"
      .catch (error) ->
        that.get("notify").error error.payload.message
        for error in error.errors
          that.get("notify").error error.detail?.message


`export default TeamMemberComponent`
