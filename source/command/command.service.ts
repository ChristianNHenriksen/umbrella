import { execSync } from "child_process";
import { mkdirSync, existsSync, rmdirSync } from "fs";

export class CommandService {
    makeDirectory(path: string) {
        mkdirSync(path);
    }

    directoryExists(path: string): boolean {
        return existsSync(path);
    }

    removeDirectory(path: string) {
        rmdirSync(path);
    }

    executeCommand(command: string): string {
        return execSync(command).toString("utf8");
    }
}