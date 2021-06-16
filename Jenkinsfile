// Jenkinsfile to build the various modules for the ISS project

properties( [
  buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '7', numToKeepStr: '10')),
  disableConcurrentBuilds(),
  disableResume(),
  pipelineTriggers([cron('H H * * *')])
])

// Repository name use, must end with / or be '' for none
repository = 'docker.ceres.area51.dev/area51/'

// The docker image name
imageName = 'iss'

// The image version based on the branch name - master branch is latest in docker
imageVersion = BRANCH_NAME
if( imageVersion == 'master' ) {
  imageVersion = 'latest'
}

// Node label to handle multiArch manifests
multiArchNode = 'amd64'

// Our targets
targets = [
    [
        name: 'feed',
        dockerFile: 'feed/Dockerfile',
        architectures: [ 'amd64', 'arm64v8' ]
    ]
]

// The docker tag name: architecture can be '' for multiarch images
def dockerTag = {
  name, image, version, architecture -> name + ':' + image + '-' + version + ( architecture=='' ? '' : ( '-' + architecture ) )
}

// The docker image name: architecture can be '' for multiarch images
def dockerImage = {
  name, image, version, architecture -> repository + dockerTag( name, image, version, architecture )
}

// The go arch
def goarch = {
  architecture -> switch( architecture ) {
    case 'arm32v6':
    case 'arm32v7':
      return 'arm'
    case 'arm64v8':
      return 'arm64'
    default:
      return architecture
  }
}

// The go arch variant
def govariant = {
  architecture -> switch( architecture ) {
    case 'arm32v6':
      return '--variant v6'
    case 'arm32v7':
      return '--variant v7'
    default:
      return ''
  }
}

// Map to hold the final multiArch image builds
multiTasks = [:]

// Now run through each target
targets.each {
    target -> L:{
        // Build the tasks for this image
        tasks = [:]

        // Copy the values else the closure will have a reference to the wrong one!
        def name = target.name
        def dockerFile = target.dockerFile

        for(arch in target.architectures ) {
            // Again copy the value not the reference
            def architecture = arch

            def tag = dockerImage( imageName, name, imageVersion, arch )

            tasks[ dockerTag( imageName, target.name, imageVersion, arch ) ] = {
                node( architecture ) {
                    stage( architecture ) {
                        checkout scm
                        sh 'docker build --pull -t ' + tag + ' -f ' + dockerFile + ' .'
                        sh 'docker push ' + tag
                    }
                }
            }
        }

        // MultiArch image
        def multiImage = dockerImage( imageName, name, imageVersion, '' )
        def multiTag = dockerTag( imageName, name, imageVersion, '' )
        def multiArchitectures = target.architectures

        def multiImages = []
        multiArchitectures.each {
            architecture -> L:{
                multiImages << dockerImage( imageName, name, imageVersion, architecture )
            }
        }

        multiTasks[ multiTag ] = {
            node( multiArchNode ) {
                stage( multiTag ) {

                    multiArchitectures.each {
                        architecture -> sh 'docker pull ' + dockerImage( imageName, name, imageVersion, architecture )
                    }

                    sh 'docker manifest create ' + multiImage + ' ' + multiImages.join(' ')

                    multiArchitectures.each {
                        architecture -> sh 'docker manifest annotate' +
                                ' --os linux' +
                                ' --arch ' + goarch( architecture ) + ' ' + govariant( architecture ) +
                                ' ' + multiImage +
                                ' ' + dockerImage( imageName, name, imageVersion, architecture )
                    }

                    sh 'docker manifest push -p ' + multiImage
                }
            }
        }


        stage( name + ' build' ) {
            parallel tasks
        }
    }
}

stage( 'Multiarch' ) {
    parallel multiTasks
}
