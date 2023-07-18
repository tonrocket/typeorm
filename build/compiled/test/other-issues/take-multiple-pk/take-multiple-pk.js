"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const chai_1 = require("chai");
const test_utils_1 = require("../../utils/test-utils");
const Role_1 = require("./entity/Role");
const User_1 = require("./entity/User");
describe("other issues > using take with multiple primary keys", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("should persist successfully and return persisted entity", () => Promise.all(connections.map(async function (connection) {
        // generate bulk array of users with roles
        for (let i = 1; i <= 100; i++) {
            const user = new User_1.User();
            user.id = i;
            user.name = `User ${i}`;
            user.handedness = i % 10 === 0 ? "left" : "right";
            user.roles = [];
            for (let i = 1; i <= 5; i++) {
                const role = new Role_1.Role();
                role.name = "role #" + i;
                user.roles.push(role);
            }
            await connection.manager.save(user);
        }
        (0, chai_1.expect)(true).to.be.true;
        // check if ordering by main object works correctly
        const loadedUsers1 = await connection.manager
            .createQueryBuilder(User_1.User, "user")
            .innerJoinAndSelect("user.roles", "roles")
            .take(10)
            .orderBy("user.id", "DESC")
            .getMany();
        (0, chai_1.expect)(loadedUsers1).not.to.be.undefined;
        loadedUsers1.length.should.be.equal(10);
        loadedUsers1[0].id.should.be.equal(100);
        loadedUsers1[1].id.should.be.equal(99);
        loadedUsers1[2].id.should.be.equal(98);
        loadedUsers1[3].id.should.be.equal(97);
        loadedUsers1[4].id.should.be.equal(96);
        loadedUsers1[5].id.should.be.equal(95);
        loadedUsers1[6].id.should.be.equal(94);
        loadedUsers1[7].id.should.be.equal(93);
        loadedUsers1[8].id.should.be.equal(92);
        loadedUsers1[9].id.should.be.equal(91);
        const lefties = await connection.manager
            .createQueryBuilder(User_1.User, "user")
            .innerJoinAndSelect("user.roles", "roles")
            .where("user.handedness = :handedness", {
            handedness: "left",
        })
            .take(5)
            .orderBy("user.id", "DESC")
            .getMany();
        (0, chai_1.expect)(lefties).not.to.be.undefined;
        lefties.length.should.be.equal(5);
        lefties[0].id.should.be.equal(100);
        lefties[1].id.should.be.equal(90);
        lefties[2].id.should.be.equal(80);
        lefties[3].id.should.be.equal(70);
        lefties[4].id.should.be.equal(60);
        lefties[0].roles.length.should.be.equal(5);
    })));
});
//# sourceMappingURL=take-multiple-pk.js.map