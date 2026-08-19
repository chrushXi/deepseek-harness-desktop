// 测试用假更新源：返回一个高于本地的版本号
// 用法: node scripts/fake-registry.mjs <port>
import http from "node:http";

const port = Number(process.argv[2] || 39999);
const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({
    name: "@deepseek-ai/dsh",
    version: "9.9.9-test",
    dist: { tarball: "http://127.0.0.1:" + port + "/dsh.tgz" },
  }));
});
server.listen(port, "127.0.0.1", () => {
  console.log(`fake registry on http://127.0.0.1:${port}`);
});
