const { execSync } = require("child_process");

const exec = (cmd)=>execSync(cmd, {stdio:"inherit"});

exec("cd scripts && ./makeRes.sh");
exec("cd scripts && ./makeGame.sh release");
exec("cp -rf engine/_dist/* deploy/_dist");
exec("cp -rf engine/_dist/* deploy/content");