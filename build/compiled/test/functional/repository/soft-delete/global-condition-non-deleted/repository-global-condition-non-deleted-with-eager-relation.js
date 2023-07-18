"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const chai_1 = require("chai");
const test_utils_1 = require("../../../../utils/test-utils");
const PostWithRelation_1 = require("./entity/PostWithRelation");
// This test is neccessary because finding with eager relation will be run in the different way
describe(`repository > the global condtion of "non-deleted" with eager relation`, () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it(`The global condition of "non-deleted" should be set for the entity with delete date columns and eager relation`, () => Promise.all(connections.map(async (connection) => {
        const post1 = new PostWithRelation_1.PostWithRelation();
        post1.title = "title#1";
        const post2 = new PostWithRelation_1.PostWithRelation();
        post2.title = "title#2";
        const post3 = new PostWithRelation_1.PostWithRelation();
        post3.title = "title#3";
        await connection.manager.save(post1);
        await connection.manager.save(post2);
        await connection.manager.save(post3);
        await connection.manager.softRemove(post1);
        const loadedPosts = await connection
            .getRepository(PostWithRelation_1.PostWithRelation)
            .find();
        loadedPosts.length.should.be.equal(2);
        const loadedPost2 = loadedPosts.find((p) => p.id === 2);
        (0, chai_1.expect)(loadedPost2).to.exist;
        (0, chai_1.expect)(loadedPost2.deletedAt).to.equals(null);
        (0, chai_1.expect)(loadedPost2.title).to.equals("title#2");
        const loadedPost3 = loadedPosts.find((p) => p.id === 3);
        (0, chai_1.expect)(loadedPost3).to.exist;
        (0, chai_1.expect)(loadedPost3.deletedAt).to.equals(null);
        (0, chai_1.expect)(loadedPost3.title).to.equals("title#3");
    })));
    it(`The global condition of "non-deleted" should not be set when the option "withDeleted" is set to true`, () => Promise.all(connections.map(async (connection) => {
        const post1 = new PostWithRelation_1.PostWithRelation();
        post1.title = "title#1";
        const post2 = new PostWithRelation_1.PostWithRelation();
        post2.title = "title#2";
        const post3 = new PostWithRelation_1.PostWithRelation();
        post3.title = "title#3";
        await connection.manager.save(post1);
        await connection.manager.save(post2);
        await connection.manager.save(post3);
        await connection.manager.softRemove(post1);
        const loadedPosts = await connection
            .getRepository(PostWithRelation_1.PostWithRelation)
            .find({
            withDeleted: true,
        });
        loadedPosts.length.should.be.equal(3);
        const loadedPost1 = loadedPosts.find((p) => p.id === 1);
        (0, chai_1.expect)(loadedPost1).to.exist;
        (0, chai_1.expect)(loadedPost1.deletedAt).to.be.instanceof(Date);
        (0, chai_1.expect)(loadedPost1.title).to.equals("title#1");
        const loadedPost2 = loadedPosts.find((p) => p.id === 2);
        (0, chai_1.expect)(loadedPost2).to.exist;
        (0, chai_1.expect)(loadedPost2.deletedAt).to.equals(null);
        (0, chai_1.expect)(loadedPost2.title).to.equals("title#2");
        const loadedPost3 = loadedPosts.find((p) => p.id === 3);
        (0, chai_1.expect)(loadedPost3).to.exist;
        (0, chai_1.expect)(loadedPost3.deletedAt).to.equals(null);
        (0, chai_1.expect)(loadedPost3.title).to.equals("title#3");
        const loadedPost = await connection
            .getRepository(PostWithRelation_1.PostWithRelation)
            .findOne({
            where: {
                id: 1,
            },
            withDeleted: true,
        });
        (0, chai_1.expect)(loadedPost).to.exist;
        (0, chai_1.expect)(loadedPost.title).to.equals("title#1");
    })));
});
//# sourceMappingURL=repository-global-condition-non-deleted-with-eager-relation.js.map