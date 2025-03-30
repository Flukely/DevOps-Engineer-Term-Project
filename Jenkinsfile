pipeline {
    agent any

    environment {
        // กำหนดตัวแปรสภาพแวดล้อม
        APP_NAME = 'my-nodejs-app'
        REPO_URL = 'https://github.com/Flukely/DevOps-Engineer-Term-Project.git'
        DEPLOY_DIR = 'dist'
        NODE_VERSION = '16' // ใช้เวอร์ชันที่เหมาะสมกับโปรเจคของคุณ
        NETLIFY_SITE_ID = credentials('netlify-site-id') // เก็บใน Jenkins Credentials
        NETLIFY_AUTH_TOKEN = credentials('netlify-auth-token') // เก็บใน Jenkins Credentials
        SLACK_CHANNEL = '#your-channel'
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
                echo 'Installing Node.js and dependencies...'
                sh """
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                    npm install
                """
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                sh """
                    nvm use ${NODE_VERSION}
                    npm run build
                """
                
                // Archive artifacts สำหรับเก็บผลลัพธ์การ build
                archiveArtifacts artifacts: '${DEPLOY_DIR}/**/*', fingerprint: true
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh """
                    nvm use ${NODE_VERSION}
                    npm test
                """
                
                // เก็บผลลัพธ์การทดสอบ (ถ้ามี)
                junit '**/test-results.xml' 
            }
        }

        stage('Code Quality Check') {
            steps {
                echo 'Running linting and code quality checks...'
                sh """
                    nvm use ${NODE_VERSION}
                    npm run lint
                """
                // สามารถเพิ่ม SonarQube analysis ที่นี่ได้
            }
        }

        stage('Deploy to Netlify') {
            when {
                branch 'main' // Deploy เฉพาะเมื่อ merge เข้า branch main
            }
            steps {
                echo 'Deploying to Netlify...'
                sh """
                    nvm use ${NODE_VERSION}
                    npm install -g netlify-cli
                    netlify deploy \
                        --site ${NETLIFY_SITE_ID} \
                        --auth ${NETLIFY_AUTH_TOKEN} \
                        --prod \
                        --dir=${DEPLOY_DIR}
                """
            }
        }

        stage('Post-Deploy') {
            steps {
                echo 'Running post-deploy tasks...'
                // ส่งอีเมลแจ้งเตือน
                emailext body: 'Deployment completed successfully!',
                         subject: 'Deployment Success - ${env.JOB_NAME}',
                         to: 'songpanonk65@nu.ac.th'
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
            echo 'Pipeline failed!'
            // ส่ง notification เมื่อล้มเหลว
            slackSend channel: "${SLACK_CHANNEL}",
                      color: 'danger',
                      message: "Deployment Failed: ${env.JOB_NAME} build ${env.BUILD_NUMBER}\nMore info: ${env.BUILD_URL}"
        }
    }
}