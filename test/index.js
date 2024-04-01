const util = require('./util.js');

const main = () => {
    const starttime = process.hrtime();
    process.on("exit", exitCode => {
        //後始末処理
        const endtimearray = process.hrtime(starttime);
        const memoryUsage = process.memoryUsage();
        function toMByte(byte) {
            return `${Math.floor((byte/1024/1024)*100)/100}MB`;
        }
        const _memoryUsage = JSON.stringify({
            "rss":toMByte(memoryUsage.rss),
            "heapTotal":toMByte(memoryUsage.heapTotal),
            "heapUsed":toMByte(memoryUsage.heapUsed),
            "external":toMByte(memoryUsage.external),
            "arrayBuffers":toMByte(memoryUsage.arrayBuffers)
        });
        console.log(`process statistice - Execution time: ${endtimearray[0]}s ${endtimearray[1] / 1000000}ms, memoryUsage: ${_memoryUsage}`);

    })
    try {
        util.exec('./test/datas/sample1.txt', './test/output/output1.txt')
        util.exec('./test/datas/sample2.txt', './test/output/output2.txt')
        util.exec('./test/datas/sample3.txt', './test/output/output3.txt')
        util.exec('./test/datas/sample4.txt', './test/output/output4.txt')
        util.exec('./test/datas/sample5.txt', './test/output/output5.txt')
        util.exec('./test/datas/sample6.txt', './test/output/output6.txt')
        util.exec('./test/datas/sample7.txt', './test/output/output7.txt')
    } catch (error) {
        
    }
}

main();
