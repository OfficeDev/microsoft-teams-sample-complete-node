#!/usr/bin/env groovy

pipeline {
    agent {
        kubernetes {
            label 'k8s-docker-agent'
        }
    }

    environment {
        DOCKER_IMAGE_NAME = 'knowops/demo-teams-bot'
        DOCKER_HUB_CREDENTIALS = 'jenkins-docker-registry'
        DOCKER_IMAGE = ''
    }

    stages {
        stage("Build Image") {
            steps {
                container('docker') {
                    script {
                        DOCKER_IMAGE = docker.build DOCKER_IMAGE_NAME
                    }
                }
            }
        }

        stage('Publish Image') {
            when {
                environment name: 'BRANCH_NAME', value: 'master'
            }

            steps{
                container('docker') {
                    script {
                        docker.withRegistry( '', DOCKER_HUB_CREDENTIALS ) {
                            DOCKER_IMAGE.push("${BUILD_NUMBER}")
                            DOCKER_IMAGE.push('latest')
                        }
                    }
                }
            }
        }
    }
}
