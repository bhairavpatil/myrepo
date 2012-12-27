require 'spec_helper'

describe Category do
  it { should have_many(:questions).dependent(:destroy) }
  it { should have_many(:categories).dependent(:destroy) }
  it { should belong_to(:parent).class_name(Option) }
  it { should belong_to :category }
  it { should belong_to :survey }
  it { should respond_to :content }
  it { should respond_to :order_number }

  it { should validate_presence_of :content }
  it { should allow_mass_assignment_of :content }
  it { should allow_mass_assignment_of :survey_id }
  it { should allow_mass_assignment_of :category_id }
  it { should allow_mass_assignment_of :parent_id }
  it { should allow_mass_assignment_of :order_number }

  it "fetches all it's sub-questions and sub-categories in order" do
    question = FactoryGirl.create :question, :order_number => 0
    category = FactoryGirl.create :category, :order_number => 1
    another_question = FactoryGirl.create :question, :order_number => 2
    category.questions << question
    category.categories << category
    category.questions << another_question
    category.elements.should == [question, category, another_question]
  end

  it "returns it's parent question" do
    question = DropDownQuestion.create({content: "Untitled question", survey_id: 18, order_number: 0})
    option = Option.create(content: "Option", order_number: 0)
    nested_category = FactoryGirl.create :category
    question.options << option
    option.categories << nested_category
    nested_category.parent_question.should == question
  end

  it "knows if it (or one of it's parent categories) is a sub-question" do
    question = DropDownQuestion.create({content: "Untitled question", survey_id: 18, order_number: 0})
    option = Option.create(content: "Option", order_number: 0)
    nested_category = FactoryGirl.create :category
    second_level_category = FactoryGirl.create :category
    third_level_category = FactoryGirl.create :category
    question.options << option
    option.categories << nested_category
    nested_category.categories << second_level_category
    second_level_category.categories << third_level_category
    second_level_category.sub_question?.should be_true
    third_level_category.sub_question?.should be_true
    FactoryGirl.create(:category).sub_question?.should be_false
  end
end