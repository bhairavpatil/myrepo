require 'spec_helper'

module Api
  module V1
    describe OptionsController do
      context "POST 'create'" do
        let(:survey) { FactoryGirl.create(:survey) }
        let(:question) { FactoryGirl.create(:question) }

        it "creates a new option" do
          option = FactoryGirl.attributes_for(:option)

          expect do
            post :create, :survey_id => survey.id, :question_id => question.id, :option => option
          end.to change { Option.count }.by(1)
        end

        it "responds with json" do
          option_hash = FactoryGirl.attributes_for(:option)
          post :create, :survey_id => survey.id, :question_id => question.id, :option => option_hash
          returned_json = JSON.parse(response.body)
          option_hash.each do |k,v|
            returned_json[k.to_s].should == v
          end
        end
      end
    end
  end
end
