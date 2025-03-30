pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = 'f389d8a8-e9f3-4555-a70d-d0b5677d72b9'
        NETLIFY_AUTH = credentials('netlify-auth-token')
    }

    stages {
        stage('Checkout and Setup') {
            steps {
                echo 'Checking out repository and setting up environment...'
                sh 'ls -la'
            }
        }

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
                    echo "================Testing the project================"
                    mkdir -p test-results
                    npm test -- --forceExit
                    ls -la test-results/
                '''
                junit 'test-results/junit.xml'
            }
        }

        stage('Deploy') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    echo "================Deploying the project================"
                    npm install netlify-cli --save-dev
                    echo "Netlify CLI version:"
                    npx netlify --version
                    echo "Deploying to Netlify Site ID: $NETLIFY_SITE_ID"
                    npx netlify deploy --dir=build --prod --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline completed - cleaning up"
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