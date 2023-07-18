"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../utils/test-utils");
const User_1 = require("./entity/User");
const Event_1 = require("./entity/Event");
describe("github issues > #1210 mongodb does not have multiple entities properly", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mongodb"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("should save entities properly", () => Promise.all(connections.map(async (connection) => {
        let event1 = new Event_1.Event();
        event1.date = new Date();
        event1.name = "Doing a lil hassle with the typeorm";
        let event2 = new Event_1.Event();
        event2.date = new Date("11/06/2018");
        event2.name =
            "Continue with the development of My Partners in Sports App";
        let event3 = new Event_1.Event();
        event3.date = new Date("11/06/2018");
        event3.name =
            "Continue with the development of My Partners in Sports App";
        let event4 = new Event_1.Event();
        event4.date = new Date("11/06/2018");
        event4.name =
            "Continue with the development of My Partners in Sports App";
        let user1 = new User_1.User();
        user1.firstName = "Vovan";
        user1.lastName = "Supa";
        user1.age = 34;
        user1.events = [event1, event2];
        let user2 = new User_1.User();
        user2.firstName = "Alex1";
        user2.lastName = "Coola1";
        user2.age = 71;
        user2.events = [event2, event3, event4];
        // user2.events.push(event2);
        let users = [user1, user2];
        let events = [event1, event2, event3, event4];
        await connection.mongoManager.save(events);
        await connection.mongoManager.save(users);
    })));
});
//# sourceMappingURL=issue-1210.js.map