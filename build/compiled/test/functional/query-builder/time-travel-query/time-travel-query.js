"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const test_utils_1 = require("../../../utils/test-utils");
const Account_1 = require("./entity/Account");
const Person_1 = require("./entity/Person");
describe("query builder > time-travel-query", () => {
    // -------------------------------------------------------------------------
    // Prepare
    // -------------------------------------------------------------------------
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["cockroachdb"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    // -------------------------------------------------------------------------
    // Reusable functions
    // -------------------------------------------------------------------------
    it("should execute time travel query without options", () => Promise.all(connections.map(async (connection) => {
        const repository = await connection.getRepository(Account_1.Account);
        // create account
        let account = new Account_1.Account();
        account.name = "Edna Barath";
        account.balance = 100;
        await repository.save(account);
        // wait for 5 seconds
        await (0, test_utils_1.sleep)(5000);
        // update account balance
        account.balance = 200;
        await repository.save(account);
        // check if balance updated
        account = await repository
            .createQueryBuilder("account")
            .getOneOrFail();
        account.balance.should.be.equal(200);
        // load account state on 5 seconds back
        account = await repository
            .createQueryBuilder("account")
            .timeTravelQuery()
            .getOneOrFail();
        account.balance.should.be.equal(100);
    })));
    it("should execute time travel query with options", () => Promise.all(connections.map(async (connection) => {
        const repository = await connection.getRepository(Account_1.Account);
        // create account
        let account = new Account_1.Account();
        account.name = "Edna Barath";
        account.balance = 100;
        await repository.save(account);
        // wait for 2 seconds
        await (0, test_utils_1.sleep)(2000);
        // update account balance
        account.balance = 200;
        await repository.save(account);
        // load current account state
        account = await repository
            .createQueryBuilder("account")
            .getOneOrFail();
        account.balance.should.be.equal(200);
        // load account state on 2 seconds back
        account = await repository
            .createQueryBuilder("account")
            .timeTravelQuery("'-2s'")
            .getOneOrFail();
        account.balance.should.be.equal(100);
    })));
    it("should execute time travel query with 'skip' and 'take' options", () => Promise.all(connections.map(async (connection) => {
        const repository = await connection.getRepository(Account_1.Account);
        // create accounts
        for (let i = 1; i < 6; i++) {
            const account = new Account_1.Account();
            account.name = `Person_${i}`;
            account.balance = 100 * i;
            await repository.save(account);
        }
        // wait for 2 seconds
        await (0, test_utils_1.sleep)(2000);
        let accounts = await repository
            .createQueryBuilder("account")
            .getMany();
        // update accounts
        for (let account of accounts) {
            account.balance = account.balance + 100;
            await repository.save(account);
        }
        // load current accounts state
        accounts = await repository
            .createQueryBuilder("account")
            .skip(2)
            .take(3)
            .getMany();
        accounts.length.should.be.equal(3);
        accounts[0].balance.should.be.equal(400);
        accounts[1].balance.should.be.equal(500);
        accounts[2].balance.should.be.equal(600);
        // load accounts state on 2 seconds back
        accounts = await repository
            .createQueryBuilder("account")
            .timeTravelQuery(`'-2s'`)
            .skip(2)
            .take(3)
            .getMany();
        accounts.length.should.be.equal(3);
        accounts[0].balance.should.be.equal(300);
        accounts[1].balance.should.be.equal(400);
        accounts[2].balance.should.be.equal(500);
    })));
    it("should execute time travel query with JOIN and skip/take options", () => Promise.all(connections.map(async (connection) => {
        const accountRepository = await connection.getRepository(Account_1.Account);
        const personRepository = await connection.getRepository(Person_1.Person);
        // create persons and accounts
        for (let i = 1; i < 6; i++) {
            const account = new Account_1.Account();
            account.name = `Person_${i}`;
            account.balance = 100 * i;
            await accountRepository.save(account);
            const person = new Person_1.Person();
            person.account = account;
            await personRepository.save(person);
        }
        // wait for 2 seconds
        await (0, test_utils_1.sleep)(2000);
        const accounts = await accountRepository
            .createQueryBuilder("account")
            .getMany();
        // update accounts
        for (let account of accounts) {
            account.balance = account.balance + 100;
            await accountRepository.save(account);
        }
        // load current accounts state
        let persons = await personRepository
            .createQueryBuilder("person")
            .innerJoinAndSelect("person.account", "account")
            .skip(2)
            .take(3)
            .getMany();
        persons.length.should.be.equal(3);
        persons[0].account.balance.should.be.equal(400);
        persons[1].account.balance.should.be.equal(500);
        persons[2].account.balance.should.be.equal(600);
        // load accounts state on 2 seconds back
        persons = await personRepository
            .createQueryBuilder("person")
            .innerJoinAndSelect("person.account", "account")
            .timeTravelQuery(`'-2s'`)
            .skip(2)
            .take(3)
            .getMany();
        persons.length.should.be.equal(3);
        persons[0].account.balance.should.be.equal(300);
        persons[1].account.balance.should.be.equal(400);
        persons[2].account.balance.should.be.equal(500);
    })));
    it("should execute time travel query with JOIN and limit/offset options", () => Promise.all(connections.map(async (connection) => {
        const accountRepository = await connection.getRepository(Account_1.Account);
        const personRepository = await connection.getRepository(Person_1.Person);
        // create persons and accounts
        for (let i = 1; i < 6; i++) {
            const account = new Account_1.Account();
            account.name = `Person_${i}`;
            account.balance = 100 * i;
            await accountRepository.save(account);
            const person = new Person_1.Person();
            person.account = account;
            await personRepository.save(person);
        }
        // wait for 2 seconds
        await (0, test_utils_1.sleep)(2000);
        const accounts = await accountRepository
            .createQueryBuilder("account")
            .getMany();
        // update accounts
        for (let account of accounts) {
            account.balance = account.balance + 100;
            await accountRepository.save(account);
        }
        // load current accounts state
        let persons = await personRepository
            .createQueryBuilder("person")
            .innerJoinAndSelect("person.account", "account")
            .offset(2)
            .limit(3)
            .getMany();
        persons.length.should.be.equal(3);
        persons[0].account.balance.should.be.equal(400);
        persons[1].account.balance.should.be.equal(500);
        persons[2].account.balance.should.be.equal(600);
        // load accounts state on 2 seconds back
        persons = await personRepository
            .createQueryBuilder("person")
            .innerJoinAndSelect("person.account", "account")
            .timeTravelQuery(`'-2s'`)
            .offset(2)
            .limit(3)
            .getMany();
        persons.length.should.be.equal(3);
        persons[0].account.balance.should.be.equal(300);
        persons[1].account.balance.should.be.equal(400);
        persons[2].account.balance.should.be.equal(500);
    })));
});
//# sourceMappingURL=time-travel-query.js.map