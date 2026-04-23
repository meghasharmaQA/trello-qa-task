🧪 Trello Automation using Playwright

This project is an end-to-end UI automation framework built using Playwright with Node.js. It automates Trello workflows such as login, board creation, list management, card movement, and validations as part of a QA Engineer assignment.

🚀 Tech Stack

- Node.js
- Playwright
- JavaScript / TypeScript
- Git & GitHub

📁 Project Structure

tests/                # Test cases  
playwright.config.ts  # Playwright configuration  
test-results/         # Execution results (ignored in Git)  
playwright-report/    # HTML reports (ignored in Git)  
.env                  # Environment variables (ignored in Git)

⚙️ Setup Instructions

1. Clone Repository

 git clone https://github.com/meghasharmaQA/trello-qa-task
 cd trello-qa-task 

2. Install Dependencies

 npm install

3. Install Playwright Browsers

 npx playwright install

4. Create .env file

 TRELLO_EMAIL=your_email@example.com  
 TRELLO_PASSWORD=your_password

5. Run Tests

 npx playwright test

6. View HTML Report

 npx playwright show-report

📦 Features Automated

* Login to Trello
* Create Board with timestamp
* Create Lists (To Do, In Progress, Done)
* Create Cards
* Move Card across lists
* Validate final board structure
* Basic assertions

🚫 Ignored Files

* node_modules/
* playwright-report/
* test-results/
* .env

🧠 Key Learnings

* End-to-end UI automation
* Playwright framework usage
* Test assertions and waits
* GitHub project management
* QA workflow automation

👩‍💻 Author

Megha Sharma

QA Automation Engineer

📌 Note

This project was created as part of a QA Engineer automation assignment.
