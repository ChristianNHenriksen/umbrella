import * as chai from "chai";
const should = chai.should();

import { BuildRule } from "../../source/build/build.rule";

describe("Build rules", () => {
    describe("BuildRule", () => {
        it("Should fail if value is missing", () => {
            const build: any = null;
            return BuildRule.guard(build)
                .then(() => Promise.reject("Should have failed"))
                .catch(messages => {
                    messages.should.deep.equal(['"$" was missing']);
                });
        });

        it("Should fail if value is not an object", () => {
            const build = "Something";
            return BuildRule.guard(build)
                .then(() => Promise.reject("Should have failed"))
                .catch(messages => {
                    messages.should.deep.equal(['"$" was not an object']);
                });
        });

        it("Should fail if any fields are invalid", () => {
            const build = { push: { }, repository: { full_name: 42 } }

            return BuildRule.guard(build)
                .then(() => Promise.reject("Should have failed"))
                .catch(messages => {
                    messages.should.deep.equal([
                        '"$.repository.full_name" was not a string'
                    ]);
                });
        });

        it("Should succeed if value is valid", () => {
            const build = { push: { }, repository: { full_name: "team/repo" } }
            return BuildRule.guard(build);
        });
    });
});

