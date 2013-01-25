SurveyBuilder.Views.Dummies ||= {}

# Represents a dummy question on the DOM
class SurveyBuilder.Views.Dummies.QuestionView extends Backbone.View
  ORDER_NUMBER_STEP: 2

  initialize: (model, template) =>
    @model = model
    @template = template
    @model.dummy_view = this
    @can_have_sub_questions = false
    @model.on('change', @render, this)
    @model.on('change:errors', @render, this)

  render: =>
    $(@el).html('<div class="dummy_question_content"><div class="top_level_content"></div></div>') if $(@el).is(':empty')
    @model.set('content', I18n.t('js.untitled_question')) if _.isEmpty(@model.get('content'))
    data = _.extend(@model.toJSON().question, {errors: @model.errors, image_url: @model.get('image_url')})
    data = _(data).extend({question_number: @model.question_number})
    data = _(data).extend({duplicate_url: @model.duplicate_url()})
    $(@el).children('.dummy_question_content').children(".top_level_content").html(Mustache.render(@template, data))
    $(@el).addClass("dummy_question")
    $(@el).find('abbr').show() if @model.get('mandatory')
    $(@el).find('.star').raty({
      readOnly: true,
      number: @model.get('max_length') || 5
    })

    $(@el).children(".dummy_question_content").click (e) =>
      @show_actual(e)

    $(@el).children('.dummy_question_content').children(".top_level_content").children(".delete_question").click (e) => @delete(e)

    return this

  delete: =>
    @model.destroy()

  show_actual: (event) =>
    $(@el).trigger("dummy_click")
    @model.actual_view.show()
    $(@el).children('.dummy_question_content').addClass("active")

  unfocus: =>
    $(@el).children('.dummy_question_content').removeClass("active")

  set_order_number: (last_order_number) =>
    index = $(@el).index()
    @model.set({order_number: last_order_number + (index * @ORDER_NUMBER_STEP)})
    index

  reset_question_number: =>
    index = $(@el).index()
    @model.question_number = index + 1
