pipeline {
    agent {
        docker {
            image "node:${NODE_VERSION}"
            args '-u root' // หลีกเลี่ยงปัญหา permission
        }
    }

    environment {
        APP_NAME = 'my-nodejs-app'
        REPO_URL = 'https://github.com/Flukely/DevOps-Engineer-Term-Project.git'
        DEPLOY_DIR = 'dist'
        NODE_VERSION = '16'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from repository...'
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm run build'
                archiveArtifacts artifacts: '${DEPLOY_DIR}/**/*', fingerprint: true
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
                junit '**/test-results.xml' // เก็บผลลัพธ์การทดสอบ
            }
        }

        stage('Code Quality Check') {
            steps {
                echo 'Running linting...'
                sh 'npm run lint'
            }
        }

        stage('Deploy to Netlify') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to Netlify...'
                withCredentials([
                    string(credentialsId: 'netlify-site-id', variable: 'NETLIFY_SITE_ID'),
                    string(credentialsId: 'netlify-auth-token', variable: 'NETLIFY_AUTH_TOKEN')
                ]) {
                    sh '''
                        npm install -g netlify-cli
                        netlify deploy \
                            --site $NETLIFY_SITE_ID \
                            --auth $NETLIFY_AUTH_TOKEN \
                            --prod \
                            --dir=${DEPLOY_DIR}
                    '''
                }
            }
        }

        stage('Post-Deploy') {
            steps {
                echo 'Deployment completed successfully!'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Check the logs for details.'
        }
    }
}