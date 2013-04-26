class Reports::Excel::Job < Struct.new(:excel_data)
  def perform
    directory = aws_excel_directory
    directory.files.create(:key => excel_data.file_name, :body => package.to_stream, :public => true)
  end

  # REFACTOR: Use a `sheet` abstraction which internally adds all its rows to a AXSLX worksheet
  # REFACTOR: Use a `style` abstraction
  def package
    return if excel_data.responses.empty?
    Axlsx::Package.new do |p|
      wb = p.workbook
      bold_style = wb.styles.add_style sz: 12, b: true, alignment: { horizontal: :center }
      border = wb.styles.add_style border: { style: :thin, color: '000000' }
      questions = excel_data.survey.questions_in_order.map(&:reporter)
      wb.add_worksheet(name: "Responses") do |sheet|
        headers = Reports::Excel::Row.new("Response No.")
        headers << questions.map(&:header)
        headers << metadata_headers
        sheet.add_row headers.to_a, :style => bold_style
        excel_data.responses.each_with_index do |response, i|
          response_answers =  Answer.where(:response_id => response[:id])
          .order('answers.record_id')
          .includes(:choices => :option).all
          answers_row = Reports::Excel::Row.new(i + 1)
          answers_row << questions.map do |question|
            question_answers = response_answers.find_all { |a| a.question_id == question.id }
            question.formatted_answers_for(question_answers, :server_url => excel_data.server_url)
          end
          answers_row << metadata_for(response)
          sheet.add_row answers_row.to_a, style: border
        end
      end
    end
  end

  def metadata_headers
    ["Added By", "Organization", "Last updated at", "Address", "IP Address", "State"]
  end

  # REFACTOR: Move these three methods to a ResponseReporter
  def metadata_for(response)
    [excel_data.user_name_for(response.user_id), excel_data.organization_name_for(response.organization_id), response.last_update,
      response.location, response.ip_address, response.state]
  end

  def error(job, exception)
    Airbrake.notify(exception)
  end

  private

  def aws_excel_directory
    connection = Fog::Storage.new(:provider => "AWS",
                                  :aws_secret_access_key => ENV['S3_SECRET'],
                                  :aws_access_key_id => ENV['S3_ACCESS_KEY'])
    connection.directories.get('surveywebexcel')
  end
end