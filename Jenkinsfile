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
                    echo "-----------------Building the project-----------------"
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
                    echo "-------------------Running Tests-----------------------"
                    npm test
                '''
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
                    echo "------------------Installing netlify-cli----------------------"
                    npm install netlify-cli
                    echo "------------------Deploying to Netlify----------------------"
                    npx netlify --version
                    npx netlify deploy --dir=build --prod --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH
                '''
            }
        }

        stage('Post deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    emailext subject: "🎉 Deployment Completed!",
                        body: """
                        <h2>✅ Deployment Successful!</h2>
                        <p>The latest deployment to Netlify has been completed successfully.</p>
                        <p><b>Project:</b> DevOps Jenkins</p>
                        <p><b>Branch:</b> main</p>
                        <p>🌍 <a href="https://my-nodejs-app-65315062.netlify.app">View Deployment</a></p>
                        """,
                        recipientProviders: [[$class: 'DevelopersRecipientProvider']],
                        to: "songpanonkfluk@gmail.com",
                        mimeType: "text/html"
                }
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
