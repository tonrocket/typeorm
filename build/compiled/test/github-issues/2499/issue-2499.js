"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../utils/test-utils");
const Foo_1 = require("./entity/Foo");
const chai_1 = require("chai");
describe("github issues > #2499 Postgres DELETE query result is useless", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true,
        // skip test for sqlite because sqlite doesn't return any data on delete
        // sqljs -- the same
        // mongodb requires another test and it is also doesn't return correct number
        // of removed documents (possibly a bug with mongodb itself)
        enabledDrivers: [
            "mysql",
            "mariadb",
            "mssql",
            "postgres",
            "aurora-mysql",
        ],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("should return correct number of affected rows for mysql, mariadb, postgres", () => Promise.all(connections.map(async (connection) => {
        const repo = connection.getRepository(Foo_1.Foo);
        await repo.save({ id: 1, description: "test1" });
        await repo.save({ id: 2, description: "test2" });
        await repo.save({ id: 3, description: "test3" });
        // number 4 doesn't exist
        const result = await repo.delete([1, 2, 3, 4]);
        (0, chai_1.expect)(result.affected).to.eql(3);
    })));
});
//# sourceMappingURL=issue-2499.js.map