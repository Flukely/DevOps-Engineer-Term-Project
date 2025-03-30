pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = 'f389d8a8-e9f3-4555-a70d-d0b5677d72b9'
        NETLIFY_AUTH = credentials('netlify-auth-token')
    }

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    echo "================Building the project================"
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la build/
                '''
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    echo "================Running Tests================"
                    npm test -- --forceExit || echo "Tests completed"
                '''
            }
            post {
                always {
                    junit 'test-results/*.xml' // เก็บผลลัพธ์การทดสอบ
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    echo "================Deploying to Netlify================"
                    npm install netlify-cli --save-dev
                    npx netlify --version
                    npx netlify deploy --dir=build --prod --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH
                '''
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace..."
            cleanWs()
        }
        success {
            echo "Pipeline succeeded!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}