# umbrella

A very simple CI/CD server.

At the moment the server only support cloud hosted bitbucket repositories.

### Pipeline
Projects using umbrella have to include a pipeline.sh file in the project root.

The pipeline.sh file should define the pipeline and will be executed on every git push events.

### Setup
1. The build server need to have SSH access to the git repository.
2. Add a webhook triggered by a repository push for URL: <example.com/build-server ip>:<port>/builds
3. Start the umbrella server.
  

### Setup using Ansible
1. Update the hosts file to reflect your build server(s)
2. Run ansible-playbook umbrella.yml

The server files will be places at /umbrella/* and the server will run on port 8080.

### Run server
```
npm run build && npm run start <port>
```

### Run tests
```
npm run build && npm run smoke
```
