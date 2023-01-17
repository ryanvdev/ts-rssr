import React from "../src";
import { HomePage } from "./HomePage";
import * as Prettier from 'prettier';

const main = async () => {

    const n:number = 100_000;
    let pureHtml:string = '';

    const startTime = process.hrtime.bigint();
    for(let i = 0; i < n; i++){
        const jsxElmnt = HomePage({
            numberOfElements: 5
        });
        pureHtml = React.render(jsxElmnt);
    }
    const endTime = process.hrtime.bigint();
    const totalTime = endTime - startTime;
    const averageTime = parseFloat((totalTime/BigInt(n)) as any);

    console.log('Số lần render: ', n.toLocaleString('en-US'));
    console.log('Trung bình 1 lần render = ', averageTime, 'nanoseconds')
    console.log('Trung bình 1 lần render = ', averageTime/1_000_000, 'milliseconds');
    console.log('Tổng thời gian chạy = ', parseFloat(totalTime as any)/1_000_000, 'milliseconds');

    console.log(pureHtml);
    // console.log('\n');

    // console.log(Prettier.format(pureHtml, {
    //     parser: 'html',
    //     endOfLine: 'lf',
    //     printWidth: 100,
    //     tabWidth: 2,
    // }));
}

main();