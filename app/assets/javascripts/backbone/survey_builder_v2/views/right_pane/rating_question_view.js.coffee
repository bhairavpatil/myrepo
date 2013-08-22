##= require ./question_view

class SurveyBuilderV2.Views.RightPane.RatingQuestionView extends SurveyBuilderV2.Views.RightPane.QuestionView
  events:
    "change .question-answer-type-select": "updateView"
    "click .question-settings input": "updateModelSettings"
    "click .question-update": "saveQuestion"

  initialize: (attributes) =>
    @template = SMT["v2_survey_builder/surveys/right_pane/rating_question"]
    super(attributes)

  updateModelContent: (event) =>
    content = $(event.target).val()
    @model.set(content: content)

  updateView: (event) =>
    SurveyBuilderV2.Views.AnswerTypeSwitcher.switch("RatingQuestion", event, @leftPaneView, @model.dup())

