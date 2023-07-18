"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("reflect-metadata");
const test_utils_1 = require("../../../utils/test-utils");
const Post_1 = require("./entity/Post");
describe("column kinds > version column", () => {
    let connections;
    before(async () => (connections = await (0, test_utils_1.createTestingConnections)({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    })));
    beforeEach(() => (0, test_utils_1.reloadTestingDatabases)(connections));
    after(() => (0, test_utils_1.closeTestingConnections)(connections));
    it("version column should automatically be set by a database", () => Promise.all(connections.map(async (connection) => {
        const postRepository = connection.getRepository(Post_1.Post);
        // save a new post
        const post = new Post_1.Post();
        post.title = "Post";
        await postRepository.save(post);
        // load and check if version is a date (generated by db)
        const loadedPost = await postRepository.findOneBy({
            id: post.id,
        });
        (0, chai_1.expect)(loadedPost).to.be.not.empty;
        (0, chai_1.expect)(loadedPost.title).to.be.eql("Post");
        (0, chai_1.expect)(loadedPost.version).to.be.eql(1);
    })));
    it("version column should not update version if no changes were detected", () => Promise.all(connections.map(async (connection) => {
        const postRepository = connection.getRepository(Post_1.Post);
        // save a new post
        const post = new Post_1.Post();
        post.title = "Post";
        await postRepository.save(post);
        // update post once again
        const loadedPost1 = await postRepository.findOneByOrFail({
            id: post.id,
        });
        await postRepository.save(loadedPost1);
        // load and check if version was a value set by us
        const loadedPost2 = await postRepository.findOneBy({
            id: post.id,
        });
        // make sure version is the same
        (0, chai_1.expect)(loadedPost2.title).to.be.eql("Post");
        (0, chai_1.expect)(loadedPost2.version).to.be.eql(1);
    })));
    it("version column can also be manually set by user", () => Promise.all(connections.map(async (connection) => {
        const postRepository = connection.getRepository(Post_1.Post);
        // save a new post
        const post = new Post_1.Post();
        post.title = "Post";
        post.version = 5;
        await postRepository.save(post);
        // load and check if version was a value set by us
        const loadedPost = await postRepository.findOneBy({
            id: post.id,
        });
        (0, chai_1.expect)(loadedPost).to.be.not.empty;
        (0, chai_1.expect)(loadedPost.title).to.be.eql("Post");
        (0, chai_1.expect)(loadedPost.version).to.be.eql(5);
    })));
    it("version column should be updated automatically on every change", () => Promise.all(connections.map(async (connection) => {
        const postRepository = connection.getRepository(Post_1.Post);
        // save a new post
        const post = new Post_1.Post();
        post.title = "Post";
        await postRepository.save(post);
        // wait a second
        await (0, test_utils_1.sleep)(1000);
        // update post once again
        post.title = "Updated Title";
        await postRepository.save(post);
        // check if date was updated
        const loadedPostAfterUpdate = await postRepository.findOneBy({
            id: post.id,
        });
        (0, chai_1.expect)(loadedPostAfterUpdate.version).to.be.eql(2);
    })));
    it("version column should set a custom value when specified", () => Promise.all(connections.map(async (connection) => {
        const postRepository = connection.getRepository(Post_1.Post);
        // save a new post
        const post = new Post_1.Post();
        post.title = "Post";
        await postRepository.save(post);
        // update post once again
        post.title = "Updated Title";
        post.version = 6;
        await postRepository.save(post);
        // check if date was updated
        const loadedPost = await postRepository.findOneBy({
            id: post.id,
        });
        (0, chai_1.expect)(loadedPost.version).to.be.eql(6);
    })));
});
//# sourceMappingURL=version-column.js.map