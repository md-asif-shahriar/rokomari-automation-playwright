pipeline {
  agent any

  tools {
    nodejs 'Node 21' // Name from your Global Tool Config
  }

  environment {
    EMAIL = credentials('your-email-secret-id')    // store these in Jenkins Credentials
    PASSWORD = credentials('your-password-secret-id')
    USERNM = credentials('your-username-secret-id')
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/YOUR_USERNAME/YOUR_REPO.git', branch: 'main'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        sh 'npx playwright install'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        sh 'npx playwright test tests/example2.spec.js'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
    }
  }
}
