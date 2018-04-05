import * as chai from "chai";
const should = chai.should();

import { CommandService } from "../../source/command/command.service";
import { existsSync, rmdirSync, mkdirSync, writeFileSync,  } from "fs";
import { execSync } from "child_process";

const commandService = new CommandService();

describe("CommansService", () => {

    afterEach(() => {
        if (existsSync("builds"))
            execSync("rm -rf builds")
    });

    describe("makeDirectory(path)", () => {

        it("should make directory", () => {
            commandService.makeDirectory("builds")
            existsSync("builds").should.be.true;
        });
    });

    describe("directoryExists(path)", () => {

        it("should find directory", () => {
            mkdirSync("builds");
            commandService.directoryExists("builds").should.be.true;
        });

        it("should not find directory", () => {
            commandService.directoryExists("builds").should.be.false;
        });
    });
    
    describe("removeDirectory(path)", () => {

        it("should remove directory", () => {
            mkdirSync("builds");
            existsSync("builds").should.be.true;
            commandService.removeDirectory("builds")
            existsSync("builds").should.be.false;
        });
    });

    describe("executeShellScript(path)", () => {

        it("should execute command", () => {
            commandService.executeCommand('echo "Hi There!"').should.equal("Hi There!\n");
        });

        it("should execute script file", () => {
            mkdirSync("builds");
            writeFileSync("builds/script.sh", 'echo "Hi There!"');
            commandService.executeCommand("sh builds/script.sh").should.equal("Hi There!\n");
        });
    });
});
