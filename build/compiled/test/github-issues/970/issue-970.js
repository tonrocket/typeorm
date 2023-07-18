"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Post_1 = require("./entity/Post");
const test_utils_1 = require("../../utils/test-utils");
describe("github issues > #970 Mongo Bad Sort Specification", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [Post_1.Post],
        enabledDrivers: ["mongodb"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("should order properly without errors", () => Promise.all(connections.map(async (connection) => {
        const postRepository = connection.getMongoRepository(Post_1.Post);
        // save few posts
        const firstPost = new Post_1.Post();
        firstPost.title = "Post";
        firstPost.text = "Everything about post #1";
        await postRepository.save(firstPost);
        const secondPost = new Post_1.Post();
        secondPost.title = "Post";
        secondPost.text = "Everything about post #2";
        await postRepository.save(secondPost);
        const loadedPosts1 = await postRepository.find({
            where: { title: "Post" },
            order: { text: 1 },
        });
        loadedPosts1[0].should.be.instanceOf(Post_1.Post);
        loadedPosts1[0].id.should.be.eql(firstPost.id);
        loadedPosts1[0].title.should.be.equal("Post");
        loadedPosts1[0].text.should.be.equal("Everything about post #1");
        const loadedPosts2 = await postRepository.find({
            where: { title: "Post" },
            order: { text: "ASC" },
        });
        loadedPosts2[0].should.be.instanceOf(Post_1.Post);
        loadedPosts2[0].id.should.be.eql(firstPost.id);
        loadedPosts2[0].title.should.be.equal("Post");
        loadedPosts2[0].text.should.be.equal("Everything about post #1");
        const loadedPosts3 = await postRepository.find({
            where: { title: "Post" },
            order: { text: -1 },
        });
        loadedPosts3[0].should.be.instanceOf(Post_1.Post);
        loadedPosts3[0].id.should.be.eql(secondPost.id);
        loadedPosts3[0].title.should.be.equal("Post");
        loadedPosts3[0].text.should.be.equal("Everything about post #2");
        const loadedPosts4 = await postRepository.find({
            where: { title: "Post" },
            order: { text: "DESC" },
        });
        loadedPosts4[0].should.be.instanceOf(Post_1.Post);
        loadedPosts4[0].id.should.be.eql(secondPost.id);
        loadedPosts4[0].title.should.be.equal("Post");
        loadedPosts4[0].text.should.be.equal("Everything about post #2");
    })));
});
//# sourceMappingURL=issue-970.js.map