import * as chai from "chai";
const should = chai.should();

import * as http from "http";
import { Rule } from "paradise";
import * as agent from "superagent";
import * as mockito from "ts-mockito";

import { Server } from "../../source/server";
import { CommandService } from "../../source/command/command.service";
import { BuildRouter } from "../../source/build/build.router";

describe("BuildRouter", () => {
    let commandService: CommandService;
    let buildRule: Rule;
    let server: http.Server;

    beforeEach(() => {
        commandService = mockito.mock(CommandService);
        buildRule = mockito.mock(Rule);

        const buildRouter = BuildRouter.create(mockito.instance(commandService), mockito.instance(buildRule));
        server = Server.create(buildRouter, true).listen(3030);
    });

    afterEach((done) => {
        server.close();
        done();
    });

    describe("Add build | POST /builds", () => {
        it("should fail if invalid push", () => {
            mockito
                .when(buildRule.guard(mockito.anything()))
                .thenThrow(["Invalid push"] as any);

            return agent.post("http://localhost:3030/builds")
                .send({ push: { }, repository: { full_name: "team/repo" }})
                .catch(error => error.response)
                .then(response => {
                    response.text.should.equal("Invalid push");
                    response.status.should.equal(400);
                });
        });

        it("should fail if error checking existence of directory", () => {
            mockito
                .when(buildRule.guard(mockito.anything()))
                .thenReturn(Promise.resolve());
            mockito
                .when(commandService.directoryExists(mockito.anything()))
                .thenThrow(new Error("directoryExists error"));

            return agent.post("http://localhost:3030/builds")
                .send({ push: { }, repository: { full_name: "team/repo" }})
                .catch(error => error.response)
                .then(response => {
                    response.text.should.equal("directoryExists error");
                    response.status.should.equal(500);
                });
        });

        it("should fail if error removing directory", () => {
            mockito
                .when(buildRule.guard(mockito.anything()))
                .thenReturn(Promise.resolve());
            mockito
                .when(commandService.directoryExists(mockito.anything()))
                .thenReturn(true);
            mockito
                .when(commandService.removeDirectory(mockito.anything()))
                .thenThrow(new Error("removeDirectory error"));

            return agent.post("http://localhost:3030/builds")
                .send({ push: { }, repository: { full_name: "team/repo" }})
                .catch(error => error.response)
                .then(response => {
                    response.text.should.equal("removeDirectory error");
                    response.status.should.equal(500);
                });
        });

        it("should fail if error making directory", () => {
            mockito
                .when(buildRule.guard(mockito.anything()))
                .thenReturn(Promise.resolve());
            mockito
                .when(commandService.directoryExists(mockito.anything()))
                .thenReturn(true);
            mockito
                .when(commandService.removeDirectory(mockito.anything()))
                .thenReturn();
            mockito
                .when(commandService.makeDirectory(mockito.anything()))
                .thenThrow(new Error("makeDirectory error"));

            return agent.post("http://localhost:3030/builds")
                .send({ push: { }, repository: { full_name: "team/repo" }})
                .catch(error => error.response)
                .then(response => {
                    response.text.should.equal("makeDirectory error");
                    response.status.should.equal(500);
                });
        });

        it("should fail if error executing command", () => {
            mockito
                .when(buildRule.guard(mockito.anything()))
                .thenReturn(Promise.resolve());
            mockito
                .when(commandService.directoryExists(mockito.anything()))
                .thenReturn(true);
            mockito
                .when(commandService.removeDirectory(mockito.anything()))
                .thenReturn();
            mockito
                .when(commandService.makeDirectory(mockito.anything()))
                .thenReturn();
            mockito
                .when(commandService.executeCommand(mockito.anything()))
                .thenThrow(new Error("executeCommand error"));

            return agent.post("http://localhost:3030/builds")
                .send({ push: { }, repository: { full_name: "team/repo" }})
                .catch(error => error.response)
                .then(response => {
                    response.text.should.equal("executeCommand error");
                    response.status.should.equal(500);
                });
        });

        it("should clone repository and run pipeline script", () => {
            mockito
                .when(buildRule.guard(mockito.anything()))
                .thenReturn(Promise.resolve());
            mockito
                .when(commandService.directoryExists(mockito.anything()))
                .thenReturn(true);
            mockito
                .when(commandService.removeDirectory(mockito.anything()))
                .thenReturn();
            mockito
                .when(commandService.makeDirectory(mockito.anything()))
                .thenReturn();
            mockito
                .when(commandService.executeCommand(mockito.anything()))
                .thenReturn("success");

            return agent.post("http://localhost:3030/builds")
                .send({ push: { }, repository: { full_name: "team/repo" }})
                .catch(error => error.response)
                .then(response => {
                    mockito.verify(buildRule.guard(mockito.deepEqual({ push: { }, repository: { full_name: "team/repo" }}))).once();
                    mockito.verify(commandService.directoryExists("builds/team-repo")).once();
                    mockito.verify(commandService.removeDirectory("builds/team-repo")).once();
                    mockito.verify(commandService.makeDirectory("builds/team-repo")).once();
                    mockito.verify(commandService.executeCommand("git clone git@bitbucket.org:team/repo.git builds/team-repo")).once();
                    mockito.verify(commandService.executeCommand("sh builds/team-repo/pipeline.sh")).once();
                    response.status.should.equal(200);
                });
        });
    });
});
